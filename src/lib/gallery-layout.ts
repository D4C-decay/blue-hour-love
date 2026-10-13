/** Reparto determinista de la galería: qué polaroid va con estática o con quemadura. */

export interface GalleryVariant {
  /** Estática moderada sobre la foto. */
  static: boolean
  /** Marcas de quemadura en los bordes del papel. */
  burn: boolean
  /** Inclinación en grados. */
  tilt: number
}

const TILTS = [-2.6, 1.8, -1.3, 2.4, -1.9, 1.4, -2.2]

/**
 * Variante de la foto `index`, estable en cada carga.
 * Patrón sobre 7: 2 y 6 quedan quemadas, 4 con estática, el resto limpias.
 */
export function galleryVariant(index: number): GalleryVariant {
  const slot = ((index % 7) + 7) % 7
  return {
    static: slot === 4,
    burn: slot === 2 || slot === 6,
    tilt: TILTS[slot] ?? 0,
  }
}
