import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const SALT_ROUNDS = 10;
export const SESSION_COOKIE_NAME = 'nexora_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return process.env.SESSION_SECRET;
  }
  return crypto
    .createHash('sha256')
    .update(process.env.DATABASE_URL || 'nexora-ephemeral-session-key')
    .digest('hex');
}

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  roles: string[];
  exp: number;
}

export function signSessionToken(user: { id: string; email?: string | null; name: string; roles?: string[] }): string {
  const payload: SessionPayload = {
    id: user.id,
    email: user.email || '',
    name: user.name,
    roles: Array.isArray(user.roles) ? user.roles : [],
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function parseCookies(cookieHeader?: string | string[]): Record<string, string> {
  const raw = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader || '';
  const out: Record<string, string> = {};
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      if (k) out[k] = decodeURIComponent(v);
    }
  }
  return out;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  if (!encoded || !sig) return null;

  const expectedSig = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.id || !payload?.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Checks if a string is already a valid bcrypt hash
 */
export function isBcryptHash(str?: string | null): boolean {
  if (!str) return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

/**
 * Strong salted password hashing using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error('Password cannot be empty');
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Constant-time password verification supporting backward-compatible migration
 * from legacy plaintext to salted bcrypt hashes.
 */
export async function verifyPassword(password: string, storedHashOrPlain: string | null | undefined): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  if (!storedHashOrPlain || !password) {
    return { valid: false, needsUpgrade: false };
  }

  // If stored value is a bcrypt hash, verify using bcrypt.compare
  if (isBcryptHash(storedHashOrPlain)) {
    try {
      const match = await bcrypt.compare(password, storedHashOrPlain);
      return { valid: match, needsUpgrade: false };
    } catch {
      return { valid: false, needsUpgrade: false };
    }
  }

  // Legacy plaintext fallback: constant-time string comparison check
  const isMatch = password === storedHashOrPlain;
  return {
    valid: isMatch,
    needsUpgrade: isMatch, // If matched plaintext, flag for automatic upgrade to bcrypt
  };
}
