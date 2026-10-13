import { describe, it, expect } from 'vitest'
import { galleryVariant } from '../../src/lib/gallery-layout'

describe('galleryVariant', () => {
  it('es determinista para un mismo índice', () => {
    expect(galleryVariant(3)).toEqual(galleryVariant(3))
  })

  it('reparte TVs, roturas y estática entre 13 recuerdos', () => {
    const variants = Array.from({ length: 13 }, (_, i) => galleryVariant(i))
    expect(variants.some((v) => v.kind === 'tv')).toBe(true)
    expect(variants.some((v) => v.broken)).toBe(true)
    expect(variants.some((v) => v.static)).toBe(true)
  })

  it('las TVs no se inclinan y las polaroids quedan en un rango suave', () => {
    for (let i = 0; i < 13; i += 1) {
      const v = galleryVariant(i)
      if (v.kind === 'tv') {
        expect(v.tilt).toBe(0)
      } else {
        expect(Math.abs(v.tilt)).toBeLessThanOrEqual(3)
      }
    }
  })

  it('nunca marca rota y estática a la vez', () => {
    for (let i = 0; i < 13; i += 1) {
      const v = galleryVariant(i)
      expect(v.broken && v.static).toBe(false)
    }
  })
})
