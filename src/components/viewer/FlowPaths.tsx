import { useMemo, useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { FlowEdge, PlatformCell } from '../../types'

function cellPosition(cell: PlatformCell, cols: number, rows: number) {
  const spacing = 3.2
  const x = (cell.col - (cols - 1) / 2) * spacing
  const z = (cell.row - (rows - 1) / 2) * spacing
  return new THREE.Vector3(x, 0.12, z)
}

function FlowRibbon({
  from,
  to,
  velocity,
  sequence,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  velocity: number
  sequence: number
}) {
  const dots = useRef<THREE.Group>(null)
  const curve = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5)
    mid.y += 0.55
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])

  const linePoints = useMemo(
    () => curve.getPoints(40).map((p) => [p.x, p.y, p.z] as [number, number, number]),
    [curve],
  )

  useFrame((state) => {
    if (!dots.current) return
    const tBase = (state.clock.elapsedTime * velocity * 0.35) % 1
    dots.current.children.forEach((child, index) => {
      const t = (tBase + index / dots.current!.children.length) % 1
      child.position.copy(curve.getPoint(t))
    })
  })

  return (
    <group>
      <Line points={linePoints} color="#2fd3a2" transparent opacity={0.65} lineWidth={2} />
      <group ref={dots}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`${sequence}-${i}`}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#f0b429" emissive="#f0b429" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function FlowPaths({
  platforms,
  flows,
  cols,
  rows,
  velocity,
}: {
  platforms: PlatformCell[]
  flows: FlowEdge[]
  cols: number
  rows: number
  velocity: number
}) {
  const byId = useMemo(() => new Map(platforms.map((p) => [p.id, p])), [platforms])

  return (
    <group>
      {flows.map((flow) => {
        const fromCell = byId.get(flow.fromPlatformId)
        const toCell = byId.get(flow.toPlatformId)
        if (!fromCell || !toCell) return null
        return (
          <FlowRibbon
            key={flow.id}
            from={cellPosition(fromCell, cols, rows)}
            to={cellPosition(toCell, cols, rows)}
            velocity={velocity}
            sequence={flow.sequence}
          />
        )
      })}
    </group>
  )
}
