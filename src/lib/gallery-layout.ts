/** Reparto determinista de la galería: qué recuerdo va en polaroid/TV, roto o con estática. */

export type GalleryKind = 'polaroid' | 'tv'

export interface GalleryVariant {
  kind: GalleryKind
  broken: boolean
  static: boolean
  /** Inclinación en grados (0 para las TVs). */
  tilt: number
}

const TILTS = [-2.6, 1.8, -1.3, 2.4, -1.9, 0, -2.2]

/**
 * Variante de la foto `index`, estable en cada carga.
 * Patrón sobre 7: 0-3 polaroid, 4 polaroid+estática, 5 TV, 6 polaroid rota.
 */
export function galleryVariant(index: number): GalleryVariant {
  const slot = ((index % 7) + 7) % 7
  const kind: GalleryKind = slot === 5 ? 'tv' : 'polaroid'
  return {
    kind,
    static: slot === 4,
    broken: slot === 6,
    tilt: kind === 'tv' ? 0 : (TILTS[slot] ?? 0),
  }
}
