'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Floating file node
function FileNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.25, 0.3, 0.04]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>
    </Float>
  )
}

// Connection line between nodes
function ConnectionLine({ start, end, color }: { start: THREE.Vector3; end: THREE.Vector3; color: string }) {
  const points = useMemo(() => [start, end], [start, end])
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [points])
  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial color={color} transparent opacity={0.3} linewidth={1} />
    </line>
  )
}

// Central glowing repo cube
function RepoCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.08
    glowRef.current.rotation.y = -t * 0.1
    glowRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05)
  })

  return (
    <>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main glass cube */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          roughness={0.05}
          transmissionSampler
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.3}
          color="#8B5CF6"
          attenuationColor="#22D3EE"
          attenuationDistance={2}
        />
      </mesh>

      {/* Inner wireframe */}
      <mesh ref={meshRef} scale={0.98}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial color="#A78BFA" wireframe transparent opacity={0.25} />
      </mesh>
    </>
  )
}

// Orbiting particles
function Particles() {
  const count = 80
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.5 + ((i * 0.618033988749895) % 1) * 2
      const theta = i * 2.399963229728653
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  const pointsRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#22D3EE"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

// Scanning beam
function ScanBeam() {
  const planeRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    planeRef.current.position.y = Math.sin(t * 0.7) * 1.2
    const opacity = (Math.sin(t * 0.7) + 1) * 0.08
    ;(planeRef.current.material as THREE.MeshBasicMaterial).opacity = opacity
  })
  return (
    <mesh ref={planeRef} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial color="#22D3EE" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Full scene
function Scene() {
  const filePositions: [number, number, number][] = [
    [2.2, 1.2, 0.5],
    [-2.3, 0.8, -0.3],
    [1.8, -1.4, 1.0],
    [-1.6, -1.2, 0.8],
    [0.5, 2.2, -1.5],
    [-0.8, -2.1, -1.2],
    [2.5, -0.3, -0.8],
    [-2.1, 1.6, 0.9],
  ]
  const fileColors = ['#8B5CF6', '#22D3EE', '#6366F1', '#34D399', '#F59E0B', '#A78BFA', '#67E8F9', '#818CF8']

  const connStart = new THREE.Vector3(0, 0, 0)

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]} color="#8B5CF6" intensity={4} />
      <pointLight position={[-3, -2, 2]} color="#22D3EE" intensity={3} />
      <pointLight position={[0, 4, 0]} color="#fff" intensity={1} />

      <Stars radius={80} depth={50} count={1500} factor={2} fade speed={0.5} />

      <RepoCube />
      <Particles />
      <ScanBeam />

      {filePositions.map((pos, i) => (
        <group key={i}>
          <FileNode position={pos} color={fileColors[i % fileColors.length]} />
          <ConnectionLine
            start={connStart}
            end={new THREE.Vector3(...pos)}
            color={fileColors[i % fileColors.length]}
          />
        </group>
      ))}
    </>
  )
}

export default function RepoScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      {/* AI Card Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        right: 20,
        background: 'rgba(17,20,34,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 12,
        padding: '14px 18px',
        maxWidth: 260,
        boxShadow: '0 0 30px rgba(139,92,246,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22D3EE', boxShadow: '0 0 8px #22D3EE' }} />
          <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono', color: '#22D3EE', fontWeight: 600 }}>LIVE ANALYSIS</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: 8, lineHeight: 1.5 }}>
          &quot;Where is authentication handled?&quot;
        </p>
        <div style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono', color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', borderRadius: 6, padding: '4px 8px' }}>
          → src/auth.py:24–46
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
          <span style={{ fontSize: '0.68rem', color: '#34D399', fontFamily: 'JetBrains Mono' }}>Evidence verified</span>
        </div>
      </div>
    </div>
  )
}
