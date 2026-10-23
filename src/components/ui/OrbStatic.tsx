/**
 * Orbe da marca sem 3D: esfera azul com o simbolo prateado no centro (mesmo desenho do orbe three.js).
 * Aparece na hora; o 3D, quando entra, fica por cima.
 */
export function OrbStatic({ background }: { background: string }) {
  return (
    <span className="absolute inset-0 block rounded-full" style={{ background }}>
      <img
        src="/logos/simbolo-prata.webp"
        alt=""
        width={64}
        height={64}
        decoding="async"
        className="absolute top-1/2 left-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2 opacity-95"
      />
    </span>
  )
}
