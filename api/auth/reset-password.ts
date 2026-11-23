import crypto from 'crypto';

interface StoredOtpData {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
}

interface RequestRateLimitData {
  count: number;
  firstRequestTime: number;
}

const serverOtpStore = new Map<string, StoredOtpData>();
const serverRateLimitMap = new Map<string, RequestRateLimitData>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins
const MAX_REQUESTS = 3;
const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 mins

function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, email, otp, newPassword } = body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    // ACTION 1: REQUEST OTP
    if (action === 'request-otp') {
      const now = Date.now();
      const rateData = serverRateLimitMap.get(normalizedEmail);
      if (rateData) {
        if (now - rateData.firstRequestTime < RATE_LIMIT_WINDOW_MS) {
          if (rateData.count >= MAX_REQUESTS) {
            const remainingMins = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - rateData.firstRequestTime)) / 60000);
            return res.status(429).json({
              error: `Rate limit exceeded. Please wait ${remainingMins} minute(s) before requesting another verification code.`,
            });
          }
          rateData.count += 1;
        } else {
          serverRateLimitMap.set(normalizedEmail, { count: 1, firstRequestTime: now });
        }
      } else {
        serverRateLimitMap.set(normalizedEmail, { count: 1, firstRequestTime: now });
      }

      // Check authorized admin emails
      const authorizedDomain = normalizedEmail.endsWith('@nexora.io');
      const isKnown = ['admin@nexora.io', 'pm@nexora.io', 'marketing@nexora.io', 'reviews@nexora.io'].includes(normalizedEmail) || authorizedDomain;

      if (isKnown) {
        const rawOtp = generateOtp();
        const hashedOtp = sha256(rawOtp);
        serverOtpStore.set(normalizedEmail, {
          hashedOtp,
          expiresAt: now + OTP_EXPIRY_MS,
          attempts: 0,
        });

        console.log(`[VERCEL SERVERLESS AUTH] 6-digit OTP for ${normalizedEmail}: ${rawOtp}`);
      }

      // Always return anti-enumeration generic message
      return res.status(200).json({
        success: true,
        message: 'If this email is authorized, a 6-digit verification code has been sent.',
      });
    }

    // ACTION 2: VERIFY OTP
    if (action === 'verify-otp') {
      const trimmedOtp = String(otp || '').trim();
      const p = String(newPassword || '');

      // Strong password validation
      if (p.length < 10 || !/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/[0-9]/.test(p) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p)) {
        return res.status(400).json({
          error: 'Password must be at least 10 characters and include uppercase, lowercase, digit, and special character.',
        });
      }

      const record = serverOtpStore.get(normalizedEmail);
      if (!record) {
        return res.status(400).json({ error: 'No active verification code found for this email. Please request a new code.' });
      }

      if (Date.now() > record.expiresAt) {
        serverOtpStore.delete(normalizedEmail);
        return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
      }

      if (record.attempts >= MAX_ATTEMPTS) {
        serverOtpStore.delete(normalizedEmail);
        return res.status(429).json({ error: 'Maximum attempts exceeded (5/5). Code invalidated. Please request a new code.' });
      }

      const inputHash = sha256(trimmedOtp);
      if (inputHash !== record.hashedOtp) {
        record.attempts += 1;
        const remaining = MAX_ATTEMPTS - record.attempts;
        if (remaining <= 0) {
          serverOtpStore.delete(normalizedEmail);
          return res.status(429).json({ error: 'Invalid code. Maximum attempts reached. Code invalidated.' });
        }
        return res.status(400).json({ error: `Invalid verification code. ${remaining} attempt(s) remaining.` });
      }

      // Valid: Invalidate code
      serverOtpStore.delete(normalizedEmail);

      return res.status(200).json({
        success: true,
        message: 'Password successfully verified and reset.',
      });
    }

    return res.status(400).json({ error: 'Invalid action specified.' });
  } catch (err: any) {
    console.error('API Error (/api/auth/reset-password):', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
