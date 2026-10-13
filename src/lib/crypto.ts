/**
 * Cifrado client-side de las fotos privadas.
 *
 * Las fotos se cifran en build-time con AES-256-GCM y una clave derivada por
 * PBKDF2-SHA256 de una contraseña que NUNCA se guarda en el repo. Solo se
 * versiona el texto cifrado + un manifiesto con el salt/IVs (público e inútil
 * sin la contraseña). El descifrado ocurre en el navegador, en memoria.
 */

const encoder = new TextEncoder()

export interface CryptoManifestFile {
  id: string
  enc: string
  iv: string
  bytes: number
}

export interface CryptoManifest {
  v: number
  algo: string
  kdf: string
  iterations: number
  salt: string
  files: CryptoManifestFile[]
}

export function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i)
  return out
}

export function assetUrl(rel: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${rel}`
}

export async function loadManifest(url: string): Promise<CryptoManifest> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('No se pudo cargar el manifiesto de fotos')
  return (await res.json()) as CryptoManifest
}

export async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password) as BufferSource,
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
}

/** Lanza si la contraseña no coincide (el tag de autenticación de GCM falla). */
export async function decryptBlob(
  key: CryptoKey,
  ciphertext: BufferSource,
  iv: Uint8Array,
): Promise<Blob> {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertext,
  )
  return new Blob([plain], { type: 'image/webp' })
}
