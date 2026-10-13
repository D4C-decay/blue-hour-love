import { el } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

/** "Nuestra canción": un casete que enlaza a YouTube (usa config.song). */
export function initSong(cfg: LoveConfig): Section {
  const root = el('section', 'song')
  root.id = 'song'

  const title = el('h2', 'song__title', 'Nuestra canción')

  const link = el('a', 'cassette')
  link.href = cfg.song.youtubeUrl
  link.target = '_blank'
  link.rel = 'noreferrer noopener'
  link.setAttribute(
    'aria-label',
    `Escuchar ${cfg.song.title} de ${cfg.song.artist} en YouTube`,
  )

  const label = el('div', 'cassette__label')
  const songTitle = el('span', 'cassette__title', cfg.song.title)
  const artist = el('span', 'cassette__artist', cfg.song.artist)
  label.append(songTitle, artist)

  const reels = el('div', 'cassette__reels')
  const reelA = el('span', 'cassette__reel')
  const reelB = el('span', 'cassette__reel')
  reels.append(reelA, reelB)

  const window_ = el('div', 'cassette__window')
  window_.append(reels)
  const holes = el('div', 'cassette__holes')
  holes.setAttribute('aria-hidden', 'true')

  link.append(label, window_, holes)

  const hint = el('p', 'song__hint', 'Pulsa el casete para escucharla')

  root.append(title, link, hint)
  return { element: root }
}
