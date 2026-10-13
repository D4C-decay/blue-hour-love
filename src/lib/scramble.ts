/** Resolución de texto tipo radio/CRT: los caracteres se "sintonizan" del ruido. */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$*+=<>/\\|~^¡!¿?░▒▓█0123456789'

/**
 * Devuelve el texto a medio resolver para un progreso 0..1.
 * Puro y determinista si se inyecta un `random` fijo (útil para tests).
 */
export function scrambleFrame(
  text: string,
  progress: number,
  random: () => number = Math.random,
): string {
  const p = progress <= 0 ? 0 : progress >= 1 ? 1 : progress
  const revealed = Math.floor(text.length * p)
  let out = ''
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i] ?? ''
    if (ch === ' ' || i < revealed) {
      out += ch
      continue
    }
    const idx = Math.floor(random() * GLYPHS.length)
    out += GLYPHS[idx] ?? ch
  }
  return out
}
