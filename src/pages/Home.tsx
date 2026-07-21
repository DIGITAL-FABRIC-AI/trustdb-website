import { ArrowRight, Atom, Check, ChevronRight, Database, Eye, FlaskConical, LockKeyhole, Network, Orbit, Sparkles, Target, Workflow, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const proof = [
  { value: '20,279', label: 'human proteins processed' },
  { value: '~27 h', label: 'on desktop hardware' },
  { value: '4', label: 'target-specific designs advanced in days' },
  { value: '1', label: 'replayable program of record' },
]

const blockers = [
  { icon: Eye, title: 'Static states', text: 'A single structure can hide transient cavities, reactive surfaces, interfaces, and mechanism branches.' },
  { icon: Zap, title: 'Template chemistry', text: 'Generic warheads can map a landscape. They rarely solve recognition, selectivity, exposure, and route together.' },
  { icon: Network, title: 'Disconnected evidence', text: 'Targets, structures, pathways, compounds, decisions, and lab hand-offs are usually scattered across tools.' },
]

const differentiators = [
  { icon: Orbit, title: 'Reason over states', text: 'Dynamic ensemble, geometry, topology, disorder, and surface logic work together to expose hypotheses static screens can miss.', href: '/capabilities' },
  { icon: Atom, title: 'Design for the target', text: 'Move from broad triage to recognition scaffold, linker, prodrug, and site-matched chemistry for the actual biology.', href: '/programs' },
  { icon: Database, title: 'Keep the program intact', text: '8DB preserves evidence, provenance, confidence, alternatives, stop gates, and the next decisive experiment in one object.', href: '/platform' },
]

function Label({ children }: { children: string }) {
  return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p>
}

function OrbitalMark() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[510px]">
      <div className="absolute inset-[11%] rounded-full border border-cyan-200/15" />
      <div className="absolute inset-[22%] rounded-full border border-blue-300/20" />
      <div className="absolute inset-[34%] rounded-full border border-cyan-200/25" />
      <div className="orbit absolute inset-[11%]">
        <span className="absolute left-1/2 top-0 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/50 bg-[#102a3a] text-cyan-100 shadow-[0_0_28px_rgba(126,228,194,.45)]"><Atom size={17} /></span>
      </div>
      <div className="orbit-reverse absolute inset-[22%]">
        <span className="absolute bottom-0 left-1/2 grid h-8 w-8 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border border-blue-200/50 bg-[#162849] text-blue-100 shadow-[0_0_24px_rgba(113,150,255,.38)]"><Target size={15} /></span>
      </div>
      <div className="absolute inset-[40%] rounded-full border border-cyan-100/20 bg-cyan-100/[.04] shadow-[0_0_110px_rgba(75,214,203,.2)]" />
      <div className="absolute inset-[44%] grid place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 text-[#081321] shadow-[0_0_50px_rgba(126,228,194,.55)]">
        <span className="text-2xl font-semibold tracking-tight">B</span>
      </div>
      <div className="absolute left-[4%] top-[31%] hidden rounded-xl border border-white/10 bg-[#0b192a]/90 px-3 py-2 text-left backdrop-blur sm:block">
        <p className="text-[10px] uppercase tracking-[.18em] text-slate-500">state space</p>
        <p className="mt-1 text-xs text-cyan-100">ensemble → pocket → program</p>
      </div>
      <div className="absolute bottom-[16%] right-[2%] hidden rounded-xl border border-white/10 bg-[#0b192a]/90 px-3 py-2 text-left backdrop-blur sm:block">
        <p className="text-[10px] uppercase tracking-[.18em] text-slate-500">evidence</p>
        <p className="mt-1 text-xs text-emerald-100">provenance · confidence · next test</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 bg-grid">
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <Label>BraidEra BioTwin · evidence-native drug discovery</Label>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.045em] text-white sm:text-6xl lg:text-[72px]">
              Find what static discovery leaves <span className="text-gradient">hidden.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              BioTwin identifies, develops, and refines therapeutic hypotheses across dynamic states, omnimodal biology, and target-specific chemistry—then gives the laboratory a precise finding to validate.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07101f] transition hover:bg-white">
                Bring a hard target <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-200/50 hover:bg-white/5">
                See how BioTwin works <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><LockKeyhole size={13} className="text-cyan-200/70" /> encrypted by design</span>
              <span className="inline-flex items-center gap-2"><Sparkles size={13} className="text-cyan-200/70" /> commodity-first execution</span>
              <span className="inline-flex items-center gap-2"><FlaskConical size={13} className="text-cyan-200/70" /> validation downstream</span>
            </div>
          </div>
          <div className="relative z-10 lg:pl-10">
            <OrbitalMark />
          </div>
        </div>
        <div className="border-t border-white/10 bg-[#07101f]/55">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
            {proof.map(item => (
              <div key={item.label} className="bg-[#07101f]/90 px-5 py-5 sm:px-7">
                <p className="text-2xl font-semibold tracking-tight text-white">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl">
          <Label>The hard-target problem</Label>
          <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Biology is not one data type.</h2>
          <p className="mt-5 text-base leading-7 text-slate-400">The hardest programs fail when the discovery workflow compresses a living system into one structure, one model, or one chemistry template.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {blockers.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:border-cyan-200/25 hover:bg-white/[.055]">
              <div className="mb-7 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-cyan-200"><Icon size={18} /></div>
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1727]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Label>What makes BioTwin different</Label>
              <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">A discovery program, not a pile of model outputs.</h2>
            </div>
            <Link to="/capabilities" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-white">Explore capabilities <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {differentiators.map(({ icon: Icon, title, text, href }, index) => (
              <Link key={title} to={href} className="group rounded-2xl border border-white/10 bg-[#07101f]/65 p-7 transition hover:-translate-y-1 hover:border-cyan-200/30">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Icon size={19} /></span>
                  <span className="text-xs text-slate-600">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-medium text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-cyan-200 opacity-70 transition group-hover:opacity-100">Inspect the capability <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Label>The operating model</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Compute the discovery. Validate the finding.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">BioTwin pushes target assessment, mechanism selection, chemistry, evidence, and refinement as far as computation permits. The wet lab receives a shelf-ready computational package and tests the uncertainty that matters most.</p>
            <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-white">Explore the workflow <ArrowRight size={15} /></Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-grid-fine p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
              {['Map', 'Expose', 'Choose', 'Design', 'Refine', 'Validate'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`rounded-xl border px-3 py-3 text-center ${index === 5 ? 'border-cyan-200/40 bg-cyan-200/10' : 'border-white/10 bg-[#07101f]/80'}`}>
                    <span className="block text-[10px] uppercase tracking-[.16em] text-slate-500">0{index + 1}</span>
                    <span className="mt-1 block text-sm font-medium text-white">{step}</span>
                  </div>
                  {index < 5 && <ChevronRight size={15} className="mx-1 hidden text-cyan-200/40 sm:block" />}
                </div>
              ))}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Question', 'target · disease · mechanism'],
                ['Package', 'candidate · evidence · limits'],
                ['Handoff', 'controls · thresholds · next test'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                  <p className="text-xs font-medium text-cyan-100">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-br from-[#10243a] via-[#0a1727] to-[#07101f]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-28">
          <div>
            <Label>Flagship program · Lp(a)</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">One target. Multiple ways to solve it.</h2>
            <p className="mt-5 text-base leading-7 text-slate-300">The apo(a)/Lp(a) program couples KIV-9 covalent positioning, KIV-2 repeat-unique recognition, GalNAc–ASGPR delivery, and compartment-correct induced-proximity routes inside one evidence-connected program.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['KIV-2 recognition', 'KIV-9 warhead positioning', 'ASGPR delivery', 'LYTAC route'].map(tag => <span key={tag} className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-xs text-cyan-100">{tag}</span>)}
            </div>
            <Link to="/programs" className="mt-8 inline-flex items-center gap-2 rounded-lg border border-cyan-200/35 px-4 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-200/10">Inspect the program <ArrowRight size={15} /></Link>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-cyan-200/15 bg-[#07101f]/70 p-6 glow-cyan">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-cyan-200/10" />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-cyan-200/15" />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-[.2em] text-slate-500">Program / apo(a)-Lp(a)</span>
                <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-2 py-1 text-[10px] font-medium text-amber-100">computational</span>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ['Recognition', 'KIV-2 repeat absence comparator · plasminogen'],
                  ['Chemistry', 'KIV-9 bivalent anchor + proximal warhead'],
                  ['Delivery', 'GalNAc–ASGPR exposure and clearance logic'],
                  ['Decision', 'verification package with explicit uncertainties'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-4 rounded-xl border border-white/10 bg-white/[.03] p-4">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-200" />
                    <div><p className="text-sm font-medium text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="rounded-2xl border border-white/10 bg-[#0a1727] p-7 sm:p-10">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-200/10 text-cyan-100"><Workflow size={18} /></span><span className="text-sm font-medium text-white">The 8DB substrate</span></div>
            <p className="mt-7 text-2xl font-medium leading-9 tracking-[-.02em] text-white">The evidence behind a decision stays connected to the decision.</p>
            <p className="mt-5 text-sm leading-6 text-slate-400">Typed scientific objects and relationships can be projected through graphs, geometry, manifolds, braids, MERA, order-lattices, topology, time, and causal structure—without copying the program into disconnected sources of truth.</p>
            <Link to="/platform" className="mt-7 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">See the substrate <ArrowRight size={15} /></Link>
          </div>
          <div>
            <Label>Built for the boundary</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Serious discovery can run where your data and IP live.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">A software-first, commodity-hardware posture makes the workflow portable: near private data, inside a controlled environment, and without requiring a specialised compute estate to begin exploring difficult biology.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Desktop-scale proteome execution', 'Encrypted at rest and in transit', 'PQC/CNSA 2.0 Cat-5 posture', 'Versioned provenance and freshness'].map(item => <div key={item} className="flex items-center gap-2 text-sm text-slate-300"><Check size={15} className="text-cyan-200" />{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 bg-grid">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-cyan-200/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
          <Label>Start with the question</Label>
          <h2 className="text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">Have a target others have written off?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">Bring the structure, the disease question, or the hypothesis. BioTwin will map the solution space, expose the strongest computational branches, and return a validation question you can actually test.</p>
          <Link to="/contact" className="mt-9 inline-flex items-center gap-2 rounded-lg bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07101f] hover:bg-white">Start a design-partner program <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
