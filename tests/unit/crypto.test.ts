// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { b64ToBytes, decryptBlob, deriveKey } from '../../src/lib/crypto'

const encoder = new TextEncoder()

async function keyFor(
  password: string,
  salt: Uint8Array,
  iterations: number,
  usage: KeyUsage[],
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    usage,
  )
}

describe('crypto', () => {
  const password = 'test-passphrase'
  const iterations = 1000
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = encoder.encode('un recuerdo cifrado')

  it('descifra con la contraseña correcta', async () => {
    const encKey = await keyFor(password, salt, iterations, ['encrypt'])
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, encKey, plaintext)

    const decKey = await deriveKey(password, salt, iterations)
    const blob = await decryptBlob(decKey, ct, iv)

    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(plaintext)
  })

  it('falla con una contraseña incorrecta', async () => {
    const encKey = await keyFor(password, salt, iterations, ['encrypt'])
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, encKey, plaintext)

    const decKey = await deriveKey('otra-clave', salt, iterations)

    await expect(decryptBlob(decKey, ct, iv)).rejects.toThrow()
  })

  it('decodifica base64 a bytes', () => {
    expect(Array.from(b64ToBytes('AQID'))).toEqual([1, 2, 3])
  })
})
