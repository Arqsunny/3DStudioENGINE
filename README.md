# Process Platform Studio

Interactive 3D process builder for manufacturing lines, plant training layouts, and digital-twin data flows.

Separate from YELECPANEL — lives in `C:\PROCESS-PLATFORM`.

## Features

- **Project type onboarding** — airplane parts, digital twin data, pet food, or custom manufacturing
- **Platform grid** — place equipment islands on squares and name each station function
- **3D viewer** — React Three Fiber scene with orbit controls
- **Model upload** — GLB / glTF (recommended), OBJ, FBX
- **Process flow** — connect platforms in sequence; amber dots show direction
- **Velocity control** — speed up or slow the moving flow dots
- **Metrics** — active islands, uploads, flow links, estimated throughput

## Quick start

```bash
cd C:\PROCESS-PLATFORM
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Recommended 3D export settings

| Format | Use |
|--------|-----|
| `.glb` | Preferred single-file web asset |
| `.gltf` | OK if binaries/textures travel with it |
| `.obj` | Geometry fallback |
| `.fbx` | CAD/DCC interchange; larger / slower |

Keep individual assets under ~25 MB when possible.
