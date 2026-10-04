import { Suspense } from 'react'
import { Text, Billboard } from '@react-three/drei'
import { EquipmentModel } from './EquipmentModel'
import type { ModelAsset, PlatformCell } from '../../types'

function FallbackMachine() {
  return (
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#314557" />
    </mesh>
  )
}

function PlatformPad({
  cell,
  model,
  selected,
  connectFrom,
  occupied,
  onSelect,
}: {
  cell: PlatformCell
  model?: ModelAsset
  selected: boolean
  connectFrom: boolean
  occupied: boolean
  onSelect: () => void
}) {
  const padColor = selected ? '#2fd3a2' : connectFrom ? '#f0b429' : occupied ? '#3b536b' : '#243446'

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.35, 48]} />
        <meshStandardMaterial
          color={padColor}
          metalness={0.2}
          roughness={0.55}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.2, 1.34, 48]} />
        <meshStandardMaterial
          color={selected || connectFrom ? '#e7eef6' : '#6f879e'}
          emissive={selected ? '#2fd3a2' : connectFrom ? '#f0b429' : '#000000'}
          emissiveIntensity={selected || connectFrom ? 0.35 : 0}
        />
      </mesh>

      {(occupied || model) && (
        <group position={[0, 0.02, 0]}>
          <Suspense fallback={<FallbackMachine />}>
            <EquipmentModel model={model} accent={selected ? '#2fd3a2' : '#7ad7ff'} />
          </Suspense>
        </group>
      )}

      <Billboard position={[0, 1.55, 0]}>
        <Text
          fontSize={0.22}
          color="#e7eef6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0c1117"
        >
          {cell.label || `R${cell.row + 1}C${cell.col + 1}`}
        </Text>
        {cell.functionName ? (
          <Text
            position={[0, -0.28, 0]}
            fontSize={0.16}
            color="#8fa3b8"
            anchorX="center"
            anchorY="middle"
          >
            {cell.functionName}
          </Text>
        ) : null}
      </Billboard>
    </group>
  )
}

export function PlatformGrid({
  platforms,
  models,
  selectedPlatformId,
  connectFromId,
  cols,
  rows,
  onSelect,
}: {
  platforms: PlatformCell[]
  models: ModelAsset[]
  selectedPlatformId: string | null
  connectFromId: string | null
  cols: number
  rows: number
  onSelect: (id: string) => void
}) {
  const modelMap = new Map(models.map((m) => [m.id, m]))
  const spacing = 3.2

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[cols * 3.4, rows * 3.4]} />
        <meshStandardMaterial color="#101820" metalness={0.1} roughness={0.9} />
      </mesh>

      {platforms.map((cell) => {
        const model = cell.modelId ? modelMap.get(cell.modelId) : undefined
        const occupied = Boolean(cell.modelId || cell.functionName.trim())
        const x = (cell.col - (cols - 1) / 2) * spacing
        const z = (cell.row - (rows - 1) / 2) * spacing
        return (
          <group key={cell.id} position={[x, 0, z]}>
            <PlatformPad
              cell={cell}
              model={model}
              selected={selectedPlatformId === cell.id}
              connectFrom={connectFromId === cell.id}
              occupied={occupied}
              onSelect={() => onSelect(cell.id)}
            />
          </group>
        )
      })}
    </group>
  )
}
