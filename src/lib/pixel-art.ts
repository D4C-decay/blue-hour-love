/** Pixel-art mínima en SVG (sin dependencias), escalable y nítida. */

type Palette = Record<string, string>

/** Convierte una rejilla de caracteres en un `<svg>` de píxeles nítidos. */
export function pixelSvg(grid: string[], palette: Palette): string {
  const height = grid.length
  const width = grid.reduce((max, row) => Math.max(max, row.length), 0)
  const rects: string[] = []
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const fill = palette[row[x] ?? '']
      if (!fill) continue
      rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`)
    }
  })
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
    `shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` +
    rects.join('') +
    `</svg>`
  )
}

const FACE = 'var(--cyan, #38e8ff)'

const NEUTRAL_FACE = [
  '.....fffff.....',
  '...fffffffff...',
  '..fffffffffff..',
  '.fffffffffffff.',
  '.ffoofffffooff.',
  '.ffoofffffooff.',
  '.fffffffffffff.',
  '.fffffffffffff.',
  '.fffffffffffff.',
  '...ooooooooo...',
  '.fffffffffffff.',
  '..fffffffffff..',
  '...fffffffff...',
  '.....fffff.....',
]

const CRYING_FACE = [
  '.....fffff.....',
  '...fffffffff...',
  '..fffffffffff..',
  '.fffffffffffff.',
  '.ffoofffffooff.',
  '.fffffffffffff.',
  '.ffftffffftfff.',
  '.ffftffffftfff.',
  '.fffffffffffff.',
  '.....ooooo.....',
  '.....ooooo.....',
  '.fffffffffffff.',
  '..fffffffffff..',
  '...fffffffff...',
  '.....fffff.....',
]

/** Cara neutra `._.` (ojos de punto y boca recta). */
export function neutralFaceSvg(): string {
  return pixelSvg(NEUTRAL_FACE, { f: FACE, o: '#05050c' })
}

/** Cara llorando `;-;` (ojos cerrados con lágrimas y boca abierta). */
export function cryingFaceSvg(): string {
  return pixelSvg(CRYING_FACE, { f: FACE, o: '#05050c', t: '#8ef7ff' })
}

const HEART = [
  '.wo.....oo.',
  'wooo...oooo',
  'ooooooooooo',
  'ooooooooooo',
  'ooooooooooo',
  '.ooooooooo.',
  '..ooooooo..',
  '...ooooo...',
  '....ooo....',
  '.....o.....',
]

/** Corazón 8-bit rojo. */
export function heartSvg(): string {
  return pixelSvg(HEART, {
    o: '#ff2f45',
    w: '#ff8fa3',
  })
}
