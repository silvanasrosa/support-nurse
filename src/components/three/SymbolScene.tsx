import { Float, Lightformer, Environment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useSymbolGeometry } from './useSymbolGeometry'

function Symbol({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null)
  const geometry = useSymbolGeometry()
  const viewportWidth = useThree((s) => s.viewport.width)
  const fit = Math.min(1, viewportWidth / 3.1)

  useFrame((state, dt) => {
    const g = group.current
    if (!g || reduce) return
    const t = state.clock.elapsedTime
    const targetY = -0.28 + state.pointer.x * 0.55 + Math.sin(t * 0.5) * 0.18
    const targetX = 0.08 - state.pointer.y * 0.35 + Math.cos(t * 0.4) * 0.06
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt)
  })

  return (
    <Float speed={reduce ? 0 : 1.4} rotationIntensity={0} floatIntensity={reduce ? 0 : 0.7}>
      <group ref={group} scale={fit}>
        <mesh geometry={geometry} rotation={[Math.PI, 0, 0]}>
          <meshPhysicalMaterial
            color="#d3d6e0"
            metalness={0.92}
            roughness={0.26}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.6}
          />
        </mesh>
      </group>
    </Float>
  )
}

type Props = { reduce?: boolean }

export default function SymbolScene({ reduce = false }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      resize={{ offsetSize: true }}
      frameloop={reduce ? 'demand' : 'always'}
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      <directionalLight position={[-5, -2, 3]} intensity={0.7} color="#9fc3ff" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 4]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={2} color="#ecab5b" position={[0, -3, 3]} scale={5} />
        <Lightformer form="rect" intensity={1.2} color="#7aa7ff" position={[0, 0, -6]} scale={[14, 8, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-5, 0.5, 9]} scale={[8, 12, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#8b93b8" position={[5, 0.5, 9]} scale={[8, 12, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffffff" position={[-4, 3, 7]} scale={[5, 8, 1]} rotation-z={0.5} />
      </Environment>
      <Symbol reduce={reduce} />
    </Canvas>
  )
}
