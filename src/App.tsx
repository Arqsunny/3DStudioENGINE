import { Navigate, Route, Routes } from 'react-router-dom'
import { Onboarding } from './pages/Onboarding'
import { Studio } from './pages/Studio'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
