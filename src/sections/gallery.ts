import { el } from '../lib/dom'
import { celebrateHearts } from '../lib/hearts'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'
import {
  assetUrl,
  b64ToBytes,
  decryptBlob,
  deriveKey,
  loadManifest,
} from '../lib/crypto'

/** Galería privada: las fotos viven cifradas y se descifran con contraseña. */
export function initGallery(cfg: LoveConfig): Section {
  const root = el('section', 'gallery')
  root.id = 'gallery'

  const title = el('h2', 'gallery__title', cfg.gallery.title)
  const hint = el('p', 'gallery__hint', cfg.gallery.hint)

  const form = el('form', 'gallery__form')
  const label = el('label', 'gallery__label', cfg.gallery.passwordLabel)
  label.htmlFor = 'gallery-pass'
  const input = el('input', 'gallery__input')
  input.type = 'password'
  input.id = 'gallery-pass'
  input.name = 'password'
  input.autocomplete = 'current-password'
  input.required = true
  const button = el('button', 'gallery__button', cfg.gallery.unlock)
  button.type = 'submit'
  form.append(label, input, button)

  const status = el('p', 'gallery__status')
  status.setAttribute('role', 'status')
  status.setAttribute('aria-live', 'polite')

  const grid = el('div', 'gallery__grid')
  grid.hidden = true

  root.append(title, hint, form, status, grid)

  let urls: string[] = []

  function revoke() {
    urls.forEach((u) => URL.revokeObjectURL(u))
    urls = []
  }

  async function unlock(password: string) {
    button.disabled = true
    input.disabled = true
    status.classList.remove('is-error')
    status.textContent = cfg.gallery.loading
    try {
      const manifest = await loadManifest(assetUrl('photos-enc/manifest.json'))
      const key = await deriveKey(
        password,
        b64ToBytes(manifest.salt),
        manifest.iterations,
      )

      const figures: HTMLElement[] = []
      const created: string[] = []
      for (const file of manifest.files) {
        const res = await fetch(assetUrl(`photos-enc/${file.enc}`), {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('No se pudo leer una foto')
        const blob = await decryptBlob(
          key,
          await res.arrayBuffer(),
          b64ToBytes(file.iv),
        )
        const url = URL.createObjectURL(blob)
        created.push(url)

        const figure = el('figure', 'gallery__item')
        const img = el('img', 'gallery__img')
        img.src = url
        img.loading = 'lazy'
        img.decoding = 'async'
        img.alt = cfg.gallery.alt
        figure.append(img)
        figures.push(figure)
      }

      revoke()
      urls = created
      grid.replaceChildren(...figures)
      grid.hidden = false
      form.hidden = true
      hint.hidden = true
      status.classList.remove('is-error')
      status.textContent = cfg.gallery.unlocked
      celebrateHearts()
    } catch {
      revoke()
      status.classList.add('is-error')
      status.textContent = cfg.gallery.wrong
      input.disabled = false
      button.disabled = false
      input.select()
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const value = input.value
    if (!value) return
    void unlock(value)
  })

  return { element: root, start: () => {}, destroy: revoke }
}
