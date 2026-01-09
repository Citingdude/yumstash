import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

const SALT_LENGTH = 16
const KEY_LENGTH = 64
// Note: Node.js scrypt uses sensible defaults (N=16384, r=8, p=1)

/**
 * Utility class for secure password operations using scrypt.
 * Provides methods for hashing and verifying passwords with production-ready security.
 */
export class PasswordUtil {
  /**
   * Hashes a password using scrypt with a random salt.
   * Stores the salt and hash together in the format: salt.hash (both base64 encoded).
   * This is production-ready and resistant to brute-force attacks.
   *
   * @param password - The plain text password to hash
   * @returns A promise that resolves to a string in the format "salt.hash" (base64 encoded)
   */
  static async hash(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH)
    const derivedKey = (await scryptAsync(
      password,
      salt,
      KEY_LENGTH,
    )) as Buffer

    // Store salt and hash together: salt.hash
    return `${salt.toString('base64')}.${derivedKey.toString('base64')}`
  }

  /**
   * Verifies a password against a stored hash.
   * Uses constant-time comparison to prevent timing attacks.
   *
   * @param password - The plain text password to verify
   * @param storedHash - The stored hash in the format "salt.hash" (from hash method)
   * @returns A promise that resolves to true if the password matches, false otherwise
   */
  static async verify(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [saltBase64, hashBase64] = storedHash.split('.')

    if (!saltBase64 || !hashBase64) {
      return false
    }

    const salt = Buffer.from(saltBase64, 'base64')
    const storedKey = Buffer.from(hashBase64, 'base64')

    const derivedKey = (await scryptAsync(
      password,
      salt,
      KEY_LENGTH,
    )) as Buffer

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(storedKey, derivedKey)
  }
}
