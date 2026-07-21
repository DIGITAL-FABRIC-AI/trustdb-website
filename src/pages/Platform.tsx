import { ArrowRight, Boxes, CircleDot, Database, GitBranch, Layers3, LockKeyhole, Network, Orbit, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'

const views = [
  ['Graph', 'relationships and causal context'],
  ['Geometry', 'surfaces, pockets, interfaces, trajectories'],
  ['Manifolds', 'continuous state and embedding structure'],
  ['MERA', 'multi-scale information compression and navigation'],
  ['Braids', 'trajectory, order, and interaction structure'],
  ['Order-lattice', 'partial order, constraints, and branch logic'],
  ['Topology', 'persistence, cavities, and shape change'],
  ['Time', 'version, freshness, and experiment feedback'],
]

function Label({ children }: { children: string }) { return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p> }

export default function Platform() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <Label>The substrate behind BioTwin</Label>
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">One scientific state. Many ways to <span className="text-gradient">reason over it.</span></h1>
          <p className="text-base leading-7 text-slate-400">8DB is the topology-first substrate that lets BioTwin connect biology, chemistry, evidence, and decision history while exposing the representation that best fits the question.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07101f]/75">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:py-24">
          <div className="relative mx-auto aspect-square w-full max-w-[360px]">
            <div className="absolute inset-0 rounded-full border border-cyan-200/15" />
            <div className="absolute inset-[16%] rounded-full border border-blue-200/15" />
            <div className="absolute inset-[32%] rounded-full border border-cyan-200/20" />
            <div className="orbit absolute inset-[8%]"><span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_#7ee4c2]" /></div>
            <div className="orbit-reverse absolute inset-[22%]"><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-200 shadow-[0_0_18px_#9bb6ff]" /></div>
            <div className="absolute inset-[40%] grid place-items-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-100 shadow-[0_0_70px_rgba(126,228,194,.2)]"><Database size={29} /></div>
          </div>
          <div>
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-200/10 text-cyan-100"><Network size={18} /></span><span className="text-sm font-medium text-white">The buyer consequence</span></div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">The evidence behind a decision remains connected to the decision.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">Targets, structures, mechanisms, molecules, pathways, confidence, provenance, freshness, and validation contracts are typed objects with relationships—not a collection of exports that drift apart.</p>
            <Link to="/evidence" className="mt-8 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">See the evidence model <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl"><Label>Omnimodal projections</Label><h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Different questions need different views.</h2><p className="mt-5 text-base leading-7 text-slate-400">BioTwin can project one native Program through complementary mathematical and biological lenses without making each projection a new source of truth.</p></div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {views.map(([title, text], index) => <div key={title} className="rounded-xl border border-white/10 bg-[#0a1727] p-5"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-xs text-cyan-100">{String(index + 1).padStart(2, '0')}</span><CircleDot size={13} className="text-cyan-200/60" /></div><p className="mt-5 text-sm font-medium text-white">{title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1727]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [Workflow, 'Program state', 'A versioned object holds the target question, recipe, candidate state, evidence, confidence, and next action.'],
              [GitBranch, 'Composable engines', 'Reusable engines and recipes can be recombined across targets and modalities without losing provenance.'],
              [Boxes, 'Portable execution', 'The substrate is designed for commodity hardware and private deployment boundaries, not a mandatory specialised estate.'],
            ].map(([Icon, title, text]) => { const IconComponent = Icon as typeof Workflow; return <div key={title as string} className="rounded-2xl border border-white/10 bg-[#07101f]/70 p-6"><IconComponent size={19} className="text-cyan-200" /><h3 className="mt-6 text-base font-medium text-white">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text as string}</p></div> })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Label>Security and control</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Keep sensitive science near the people who own it.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">A portable, software-first posture can make private data, IP, and model state easier to keep within a controlled environment while the public API exposes only what the program owner chooses.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [LockKeyhole, 'Encrypted at rest and in transit'],
              [ShieldCheck, 'PQC / CNSA 2.0 Category 5 posture'],
              [Sparkles, 'Provenance and freshness attached to results'],
              [Layers3, 'Role-appropriate projections of the same state'],
            ].map(([Icon, text]) => { const IconComponent = Icon as typeof LockKeyhole; return <div key={text as string} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a1727] p-4"><IconComponent size={16} className="text-cyan-200" /><span className="text-sm text-slate-300">{text as string}</span></div> })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-grid-fine">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center"><div><p className="text-xl font-medium text-white">The substrate is technical. The outcome is practical.</p><p className="mt-2 text-sm text-slate-500">Keep every scientific decision connected as a program moves toward validation.</p></div><a href="https://api.braidera.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-white">Inspect the live API <ArrowRight size={15} /></a></div>
      </section>
    </div>
  )
}
