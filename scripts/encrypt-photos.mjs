/**
 * Cifra las fotos de public/photos/*.webp y escribe:
 *   - public/photos-enc/<id>.webp.enc  (texto cifrado, se versiona)
 *   - public/photos-enc/manifest.json  (salt + IVs, se versiona)
 *
 * Uso:
 *   PHOTO_PASSWORD='tu passphrase' npm run photos:encrypt
 *
 * La contraseña NO se guarda en el repositorio.
 */
import { webcrypto as crypto } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '..', 'public', 'photos')
const outDir = path.resolve(__dirname, '..', 'public', 'photos-enc')
const ITERATIONS = 600000
const encoder = new TextEncoder()

function b64(bytes) {
  return Buffer.from(bytes).toString('base64')
}

async function main() {
  const password = process.env.PHOTO_PASSWORD
  if (!password || password.length < 8) {
    console.error('Falta PHOTO_PASSWORD (mínimo 8 caracteres).')
    process.exit(1)
  }

  const entries = (await fs.readdir(srcDir)).filter((f) => f.endsWith('.webp')).sort()
  if (entries.length === 0) {
    console.error(`No hay fotos .webp en ${srcDir}`)
    process.exit(1)
  }

  await fs.rm(outDir, { recursive: true, force: true })
  await fs.mkdir(outDir, { recursive: true })

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )

  const files = []
  for (let i = 0; i < entries.length; i += 1) {
    const id = `p${String(i + 1).padStart(2, '0')}`
    const data = new Uint8Array(await fs.readFile(path.join(srcDir, entries[i])))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const ct = new Uint8Array(
      await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data),
    )
    await fs.writeFile(path.join(outDir, `${id}.webp.enc`), ct)
    files.push({ id, enc: `${id}.webp.enc`, iv: b64(iv), bytes: ct.length })
    console.log(`✓ ${id}  ←  ${entries[i]}`)
  }

  const manifest = {
    v: 1,
    algo: 'AES-GCM',
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: b64(salt),
    files,
  }
  await fs.writeFile(
    path.join(outDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  console.log(`\n${files.length} fotos cifradas en ${path.relative(process.cwd(), outDir)}`)
  console.log('Recuerda: la contraseña no queda en el repositorio.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
