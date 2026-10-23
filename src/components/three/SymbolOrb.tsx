import { Environment, Lightformer, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const TILT = 0.13 // inclinacao maxima (rad): o emblema se move pouco e fica sempre perto do centro do orbe
const SWAY = 0.025 // balanco automatico, bem sutil

/**
 * Posicao do mouse normalizada pela TELA inteira (-1 a 1, centro = 0).
 * O ponteiro do R3F e relativo ao proprio canvas (que aqui e minusculo), por isso saturava
 * e o simbolo so mudava de lado quando o mouse passava do orbe.
 */
function useViewportPointer() {
  const p = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return p
}

/** So anima enquanto o orbe esta na tela e a aba esta visivel (fora disso, nenhum quadro e desenhado). */
function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState !== 'hidden')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(el)
    const onVis = () => setTabVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ref])
  return inView && tabVisible
}

function Orb({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useViewportPointer()
  // O simbolo e um "decalque" curvo: um pedaco da propria esfera com a textura do logo, entao faz parte do orbe
  const map = useTexture('/logos/simbolo-prata.webp', (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
  const a = 1.0 // abertura angular (rad) do decalque

  useFrame((state, dt) => {
    const g = group.current
    if (!g || reduce) return
    const t = state.clock.elapsedTime
    const { x, y } = pointer.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * TILT + Math.sin(t * 0.7) * SWAY, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, y * TILT + Math.cos(t * 0.5) * SWAY * 0.8, 3, dt)
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#232b66"
          metalness={0.3}
          roughness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.25}
          envMapIntensity={0.55}
        />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <sphereGeometry args={[1.006, 64, 64, Math.PI / 2 - a / 2, a, Math.PI / 2 - a / 2, a]} />
        <meshPhysicalMaterial
          map={map}
          transparent
          alphaTest={0.02}
          metalness={0.55}
          roughness={0.42}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={0.55}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
    </group>
  )
}

/** Orbe 3D inline (substitui o "o" do titulo): esfera de vidro azul marinho com o simbolo metalico embutido. */
export default function SymbolOrb({ reduce = false }: { reduce?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const live = useOnScreen(wrap)
  return (
    <div ref={wrap} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        resize={{ offsetSize: true }}
        frameloop={reduce || !live ? 'demand' : 'always'}
        camera={{ position: [0, 0, 4.3], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        aria-hidden
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[-3, 4, 5]} intensity={1.5} />
        <pointLight position={[3, -2, 3]} intensity={6} color="#6f9bff" />
        <Environment resolution={64}>
          <Lightformer form="circle" intensity={2.2} position={[-3, 3, 4]} scale={6} />
          <Lightformer form="circle" intensity={1} color="#7aa7ff" position={[4, -1, 3]} scale={5} />
          <Lightformer form="circle" intensity={1.4} color="#ffffff" position={[0, 0, 8]} scale={14} />
        </Environment>
        <Orb reduce={reduce} />
      </Canvas>
    </div>
  )
}
