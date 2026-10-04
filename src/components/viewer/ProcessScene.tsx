import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { PlatformGrid } from './PlatformGrid'
import { FlowPaths } from './FlowPaths'
import { useProjectStore } from '../../store/useProjectStore'

export function ProcessScene() {
  const platforms = useProjectStore((s) => s.platforms)
  const models = useProjectStore((s) => s.models)
  const flows = useProjectStore((s) => s.flows)
  const cols = useProjectStore((s) => s.gridCols)
  const rows = useProjectStore((s) => s.gridRows)
  const selectedPlatformId = useProjectStore((s) => s.selectedPlatformId)
  const connectFromId = useProjectStore((s) => s.connectFromId)
  const mode = useProjectStore((s) => s.mode)
  const flowVelocity = useProjectStore((s) => s.flowVelocity)
  const selectPlatform = useProjectStore((s) => s.selectPlatform)
  const beginConnect = useProjectStore((s) => s.beginConnect)
  const completeConnect = useProjectStore((s) => s.completeConnect)

  const handleSelect = (id: string) => {
    if (mode === 'connect') {
      if (!connectFromId) beginConnect(id)
      else completeConnect(id)
      return
    }
    selectPlatform(id)
  }

  return (
    <div className="viewer-canvas">
      <Canvas shadows camera={{ position: [8, 9, 10], fov: 42 }}>
        <color attach="background" args={['#0c1117']} />
        <ambientLight intensity={0.55} />
        <directionalLight
          castShadow
          position={[8, 14, 6]}
          intensity={1.2}
          shadow-mapSize={[1024, 1024]}
        />
        <PlatformGrid
          platforms={platforms}
          models={models}
          selectedPlatformId={selectedPlatformId}
          connectFromId={connectFromId}
          cols={cols}
          rows={rows}
          onSelect={handleSelect}
        />
        <FlowPaths
          platforms={platforms}
          flows={flows}
          cols={cols}
          rows={rows}
          velocity={flowVelocity}
        />
        <ContactShadows opacity={0.45} scale={28} blur={2.5} far={12} />
        <Environment preset="city" />
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.15} minDistance={6} maxDistance={28} />
      </Canvas>
    </div>
  )
}
