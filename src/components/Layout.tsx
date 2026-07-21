import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, LockKeyhole, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'

const navItems = [
  { path: '/capabilities', label: 'Capabilities' },
  { path: '/programs', label: 'Programs' },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/platform', label: '8DB substrate' },
  { path: '/evidence', label: 'Evidence' },
  { path: '/research', label: 'Research' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#07101f] text-[#e7edf6]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-cyan-200/30 bg-cyan-200/10">
              <span className="absolute h-4 w-4 rounded-full border border-cyan-200/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_#7ee4c2]" />
            </span>
            <span>
              <span className="block text-[13px] font-semibold tracking-[.28em] text-white">BRAIDERA</span>
              <span className="block text-[10px] tracking-[.18em] text-slate-500">BIOTWIN / 8DB</span>
            </span>
          </Link>

          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            className="rounded-lg border border-white/10 p-2 text-slate-300 md:hidden"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-lg px-3 py-2 text-[13px] transition ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              to="/contact"
              className="ml-3 inline-flex items-center gap-2 rounded-lg border border-cyan-200/35 bg-cyan-200/10 px-4 py-2 text-[13px] font-medium text-cyan-100 transition hover:border-cyan-100/70 hover:bg-cyan-200/20"
            >
              Bring a hard target <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>

        {open && (
          <nav className="border-t border-white/10 bg-[#07101f] px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-cyan-200 px-3 py-3 text-center text-sm font-semibold text-[#07101f]">
                Bring a hard target
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-[#050b15]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-200/30 bg-cyan-200/10 text-cyan-100">∿</span>
              <span className="text-sm font-semibold tracking-[.22em] text-white">BRAIDERA</span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              Computational discovery for hard targets, hidden states, and evidence-connected therapeutic programs.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><LockKeyhole size={13} className="text-cyan-200/70" /> Encrypted at rest and in transit · PQC CNSA 2.0 Cat-5 posture</div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Explore</p>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link to="/capabilities" className="hover:text-white">Capabilities</Link>
              <Link to="/programs" className="hover:text-white">Programs</Link>
              <Link to="/evidence" className="hover:text-white">Evidence</Link>
              <Link to="/research" className="hover:text-white">Research</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Architecture</p>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link to="/platform" className="hover:text-white">The 8DB substrate</Link>
              <Link to="/how-it-works" className="hover:text-white">Program workflow</Link>
              <a href="https://api.braidera.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white">Live API <ArrowUpRight size={13} /></a>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Start here</p>
            <p className="text-sm leading-6 text-slate-500">Have a difficult target, pathway, or therapeutic question?</p>
            <Link to="/contact" className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">Start a design-partner conversation <ArrowUpRight size={14} /></Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[11px] leading-5 text-slate-600 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} BraidEra. BioTwin is an active computational development system.</span>
            <span>Computational results are hypotheses until prospective validation.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
