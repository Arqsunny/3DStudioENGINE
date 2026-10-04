import type { ProjectType } from '../types'

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'airplane-parts',
    title: 'Airplane Parts Manufacturing',
    description:
      'Machine islands for cutting, forming, inspection, and assembly of aerospace components.',
    defaultIslandLabels: ['Cut', 'Form', 'Inspect', 'Assemble', 'Finish'],
  },
  {
    id: 'digital-twin-data',
    title: 'Digital Twin Data Process',
    description:
      'Map how signals, telemetry, and decisions move through a digital twin pipeline.',
    defaultIslandLabels: ['Ingest', 'Normalize', 'Simulate', 'Decide', 'Actuate'],
  },
  {
    id: 'pet-food',
    title: 'Pet Food Production',
    description:
      'Dry or wet line stations from intake through packaging, inspired by plant training layouts.',
    defaultIslandLabels: ['Intake', 'Grind', 'Extrude', 'Dry', 'Coat', 'Pack'],
  },
  {
    id: 'custom-manufacturing',
    title: 'Custom Manufacturing',
    description:
      'Start blank and define your own equipment islands, sequence, and process language.',
    defaultIslandLabels: ['Station A', 'Station B', 'Station C'],
  },
]

export const SUPPORTED_FORMATS = [
  {
    ext: 'glb',
    label: 'GLB',
    recommended: true,
    note: 'Binary glTF — preferred for web performance and materials.',
  },
  {
    ext: 'gltf',
    label: 'glTF',
    recommended: true,
    note: 'JSON + binary/textures. Keep companion files together when exporting.',
  },
  {
    ext: 'obj',
    label: 'OBJ',
    recommended: false,
    note: 'Geometry only in most cases; materials may be limited.',
  },
  {
    ext: 'fbx',
    label: 'FBX',
    recommended: false,
    note: 'Common from CAD/DCC tools; converted at load time in the viewer.',
  },
] as const

export const ACCEPT_MODEL_EXTENSIONS = '.glb,.gltf,.obj,.fbx'
