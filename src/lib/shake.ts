/** Arma el sensor de movimiento del móvil (agitado) con permiso iOS bajo demanda. */

import { accelerationMagnitude } from './signal'

type MotionEventLike = {
  acceleration?: { x: number | null; y: number | null; z: number | null } | null
  accelerationIncludingGravity?: {
    x: number | null
    y: number | null
    z: number | null
  } | null
}

type DeviceMotionCtor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function readMotion(event: MotionEventLike) {
  return event.acceleration ?? event.accelerationIncludingGravity ?? null
}

/**
 * Escucha el `devicemotion` y llama a `onShake(magnitude)` con cada lectura.
 * En iOS solicita permiso (debe invocarse desde un gesto de usuario).
 * Devuelve una función `disarm` para retirar el listener.
 */
export function armShake(onShake: (magnitude: number) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const DM = (window as unknown as { DeviceMotionEvent?: DeviceMotionCtor })
    .DeviceMotionEvent
  if (!DM) return () => {}

  const onMotion = (event: Event) => {
    const magnitude = accelerationMagnitude(readMotion(event as MotionEventLike))
    if (magnitude > 0) onShake(magnitude)
  }

  let listening = false
  const listen = () => {
    if (listening) return
    listening = true
    window.addEventListener('devicemotion', onMotion)
  }

  if (typeof DM.requestPermission === 'function') {
    DM.requestPermission()
      .then((state) => {
        if (state === 'granted') listen()
      })
      .catch(() => {})
  } else {
    listen()
  }

  return () => {
    if (!listening) return
    listening = false
    window.removeEventListener('devicemotion', onMotion)
  }
}
