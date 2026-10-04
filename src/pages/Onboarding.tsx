import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROJECT_TYPES } from '../data/projectTypes'
import { useProjectStore } from '../store/useProjectStore'
import type { ProjectTypeId } from '../types'

export function Onboarding() {
  const navigate = useNavigate()
  const startProject = useProjectStore((s) => s.startProject)
  const [projectType, setProjectType] = useState<ProjectTypeId | null>(null)
  const [name, setName] = useState('')

  const onStart = () => {
    if (!projectType) return
    startProject(projectType, name)
    navigate('/studio')
  }

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="brand" style={{ marginBottom: '0.75rem' }}>
          <strong>Process Platform Studio</strong>
          <span>Build manufacturing islands and animate process flow</span>
        </div>
        <h1>What process are you modeling?</h1>
        <p className="lede">
          Choose a project type, then place equipment on platform squares, define station
          functions, and draw the sequence with moving flow dots.
        </p>

        <div className="field">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            placeholder="e.g. Dry Line Twin — Plant 01"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="type-grid">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`type-card ${projectType === type.id ? 'selected' : ''}`}
              onClick={() => setProjectType(type.id)}
            >
              <h3>{type.title}</h3>
              <p>{type.description}</p>
            </button>
          ))}
        </div>

        <button type="button" className="btn primary" disabled={!projectType} onClick={onStart}>
          Open 3D studio
        </button>
      </div>
    </div>
  )
}
