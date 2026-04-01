import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DeepDive from './pages/DeepDive'
import Changelog from './pages/Changelog'
import Roadmap from './pages/Roadmap'
import Features from './pages/Features'
import FeatureDetailPage from './pages/FeatureDetailPage'
import Benchmarks from './pages/Benchmarks'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/benchmarks" element={<Benchmarks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/features/:slug" element={<FeatureDetailPage />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/:pillar" element={<DeepDive />} />
      </Routes>
    </Layout>
  )
}
