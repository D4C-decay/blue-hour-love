import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '../../..', 'Escritorio', 'tvgirl')
const outDir = path.resolve(__dirname, '..', 'public', 'photos')

async function ensureOut() {
  await fs.mkdir(outDir, { recursive: true })
}

async function optimize() {
  await ensureOut()
  const entries = await fs.readdir(srcDir)
  const images = entries.filter((f) =>
    /\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/.test(f),
  )

  for (const f of images) {
    const inPath = path.join(srcDir, f)
    const base = path.basename(f, path.extname(f))
    const outPath = path.join(outDir, `${base}.webp`)
    try {
      await sharp(inPath)
        .rotate()
        .metadata()
      await sharp(inPath)
        .rotate()
        .withMetadata({})
        .webp({ quality: 78, effort: 5 })
        .resize({ width: 1600, withoutEnlargement: true })
        .toFile(outPath)
      console.log('✓', base)
    } catch (err) {
      console.warn('skip', f, err)
    }
  }
}

optimize().catch((e) => {
  console.error(e)
  process.exit(1)
})
