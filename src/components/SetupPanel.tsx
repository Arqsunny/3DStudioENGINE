import { useRef } from 'react'
import { ACCEPT_MODEL_EXTENSIONS, SUPPORTED_FORMATS } from '../data/projectTypes'
import { useProjectStore } from '../store/useProjectStore'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SetupPanel() {
  const inputRef = useRef<HTMLInputElement>(null)
  const models = useProjectStore((s) => s.models)
  const platforms = useProjectStore((s) => s.platforms)
  const selectedPlatformId = useProjectStore((s) => s.selectedPlatformId)
  const addModel = useProjectStore((s) => s.addModel)
  const removeModel = useProjectStore((s) => s.removeModel)
  const assignModelToPlatform = useProjectStore((s) => s.assignModelToPlatform)
  const updatePlatform = useProjectStore((s) => s.updatePlatform)
  const selected = platforms.find((p) => p.id === selectedPlatformId) ?? null

  const onUpload = async (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) {
      const asset = await addModel(file)
      if (asset && selectedPlatformId) {
        assignModelToPlatform(selectedPlatformId, asset.id)
      }
    }
  }

  return (
    <aside className="panel stack">
      <div>
        <h2>Setup</h2>
        <p className="help">
          Upload 3D equipment, assign islands to platform squares, and name each station function.
        </p>
      </div>

      <div className="stack">
        <h3>Accepted 3D formats</h3>
        <table className="format-table">
          <thead>
            <tr>
              <th>Format</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {SUPPORTED_FORMATS.map((f) => (
              <tr key={f.ext}>
                <td>
                  <span className="mono">.{f.ext}</span>{' '}
                  {f.recommended ? <span className="badge">recommended</span> : null}
                </td>
                <td>{f.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stack">
        <h3>Model library</h3>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MODEL_EXTENSIONS}
          multiple
          hidden
          onChange={(e) => {
            void onUpload(e.target.files)
            e.target.value = ''
          }}
        />
        <button type="button" className="btn primary" onClick={() => inputRef.current?.click()}>
          Upload 3D models
        </button>
        <div className="list">
          {models.length === 0 ? (
            <p className="help">No models yet. Prefer GLB exports under ~25 MB for smooth viewing.</p>
          ) : (
            models.map((model) => (
              <div className="list-item" key={model.id}>
                <div>
                  <div>{model.name}</div>
                  <small className="mono">
                    .{model.format} · {formatBytes(model.sizeBytes)}
                  </small>
                </div>
                <div className="stack" style={{ gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn"
                    disabled={!selectedPlatformId}
                    onClick={() =>
                      selectedPlatformId && assignModelToPlatform(selectedPlatformId, model.id)
                    }
                  >
                    Place
                  </button>
                  <button type="button" className="btn ghost" onClick={() => removeModel(model.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="stack">
        <h3>Selected platform</h3>
        {!selected ? (
          <p className="help">Click a square in the 3D viewer to edit an island.</p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="island-label">Island label</label>
              <input
                id="island-label"
                value={selected.label}
                onChange={(e) => updatePlatform(selected.id, { label: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="island-fn">Function</label>
              <input
                id="island-fn"
                placeholder="e.g. Extrude, Inspect, Ingest"
                value={selected.functionName}
                onChange={(e) => updatePlatform(selected.id, { functionName: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="island-model">Assigned model</label>
              <select
                id="island-model"
                value={selected.modelId ?? ''}
                onChange={(e) =>
                  assignModelToPlatform(selected.id, e.target.value || null)
                }
              >
                <option value="">Procedural placeholder</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
