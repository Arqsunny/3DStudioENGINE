import { Navigate } from 'react-router-dom'
import { MetricsPanel } from '../components/MetricsPanel'
import { SetupPanel } from '../components/SetupPanel'
import { ProcessScene } from '../components/viewer/ProcessScene'
import { useProjectStore } from '../store/useProjectStore'

export function Studio() {
  const projectType = useProjectStore((s) => s.projectType)
  const name = useProjectStore((s) => s.name)
  const mode = useProjectStore((s) => s.mode)
  const setMode = useProjectStore((s) => s.setMode)
  const flowVelocity = useProjectStore((s) => s.flowVelocity)
  const setFlowVelocity = useProjectStore((s) => s.setFlowVelocity)
  const clearConnect = useProjectStore((s) => s.clearConnect)
  const resetSession = useProjectStore((s) => s.resetSession)
  const connectFromId = useProjectStore((s) => s.connectFromId)

  if (!projectType) return <Navigate to="/" replace />

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <strong>{name}</strong>
          <span>
            Mode: {mode}
            {mode === 'connect' && connectFromId ? ' — pick destination island' : ''}
          </span>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className={`btn ${mode === 'place' ? 'active' : ''}`}
            onClick={() => {
              clearConnect()
              setMode('place')
            }}
          >
            Place
          </button>
          <button
            type="button"
            className={`btn ${mode === 'connect' ? 'active' : ''}`}
            onClick={() => setMode('connect')}
          >
            Connect flow
          </button>
          <button
            type="button"
            className={`btn ${mode === 'inspect' ? 'active' : ''}`}
            onClick={() => {
              clearConnect()
              setMode('inspect')
            }}
          >
            Inspect
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              resetSession()
              window.location.href = '/'
            }}
          >
            New project
          </button>
        </div>
      </header>

      <div className="studio-layout">
        <SetupPanel />
        <section className="viewer-wrap">
          <ProcessScene />
          <div className="hud">
            <label htmlFor="velocity">Flow velocity</label>
            <input
              id="velocity"
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={flowVelocity}
              onChange={(e) => setFlowVelocity(Number(e.target.value))}
            />
            <span className="mono">{flowVelocity.toFixed(1)}×</span>
          </div>
        </section>
        <MetricsPanel />
      </div>
    </div>
  )
}
