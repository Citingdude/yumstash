/**
 * Encodes a Uint8Array to a base64 string.
 * Works in both Node.js (using Buffer) and browser environments (using btoa).
 *
 * @param bytes - The byte array to encode
 * @returns The base64-encoded string
 * @throws {Error} If base64 encoding is not supported in the current environment
 */
export function encodeBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }

  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]

    if (!byte) {
      continue
    }

    binary += String.fromCharCode(byte)
  }

  if (typeof btoa === 'function') {
    return btoa(binary)
  }

  throw new Error('Base64 encoding is not supported in this environment')
}

/**
 * Decodes a base64 string to a Uint8Array.
 * Works in both Node.js (using Buffer) and browser environments (using atob).
 *
 * @param value - The base64-encoded string to decode
 * @returns The decoded byte array
 * @throws {Error} If base64 decoding is not supported in the current environment
 */
export function decodeBase64(value: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64'))
  }

  if (typeof atob === 'function') {
    const binary = atob(value)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  throw new Error('Base64 decoding is not supported in this environment')
}
