/** Helpers puros para la TV con estática (fáciles de testear). */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

/** Aproxima `current` hacia `target` a un ritmo `rate` (0..1). */
export function approach(current: number, target: number, rate: number): number {
  const r = clamp(rate, 0, 1)
  return clamp(current + (target - current) * r)
}

/** Magnitud de aceleración (m/s²) de un DeviceMotionEvent. */
export function accelerationMagnitude(
  acc: { x?: number | null; y?: number | null; z?: number | null } | null | undefined,
): number {
  if (!acc) return 0
  return Math.hypot(acc.x ?? 0, acc.y ?? 0, acc.z ?? 0)
}

/** Delta de progreso a partir de la magnitud del agitado. */
export function shakeToProgress(magnitude: number, threshold = 12, scale = 0.06): number {
  if (magnitude < threshold) return 0
  return clamp((magnitude - threshold) * scale, 0, 0.5)
}

/** Nivel de estática 0..1 (1 = ruido total, 0 = imagen limpia). */
export function staticAmount(progress: number): number {
  return clamp(1 - progress)
}

/** ¿Se alcanzó la sintonía? */
export function isTuned(progress: number, threshold = 0.98): boolean {
  return progress >= threshold
}
