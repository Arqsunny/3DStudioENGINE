import { PROJECT_TYPES } from '../data/projectTypes'
import { useProjectStore } from '../store/useProjectStore'

export function MetricsPanel() {
  const metrics = useProjectStore((s) => s.metrics)
  const flows = useProjectStore((s) => s.flows)
  const platforms = useProjectStore((s) => s.platforms)
  const projectType = useProjectStore((s) => s.projectType)
  const flowVelocity = useProjectStore((s) => s.flowVelocity)
  const removeFlow = useProjectStore((s) => s.removeFlow)
  const typeLabel = PROJECT_TYPES.find((t) => t.id === projectType)?.title ?? '—'

  const elapsedMin = Math.max(
    1 / 60,
    (Date.now() - metrics.sessionStartedAt) / 60000,
  )

  return (
    <aside className="panel right stack">
      <div>
        <h2>Metrics</h2>
        <p className="help">Live process signals for the current studio session.</p>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <div className="value mono">{metrics.platformsOccupied}</div>
          <div className="label">Active islands</div>
        </div>
        <div className="metric">
          <div className="value mono">{metrics.modelsUploaded}</div>
          <div className="label">Models uploaded</div>
        </div>
        <div className="metric">
          <div className="value mono">{metrics.flowLinks}</div>
          <div className="label">Flow links</div>
        </div>
        <div className="metric">
          <div className="value mono">{metrics.estimatedThroughputPerMin}</div>
          <div className="label">Est. units / min</div>
        </div>
      </div>

      <div className="list-item">
        <div>
          <div>Project type</div>
          <small>{typeLabel}</small>
        </div>
      </div>
      <div className="list-item">
        <div>
          <div>Dot velocity</div>
          <small className="mono">{flowVelocity.toFixed(1)}×</small>
        </div>
      </div>
      <div className="list-item">
        <div>
          <div>Session length</div>
          <small className="mono">{elapsedMin.toFixed(1)} min</small>
        </div>
      </div>

      <div className="stack">
        <h3>Sequence</h3>
        {flows.length === 0 ? (
          <p className="help">Use Connect mode, click source island, then destination island.</p>
        ) : (
          <div className="list">
            {flows.map((flow) => {
              const from = platforms.find((p) => p.id === flow.fromPlatformId)
              const to = platforms.find((p) => p.id === flow.toPlatformId)
              return (
                <div className="list-item" key={flow.id}>
                  <div>
                    <div className="mono">#{flow.sequence}</div>
                    <small>
                      {from?.label ?? '?'} → {to?.label ?? '?'}
                    </small>
                  </div>
                  <button type="button" className="btn ghost" onClick={() => removeFlow(flow.id)}>
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
