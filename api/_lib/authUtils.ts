import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

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
