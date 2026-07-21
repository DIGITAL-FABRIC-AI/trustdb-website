import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Capabilities from './pages/Capabilities'
import Programs from './pages/Programs'
import HowItWorks from './pages/HowItWorks'
import Platform from './pages/Platform'
import Evidence from './pages/Evidence'
import Research from './pages/Research'
import Contact from './pages/Contact'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/research" element={<Research />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
