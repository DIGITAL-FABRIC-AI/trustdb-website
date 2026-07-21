import { ArrowUpRight, Check, Clock3, Database, ExternalLink, FlaskConical, HardDrive, LockKeyhole, ShieldCheck, Target, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const cards = [
  { icon: HardDrive, value: '20,279 / 20,432', label: 'proteins processed', detail: 'Approximately 99.25% of the human proteome in a desktop-scale development run.' },
  { icon: Clock3, value: '~27 hours', label: 'runtime', detail: 'Broad triage workload executed on commodity desktop hardware.' },
  { icon: Target, value: '31,779', label: 'covalent triage designs', detail: 'Coverage-layer outputs from two generic probe templates—not a claim of 31,779 novel entities.' },
  { icon: Zap, value: '4 targets', label: 'advanced in days', detail: 'STAT3, β-catenin, KRAS-Cys118, and C3/C3b target-specific design records.' },
]

const states = [
  ['Live', 'Public Program, recipe, engine, and API surfaces', 'emerald'],
  ['Implemented', 'Code and a reproducible path exist; deployment scope may vary', 'cyan'],
  ['Computational', 'Dated result or candidate exists; prospective validation remains', 'amber'],
  ['Research', 'Prototype or roadmap capability; not a shipped product claim', 'violet'],
]

function Label({ children }: { children: string }) { return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p> }

export default function Evidence() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <Label>Evidence, not adjectives</Label>
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">Show what happened, what it means, and what remains to test.</h1>
          <p className="text-base leading-7 text-slate-400">Speed and ambition matter. So does a clean boundary between a live system, a computational result, a research prototype, and a validated biological outcome.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07101f]/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ icon: Icon, value, label, detail }) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Icon size={17} /></div><p className="mt-7 text-2xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 text-xs uppercase tracking-[.13em] text-cyan-100/80">{label}</p><p className="mt-4 text-sm leading-6 text-slate-500">{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><Label>Maturity taxonomy</Label><h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">The claim boundary is part of the product.</h2><p className="mt-5 text-base leading-7 text-slate-400">A fast computational system becomes more credible when it tells the buyer exactly where the evidence is strong, where it is modeled, and what experiment resolves the uncertainty.</p></div>
          <div className="space-y-3">
            {states.map(([title, text, color]) => <div key={title} className="flex gap-4 rounded-xl border border-white/10 bg-[#0a1727] p-5"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${color === 'emerald' ? 'bg-emerald-200' : color === 'cyan' ? 'bg-cyan-200' : color === 'amber' ? 'bg-amber-200' : 'bg-violet-200'}`} /><div><p className="text-sm font-medium text-white">{title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1727]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><Label>Inspect the system</Label><h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">The live API is part of the evidence surface.</h2></div><a href="https://api.braidera.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">Open api.braidera.com <ArrowUpRight size={14} /></a></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [Database, 'Program twins', 'Inspect the target, mechanism, chemistry, confidence, follow-ups, and validation cascade as one native object.', 'https://api.braidera.com/v1/twin/programs'],
              [Zap, 'Engine registry', 'See the specialised engine cards and the workflow capabilities exposed by the deployment.', 'https://api.braidera.com/v1/twin/engines'],
              [FlaskConical, 'Recipes', 'Trace the sequence of discovery, design, refine, score, persist, orchestrate, and verify.', 'https://api.braidera.com/v1/twin/recipes'],
            ].map(([Icon, title, text, href]) => { const IconComponent = Icon as typeof Database; return <a key={title as string} href={href as string} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-[#07101f]/70 p-6 hover:border-cyan-200/25"><IconComponent size={18} className="text-cyan-200" /><h3 className="mt-6 text-base font-medium text-white">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p><span className="mt-5 inline-flex items-center gap-1 text-xs text-cyan-200/80">Inspect endpoint <ExternalLink size={12} /></span></a> })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [ShieldCheck, 'Security', 'Encrypted at rest and in transit with a PQC / CNSA 2.0 Category 5 posture.'],
            [LockKeyhole, 'Provenance', 'Inputs, source dates, engine state, confidence, and freshness travel with the program.'],
            [Check, 'Honesty', 'A computational candidate is never presented as a clinical or experimentally validated result.'],
          ].map(([Icon, title, text]) => { const IconComponent = Icon as typeof ShieldCheck; return <div key={title as string} className="rounded-2xl border border-white/10 bg-[#0a1727] p-6"><IconComponent size={18} className="text-cyan-200" /><h3 className="mt-6 text-base font-medium text-white">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text as string}</p></div> })}
        </div>
        <div className="mt-10 rounded-2xl border border-amber-200/15 bg-amber-200/[.04] p-6 text-sm leading-6 text-slate-400"><span className="font-medium text-amber-100">Evidence note:</span> the broad proteome run is a coverage layer built from generic probe templates. Target-specific chemistry is a separate, deeper design step. All program metrics should be read with their dated workload, hardware, and maturity context.</div>
      </section>

      <section className="border-t border-white/10 bg-grid-fine">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-16 sm:px-8 md:flex-row md:items-center"><div><p className="text-xl font-medium text-white">Want the technical record behind a claim?</p><p className="mt-2 text-sm text-slate-500">Ask for the evidence card, source date, and next falsification step.</p></div><Link to="/contact" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">Request a design-partner briefing <ArrowRight size={15} /></Link></div>
      </section>
    </div>
  )
}
