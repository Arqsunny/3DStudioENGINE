export type ProjectTypeId =
  | 'airplane-parts'
  | 'digital-twin-data'
  | 'pet-food'
  | 'custom-manufacturing'

export interface ProjectType {
  id: ProjectTypeId
  title: string
  description: string
  defaultIslandLabels: string[]
}

export type SupportedFormat = 'glb' | 'gltf' | 'obj' | 'fbx'

export interface ModelAsset {
  id: string
  name: string
  format: SupportedFormat
  url: string
  sizeBytes: number
  uploadedAt: number
}

export interface PlatformCell {
  id: string
  col: number
  row: number
  label: string
  functionName: string
  modelId: string | null
}

export interface FlowEdge {
  id: string
  fromPlatformId: string
  toPlatformId: string
  sequence: number
}

export interface ProjectMetrics {
  platformsOccupied: number
  modelsUploaded: number
  flowLinks: number
  estimatedThroughputPerMin: number
  sessionStartedAt: number
  lastUpdatedAt: number
}

export type StudioMode = 'place' | 'connect' | 'inspect'

export interface ProjectState {
  name: string
  projectType: ProjectTypeId | null
  gridCols: number
  gridRows: number
  platforms: PlatformCell[]
  models: ModelAsset[]
  flows: FlowEdge[]
  selectedPlatformId: string | null
  connectFromId: string | null
  mode: StudioMode
  flowVelocity: number
  metrics: ProjectMetrics
}
