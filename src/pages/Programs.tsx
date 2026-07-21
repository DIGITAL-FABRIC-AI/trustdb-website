import { ArrowRight, Check, ChevronRight, FlaskConical, LockKeyhole, Orbit, Target, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'

const programs = [
  {
    id: '01',
    title: 'Apo(a) / Lp(a)',
    kicker: 'Multi-molecule · multi-mechanism',
    status: 'Computational program',
    text: 'A target-specific ligand, recognition, delivery, and induced-proximity system for Lp(a)/ASCVD.',
    bullets: ['KIV-2 repeat-unique recognition', 'KIV-9 bivalent warhead positioning', 'GalNAc–ASGPR delivery and compartment-aware LYTAC logic'],
    accent: 'from-cyan-200/20 to-blue-300/5',
  },
  {
    id: '02',
    title: 'KRAS-Cys118',
    kicker: 'Reversible covalent chemistry',
    status: 'Structure-verified design',
    text: 'A target-specific branch that distinguishes covalent engagement from isoform selectivity and corrects generic-warhead assumptions.',
    bullets: ['Reactive-species regime detection', 'Recognition × warhead cleanliness intersection', 'RDKit-verified candidate and route logic'],
    accent: 'from-blue-300/20 to-violet-300/5',
  },
  {
    id: '03',
    title: 'STAT3 · β-catenin · C3/C3b',
    kicker: 'Target-specific velocity',
    status: 'Structure-verified designs',
    text: 'Four heterogeneous target programs advanced from site and scaffold hypotheses to chemically explicit candidates in days each.',
    bullets: ['Recognition scaffold + site-matched warhead', 'Drug-like and sourceable starting-material checks', 'Reusable design/refinement loop'],
    accent: 'from-emerald-200/20 to-cyan-300/5',
  },
  {
    id: '04',
    title: 'Human proteome map',
    kicker: 'Broad coverage · desktop execution',
    status: 'Demonstrated run',
    text: 'A proteome-scale triage workload that maps both positive opportunities and explicit negatives on commodity hardware.',
    bullets: ['20,279 of 20,432 proteins processed', '~27 hours on a desktop computer', '31,779 covalent triage designs persisted'],
    accent: 'from-amber-200/20 to-orange-300/5',
  },
]

function Label({ children }: { children: string }) { return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p> }

export default function Programs() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <Label>Programs, not demos</Label>
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">See the work as a <span className="text-gradient">program of record.</span></h1>
          <p className="text-base leading-7 text-slate-400">Every program keeps the target question, mechanism branch, candidate state, evidence freshness, limitations, and next validation decision connected.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07101f]/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-5 lg:grid-cols-2">
            {programs.map(program => (
              <article key={program.id} className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${program.accent} p-7`}>
                <div className="absolute right-6 top-6 text-xs text-slate-700">{program.id}</div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[.16em] text-cyan-100/70"><Orbit size={14} /> {program.kicker}</div>
                <h2 className="mt-5 text-2xl font-medium text-white">{program.title}</h2>
                <div className="mt-3 inline-flex rounded-full border border-amber-200/20 bg-amber-200/10 px-2.5 py-1 text-[10px] uppercase tracking-[.13em] text-amber-100">{program.status}</div>
                <p className="mt-5 text-sm leading-6 text-slate-300">{program.text}</p>
                <div className="mt-6 space-y-3">
                  {program.bullets.map(bullet => <div key={bullet} className="flex gap-3 text-sm text-slate-400"><Check size={15} className="mt-0.5 shrink-0 text-emerald-200" />{bullet}</div>)}
                </div>
                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-[11px] text-slate-600">Computational result · validation pending</span>
                  <Link to="/contact" className="inline-flex items-center gap-1 text-xs text-cyan-200 hover:text-white">Discuss a program <ArrowRight size={13} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Label>Program card standard</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">A result is only useful if the next decision is visible.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">The public surface is deliberately explicit about maturity. It shows what was computed, what remains uncertain, what would falsify the branch, and what the laboratory should test next.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0a1727] p-6">
            {[
              [Target, 'Target question', 'What biological or therapeutic decision is this program answering?'],
              [Workflow, 'Mechanism branch', 'Why this intervention route, and which alternatives remain alive?'],
              [FlaskConical, 'Validation contract', 'Which controls, threshold, and result change the next branch?'],
              [LockKeyhole, 'Evidence state', 'What is live, computational, fresh, inferred, or still unknown?'],
            ].map(([Icon, title, text]) => {
              const IconComponent = Icon as typeof Target
              return <div key={title as string} className="flex gap-4 border-b border-white/10 py-4 first:pt-0 last:border-0 last:pb-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-cyan-200"><IconComponent size={16} /></span><div><p className="text-sm font-medium text-white">{title as string}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text as string}</p></div></div>
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a1727]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center">
          <div><p className="text-xl font-medium text-white">Want to see your target as a program?</p><p className="mt-2 text-sm text-slate-500">Start with the question, not a preconceived modality.</p></div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07101f] hover:bg-white">Bring a target <ChevronRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
