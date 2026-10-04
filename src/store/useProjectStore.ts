import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { PROJECT_TYPES } from '../data/projectTypes'
import type {
  FlowEdge,
  ModelAsset,
  PlatformCell,
  ProjectState,
  ProjectTypeId,
  StudioMode,
  SupportedFormat,
} from '../types'

function emptyMetrics(now = Date.now()) {
  return {
    platformsOccupied: 0,
    modelsUploaded: 0,
    flowLinks: 0,
    estimatedThroughputPerMin: 0,
    sessionStartedAt: now,
    lastUpdatedAt: now,
  }
}

function buildGrid(cols: number, rows: number, labels: string[]): PlatformCell[] {
  const cells: PlatformCell[] = []
  let labelIndex = 0
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const seedLabel = labels[labelIndex] ?? `Platform ${labelIndex + 1}`
      cells.push({
        id: uuid(),
        col,
        row,
        label: seedLabel,
        functionName: labelIndex < labels.length ? seedLabel : '',
        modelId: null,
      })
      labelIndex += 1
    }
  }
  return cells
}

function recomputeMetrics(state: ProjectState): ProjectState['metrics'] {
  const occupied = state.platforms.filter((p) => p.modelId || p.functionName.trim()).length
  const throughput = Math.round(occupied * state.flowVelocity * 12 * Math.max(state.flows.length, 1))
  return {
    ...state.metrics,
    platformsOccupied: occupied,
    modelsUploaded: state.models.length,
    flowLinks: state.flows.length,
    estimatedThroughputPerMin: throughput,
    lastUpdatedAt: Date.now(),
  }
}

interface ProjectActions {
  setName: (name: string) => void
  startProject: (projectType: ProjectTypeId, name: string) => void
  setMode: (mode: StudioMode) => void
  selectPlatform: (id: string | null) => void
  updatePlatform: (id: string, patch: Partial<Pick<PlatformCell, 'label' | 'functionName'>>) => void
  assignModelToPlatform: (platformId: string, modelId: string | null) => void
  addModel: (file: File) => Promise<ModelAsset | null>
  removeModel: (modelId: string) => void
  beginConnect: (platformId: string) => void
  completeConnect: (toPlatformId: string) => void
  removeFlow: (flowId: string) => void
  clearConnect: () => void
  setFlowVelocity: (velocity: number) => void
  resetSession: () => void
}

const initialState: ProjectState = {
  name: '',
  projectType: null,
  gridCols: 4,
  gridRows: 3,
  platforms: [],
  models: [],
  flows: [],
  selectedPlatformId: null,
  connectFromId: null,
  mode: 'place',
  flowVelocity: 1,
  metrics: emptyMetrics(),
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  ...initialState,

  setName: (name) => set({ name }),

  startProject: (projectType, name) => {
    const type = PROJECT_TYPES.find((t) => t.id === projectType)
    const platforms = buildGrid(4, 3, type?.defaultIslandLabels ?? [])
    const next: ProjectState = {
      ...initialState,
      name: name.trim() || type?.title || 'Untitled Process',
      projectType,
      platforms,
      metrics: emptyMetrics(),
    }
    set({ ...next, metrics: recomputeMetrics(next) })
  },

  setMode: (mode) => set({ mode, connectFromId: mode === 'connect' ? get().connectFromId : null }),

  selectPlatform: (id) => set({ selectedPlatformId: id }),

  updatePlatform: (id, patch) =>
    set((state) => {
      const platforms = state.platforms.map((p) => (p.id === id ? { ...p, ...patch } : p))
      const next = { ...state, platforms }
      return { platforms, metrics: recomputeMetrics(next) }
    }),

  assignModelToPlatform: (platformId, modelId) =>
    set((state) => {
      const platforms = state.platforms.map((p) =>
        p.id === platformId ? { ...p, modelId } : p,
      )
      const next = { ...state, platforms, selectedPlatformId: platformId }
      return { platforms, selectedPlatformId: platformId, metrics: recomputeMetrics(next) }
    }),

  addModel: async (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase() as SupportedFormat | undefined
    if (!ext || !['glb', 'gltf', 'obj', 'fbx'].includes(ext)) {
      return null
    }
    const url = URL.createObjectURL(file)
    const asset: ModelAsset = {
      id: uuid(),
      name: file.name,
      format: ext,
      url,
      sizeBytes: file.size,
      uploadedAt: Date.now(),
    }
    set((state) => {
      const models = [...state.models, asset]
      const next = { ...state, models }
      return { models, metrics: recomputeMetrics(next) }
    })
    return asset
  },

  removeModel: (modelId) =>
    set((state) => {
      const target = state.models.find((m) => m.id === modelId)
      if (target) URL.revokeObjectURL(target.url)
      const models = state.models.filter((m) => m.id !== modelId)
      const platforms = state.platforms.map((p) =>
        p.modelId === modelId ? { ...p, modelId: null } : p,
      )
      const next = { ...state, models, platforms }
      return { models, platforms, metrics: recomputeMetrics(next) }
    }),

  beginConnect: (platformId) => set({ connectFromId: platformId, selectedPlatformId: platformId }),

  completeConnect: (toPlatformId) => {
    const state = get()
    const from = state.connectFromId
    if (!from || from === toPlatformId) {
      set({ connectFromId: null })
      return
    }
    const exists = state.flows.some(
      (f) =>
        (f.fromPlatformId === from && f.toPlatformId === toPlatformId) ||
        (f.fromPlatformId === toPlatformId && f.toPlatformId === from),
    )
    if (exists) {
      set({ connectFromId: null, selectedPlatformId: toPlatformId })
      return
    }
    const edge: FlowEdge = {
      id: uuid(),
      fromPlatformId: from,
      toPlatformId,
      sequence: state.flows.length + 1,
    }
    const flows = [...state.flows, edge]
    const next = { ...state, flows, connectFromId: null, selectedPlatformId: toPlatformId }
    set({
      flows,
      connectFromId: null,
      selectedPlatformId: toPlatformId,
      metrics: recomputeMetrics(next),
    })
  },

  removeFlow: (flowId) =>
    set((state) => {
      const flows = state.flows
        .filter((f) => f.id !== flowId)
        .map((f, index) => ({ ...f, sequence: index + 1 }))
      const next = { ...state, flows }
      return { flows, metrics: recomputeMetrics(next) }
    }),

  clearConnect: () => set({ connectFromId: null }),

  setFlowVelocity: (velocity) =>
    set((state) => {
      const flowVelocity = Math.min(5, Math.max(0.1, velocity))
      const next = { ...state, flowVelocity }
      return { flowVelocity, metrics: recomputeMetrics(next) }
    }),

  resetSession: () => {
    const { models } = get()
    models.forEach((m) => URL.revokeObjectURL(m.url))
    set({ ...initialState, metrics: emptyMetrics() })
  },
}))
