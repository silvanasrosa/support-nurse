/** Aplica (ou remove, com `null`) o contorno em ponte de um anel entalhado via clip-path. */
export function applyRingPath(ring: HTMLElement, d: string | null) {
  ring.style.clipPath = d ? `path('${d}')` : ''
}
