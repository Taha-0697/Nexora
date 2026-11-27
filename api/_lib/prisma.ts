import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Normalizes Neon PostgreSQL connection strings for Prisma:
 * - Strips `channel_binding` which causes 15s+ TLS handshake stalls on Windows / OpenSSL
 * - Ensures `sslmode=require` for secure encrypted TLS connections
 * - Ensures `pgbouncer=true` when using Neon's `-pooler` endpoint
 * - Sets generous connection and pool timeouts (30s) so Neon cold-start compute wake-up succeeds
 */
export function buildNeonPrismaUrl(): string | undefined {
  const rawUrl = (process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || '').trim();
  if (!rawUrl) return undefined;

  try {
    const parsed = new URL(rawUrl);
    // Strip channel_binding to eliminate 15s TLS handshake stall
    parsed.searchParams.delete('channel_binding');

    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require');
    }
    if (parsed.hostname.includes('-pooler.') && !parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true');
    }
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '30');
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '30');
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

const resolvedUrl = buildNeonPrismaUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(resolvedUrl ? { datasources: { db: { url: resolvedUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

const TRANSIENT_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

export function isTransientDbError(err: any): boolean {
  if (!err) return false;
  const code = String(err.code || err.errorCode || '');
  if (TRANSIENT_CODES.has(code)) return true;

  const msg = String(err.message || '');
  return (
    msg.includes("Can't reach database server") ||
    msg.includes('Server has closed the connection') ||
    msg.includes('ConnectionReset') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Connection pool timeout') ||
    msg.includes('timed out')
  );
}

export function formatDbError(err: any, fallback = 'Database operation failed.'): string {
  if (!err) return fallback;
  if (isTransientDbError(err)) {
    return 'Unable to reach Neon PostgreSQL right now (the database compute may be waking up or experiencing a transient network hiccup). Please try again in a few seconds.';
  }
  const msg = String(err.message || '').trim();
  if (msg.includes('Invalid `prisma.') || msg.includes('Invalid prisma.')) {
    return fallback;
  }
  return msg || fallback;
}

/**
 * Executes a Prisma operation with generous 25s timeout and automatic retry
 * on transient Neon compute wake-up or connection pool reset errors.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  options: { retries?: number; timeoutMs?: number; errorMsg?: string } = {}
): Promise<T> {
  const retries = options.retries ?? 2;
  const timeoutMs = options.timeoutMs ?? 25000;
  const fallbackMsg =
    options.errorMsg ??
    'Database query timed out. Please verify DATABASE_URL in .env points to an active Neon PostgreSQL instance.';

  let lastErr: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    let timer: any;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(fallbackMsg)), timeoutMs);
      });
      return await Promise.race([operation(), timeoutPromise]);
    } catch (err: any) {
      lastErr = err;
      const canRetry = attempt < retries && isTransientDbError(err);
      if (!canRetry) {
        if (isTransientDbError(err)) {
          const friendly = new Error(formatDbError(err, fallbackMsg));
          (friendly as any).statusCode = 503;
          (friendly as any).cause = err;
          throw friendly;
        }
        throw err;
      }

      console.warn(
        `[Nexora DB] Transient Neon connection error (attempt ${attempt + 1}/${retries + 1}), retrying in ${attempt === 0 ? '800ms' : '2000ms'}...`,
        err?.code || err?.message?.split('\n')?.[0]
      );

      await new Promise((r) => setTimeout(r, attempt === 0 ? 800 : 2000));
    } finally {
      clearTimeout(timer);
    }
  }

  const friendly = new Error(formatDbError(lastErr, fallbackMsg));
  (friendly as any).statusCode = 503;
  throw friendly;
}

export default prisma;
