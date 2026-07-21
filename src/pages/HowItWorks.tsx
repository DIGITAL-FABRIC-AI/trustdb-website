import { ArrowRight, Check, CircleDot, FlaskConical, GitBranch, Layers3, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { icon: Search, number: '01', title: 'Map', text: 'Frame the target, disease question, pathway, proteome context, and available evidence.' },
  { icon: Sparkles, number: '02', title: 'Expose', text: 'Search structural states, transient pockets, reactive surfaces, interfaces, disorder, and causal relationships.' },
  { icon: GitBranch, number: '03', title: 'Choose', text: 'Keep competing intervention architectures alive: inhibition, stabilisation, degradation, PPI, immune, nucleic-acid, metabolic, or combination.' },
  { icon: Layers3, number: '04', title: 'Design', text: 'Generate target-specific molecules, binders, delivery concepts, or induced-proximity routes with explicit constraints.' },
  { icon: ShieldCheck, number: '05', title: 'Refine', text: 'Iterate recognition, potency, selectivity, exposure, safety, ADMET/PK, synthesis, evidence, and stop gates.' },
  { icon: FlaskConical, number: '06', title: 'Validate', text: 'Hand the lab a precise prediction, controls, thresholds, and the result that changes the next branch.' },
]

function Label({ children }: { children: string }) { return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p> }

export default function HowItWorks() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <Label>How BioTwin works</Label>
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">Push discovery as far as computation can take it.</h1>
          <p className="text-base leading-7 text-slate-400">The lab is not asked to rediscover the program. It receives the specific finding that remains uncertain, with a verification package designed to produce a decisive answer.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07101f]/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, text }) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-cyan-200/25 hover:bg-white/[.055]">
                <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Icon size={17} /></span><span className="text-xs text-slate-600">{number}</span></div>
                <h2 className="mt-7 text-lg font-medium text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <Label>The handoff</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">The lab should test a decision—not rediscover a program.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">A computationally complete package is ready for verification. It is not a claim that the biology is already proven. The remaining uncertainty is named, bounded, and tied to the next branch.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0a1727] p-6 sm:p-8">
            {[
              ['Predicted finding', 'site, mechanism, candidate, or functional consequence'],
              ['Controls', 'negative, positive, selectivity, and exposure controls'],
              ['Decision threshold', 'the quantitative result that advances, redirects, or kills the branch'],
              ['Feedback contract', 'how measured results update the versioned Program and reusable engines'],
            ].map(([title, text]) => <div key={title} className="flex gap-4 border-b border-white/10 py-4 first:pt-0 last:border-0 last:pb-0"><Check size={16} className="mt-0.5 shrink-0 text-emerald-200" /><div><p className="text-sm font-medium text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1727]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-2xl"><Label>Evidence states</Label><h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Ambition in the product. Precision in the proof.</h2><p className="mt-5 text-base leading-7 text-slate-400">Every public program carries a maturity label. The system can move quickly without hiding where computation ends and experiment begins.</p></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Live', 'inspectable in the API or deployed product surface', 'text-emerald-200'],
              ['Implemented', 'code and a reproducible path exist; deployment may vary', 'text-cyan-200'],
              ['Computational', 'a dated result or candidate exists; validation is pending', 'text-amber-200'],
              ['Research', 'a prototype or roadmap capability, not a product claim', 'text-violet-200'],
            ].map(([title, text, color]) => <div key={title} className="rounded-xl border border-white/10 bg-[#07101f]/70 p-5"><div className="flex items-center gap-2"><CircleDot size={14} className={color} /><p className="text-sm font-medium text-white">{title}</p></div><p className="mt-3 text-xs leading-5 text-slate-500">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center">
        <div><p className="text-xl font-medium text-white">See a program move through the loop.</p><p className="mt-2 text-sm text-slate-500">Start with Lp(a), KRAS-Cys118, or your own hard target.</p></div>
        <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-white">Explore programs <ArrowRight size={15} /></Link>
      </section>
    </div>
  )
}
