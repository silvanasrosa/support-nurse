// Mesmo azul "vidro" do orbe do preloader e do titulo da hero
export const ORB_FILL =
  'radial-gradient(120% 90% at 32% 26%, #4b5fae 0%, #2f3b80 28%, #242b55 55%, #181d44 80%, #121633 100%)'

/** Orbe leve (so CSS, sem WebGL) com o simbolo prata: para elementos que se movem muito, como trilhas de rolagem. */
export function CssOrb({ className = '' }: { className?: string }) {
  return (
    <span
      className={`relative block rounded-full ${className}`}
      style={{
        background: ORB_FILL,
        boxShadow: '0 10px 24px rgba(36,43,85,0.35), inset 0 -5px 10px rgba(0,0,0,0.28), inset 0 3px 8px rgba(255,255,255,0.18)',
      }}
    >
      <span className="absolute inset-[20%] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url(/logos/simbolo-prata.webp)' }} />
      <span className="absolute top-[10%] left-[22%] h-[26%] w-[38%] rounded-full bg-white/25 blur-[2px]" />
    </span>
  )
}
