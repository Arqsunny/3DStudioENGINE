import { useMemo } from 'react'
import { Center, useGLTF } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { useLoader } from '@react-three/fiber'
import type { Group, Object3D } from 'three'
import type { ModelAsset } from '../../types'

function PlaceholderMachine({ accent = '#2fd3a2' }: { accent?: string }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.9]} />
        <meshStandardMaterial color="#314557" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.55]} />
        <meshStandardMaterial color={accent} metalness={0.2} roughness={0.35} />
      </mesh>
      <mesh position={[-0.45, 0.15, 0.35]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#f0b429" />
      </mesh>
    </group>
  )
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => scene.clone(true), [scene])
  return (
    <Center top>
      <primitive object={clone} scale={1.1} />
    </Center>
  )
}

function ObjModel({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url) as Group
  const clone = useMemo(() => obj.clone(true), [obj])
  return (
    <Center top>
      <primitive object={clone} scale={1.1} />
    </Center>
  )
}

function FbxModel({ url }: { url: string }) {
  const fbx = useLoader(FBXLoader, url) as Object3D
  const clone = useMemo(() => fbx.clone(true), [fbx])
  return (
    <Center top>
      <primitive object={clone} scale={0.01} />
    </Center>
  )
}

export function EquipmentModel({
  model,
  accent,
}: {
  model: ModelAsset | null | undefined
  accent?: string
}) {
  if (!model) return <PlaceholderMachine accent={accent} />

  if (model.format === 'glb' || model.format === 'gltf') {
    return <GltfModel url={model.url} />
  }
  if (model.format === 'obj') {
    return <ObjModel url={model.url} />
  }
  if (model.format === 'fbx') {
    return <FbxModel url={model.url} />
  }
  return <PlaceholderMachine accent={accent} />
}
