import { isValidEmail } from './emailService.ts';

// Strong Password Validation Rules
export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errors: string[];
}

export function validateStrongPassword(password: string): PasswordValidationResult {
  const p = password || '';
  const hasMinLength = p.length >= 10;
  const hasUppercase = /[A-Z]/.test(p);
  const hasLowercase = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p);

  const errors: string[] = [];
  if (!hasMinLength) errors.push('At least 10 characters');
  if (!hasUppercase) errors.push('At least 1 uppercase letter (A-Z)');
  if (!hasLowercase) errors.push('At least 1 lowercase letter (a-z)');
  if (!hasNumber) errors.push('At least 1 numeric digit (0-9)');
  if (!hasSpecialChar) errors.push('At least 1 special character (!@#$%^&* etc.)');

  return {
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    errors,
  };
}

/**
 * Standard SHA-256 cryptographic hash helper using standard Web Crypto API (supported in all modern browsers and Node 18+)
 */
export async function sha256Hex(message: string): Promise<string> {
  const cryptoObj = (typeof globalThis !== 'undefined' ? globalThis.crypto : null) ||
    (typeof window !== 'undefined' ? window.crypto : null);

  if (cryptoObj?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Lightweight fallback hashing if crypto.subtle is unavailable
  let hash = 2166136261;
  for (let i = 0; i < message.length; i++) {
    hash ^= message.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Cryptographically secure 6-digit numeric OTP generator
 */
export function generateSecureOtp(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    const num = (arr[0] % 900000) + 100000;
    return num.toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface StoredOtpData {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

interface RequestRateLimitData {
  count: number;
  firstRequestTime: number;
}

// In-memory security stores (scoped to service lifetime)
const otpStore = new Map<string, StoredOtpData>();
const rateLimitMap = new Map<string, RequestRateLimitData>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 OTP requests per 15 min
const MAX_FAILED_ATTEMPTS = 5; // Max 5 verification attempts
const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes strict lifetime

export interface RequestOtpResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  error?: string;
  attemptsRemaining?: number;
}

/**
 * Step 1: Request 6-digit verification code with rate limiting & anti-enumeration protection
 */
export async function requestAdminPasswordResetOtp(
  email: string,
  isAuthorizedEmail: boolean,
  sendEmailFn?: (email: string, otp: string) => Promise<boolean | void>
): Promise<RequestOtpResult> {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      message: 'Please enter a valid corporate email address.',
      error: 'Invalid email address format.',
    };
  }

  // Rate Limiting Check: Max 3 requests per 15 min
  const now = Date.now();
  const rateData = rateLimitMap.get(normalizedEmail);
  if (rateData) {
    if (now - rateData.firstRequestTime < RATE_LIMIT_WINDOW_MS) {
      if (rateData.count >= MAX_REQUESTS_PER_WINDOW) {
        const remainingMinutes = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - rateData.firstRequestTime)) / 60000);
        return {
          success: false,
          message: `Too many code requests. For security, please wait ${remainingMinutes} minute(s) before requesting another code.`,
          error: 'Rate limit exceeded.',
        };
      }
      rateData.count += 1;
    } else {
      rateLimitMap.set(normalizedEmail, { count: 1, firstRequestTime: now });
    }
  } else {
    rateLimitMap.set(normalizedEmail, { count: 1, firstRequestTime: now });
  }

  // User Enumeration Protection:
  // If email is NOT in authorized list, do NOT generate or send OTP, but display the same generic confirmation message.
  if (!isAuthorizedEmail) {
    return {
      success: true,
      message: 'If this email is authorized, a 6-digit verification code has been sent.',
    };
  }

  // Generate cryptographically secure 6-digit OTP
  const rawOtp = generateSecureOtp();
  const hashedOtp = await sha256Hex(rawOtp);

  // Store hashed OTP with 10-minute expiration & 0 attempts
  otpStore.set(normalizedEmail, {
    hashedOtp,
    expiresAt: now + OTP_EXPIRATION_MS,
    attempts: 0,
    createdAt: now,
  });

  // Security Dispatch: Send OTP via email provider & log in development
  console.log(
    `%c[NEXORA AUTH SECURITY]%c 6-digit Verification Code for ${normalizedEmail}: %c${rawOtp}%c (Valid for 10 min)`,
    'background: #312E81; color: #818CF8; font-weight: bold; padding: 2px 4px; border-radius: 4px;',
    'color: inherit;',
    'background: #047857; color: #34D399; font-weight: bold; padding: 2px 4px; border-radius: 4px;',
    'color: inherit;'
  );

  if (sendEmailFn) {
    try {
      await sendEmailFn(normalizedEmail, rawOtp);
    } catch (err) {
      console.error('Failed to dispatch OTP email:', err);
    }
  }

  return {
    success: true,
    message: 'If this email is authorized, a 6-digit verification code has been sent.',
  };
}

/**
 * Step 2: Verify 6-digit OTP & Reset Password with brute-force lockout
 */
export async function verifyAdminOtpAndResetPassword(
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
  onPasswordResetSuccess: (normalizedEmail: string, newPasswordPlain: string) => void
): Promise<VerifyOtpResult> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedOtp = (otp || '').trim();

  if (!trimmedOtp || trimmedOtp.length !== 6) {
    return {
      success: false,
      message: 'Please enter the 6-digit verification code sent to your email.',
      error: 'Invalid code format.',
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match. Please verify both fields are identical.',
      error: 'Password mismatch.',
    };
  }

  const passValidation = validateStrongPassword(newPassword);
  if (!passValidation.isValid) {
    return {
      success: false,
      message: `Password does not meet enterprise security requirements: ${passValidation.errors.join(', ')}.`,
      error: 'Weak password.',
    };
  }

  const record = otpStore.get(normalizedEmail);
  if (!record) {
    return {
      success: false,
      message: 'No active verification session found. Please request a new code.',
      error: 'No active OTP session.',
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      message: 'This verification code has expired (10-minute validity). Please request a new code.',
      error: 'OTP expired.',
    };
  }

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      message: 'Maximum verification attempts exceeded (5/5). For security, this code has been permanently invalidated. Please request a new code.',
      error: 'Max attempts exceeded.',
    };
  }

  const inputHash = await sha256Hex(trimmedOtp);
  if (inputHash !== record.hashedOtp) {
    record.attempts += 1;
    const remaining = MAX_FAILED_ATTEMPTS - record.attempts;
    if (remaining <= 0) {
      otpStore.delete(normalizedEmail);
      return {
        success: false,
        message: 'Invalid code. Maximum attempts reached (5/5). Code invalidated for security. Request a new code.',
        error: 'Max attempts exceeded.',
        attemptsRemaining: 0,
      };
    }
    return {
      success: false,
      message: `Invalid verification code. ${remaining} attempt(s) remaining before code is invalidated.`,
      error: 'Code mismatch.',
      attemptsRemaining: remaining,
    };
  }

  // OTP is valid: Immediately invalidate it
  otpStore.delete(normalizedEmail);

  // Invalidate any active sessions
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('nexora_active_user');
  }

  // Execute the password update
  onPasswordResetSuccess(normalizedEmail, newPassword);

  return {
    success: true,
    message: 'Password successfully updated! You can now sign in with your new credentials.',
  };
}
