import { Link, useLocation } from 'react-router-dom'
import { Database, BarChart3, Clock, Map, Boxes, FlaskConical } from 'lucide-react'
import type { ReactNode } from 'react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/benchmarks', label: 'Benchmarks', icon: FlaskConical },
  { path: '/features', label: 'Features', icon: Boxes },
  { path: '/changelog', label: 'Changelog', icon: Clock },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white">TrustDB</span>
                <span className="text-sm text-gray-400 ml-2">Scorecard</span>
              </div>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
