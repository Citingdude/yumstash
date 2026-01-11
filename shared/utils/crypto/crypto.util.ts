/**
 * Generates a cryptographically secure random string using a human-readable alphabet.
 * Uses lowercase letters (a-z, excluding l and o) and digits (2-9, excluding 0 and 1)
 * to avoid visual confusion. Provides 120 bits of entropy.
 *
 * @returns A 24-character random string from the reduced alphabet
 */
export function generateSecureRandomString(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789'

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)

  let id = ''
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]!
    // >> 3 "removes" the right-most 3 bits of the byte, using the top 5 bits
    // This gives us values 0-31, which perfectly maps to our 32-character alphabet
    id += alphabet[byte >> 3]
  }
  return id
}

/**
 * Hashes a secret string using SHA-256.
 * Uses the Web Crypto API for cryptographically secure hashing.
 *
 * @param secret - The string to hash
 * @returns A promise that resolves to a Uint8Array containing the SHA-256 hash (32 bytes)
 */
export async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret)
  const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes)
  return new Uint8Array(secretHashBuffer)
}

/**
 * Compares two byte arrays in constant time to prevent timing attacks.
 * Always performs the same number of operations regardless of where the arrays differ.
 *
 * @param a - The first byte array to compare
 * @param b - The second byte array to compare
 * @returns True if the arrays are equal, false otherwise
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false
  }
  let c = 0
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i]! ^ b[i]!
  }
  return c === 0
}
