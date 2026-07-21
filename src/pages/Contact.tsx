import { ArrowRight, Check, CircleDot, FlaskConical, LockKeyhole, MessageSquare, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const prompts = [
  'What target, disease question, or mechanism is currently blocked?',
  'Which data, structures, or prior hypotheses can be brought into the program?',
  'What decision would make the next wet-lab experiment worth running?',
]

export default function Contact() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:pb-28 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-start">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">For design partners</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">Bring the target others have written off.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Start with the biological question. BioTwin will map the solution space, expose the strongest computational branches, and return a package your laboratory can test.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="mailto:hello@braidera.com?subject=BioTwin%20design%20partner%20conversation" className="inline-flex items-center gap-2 rounded-lg bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07101f] hover:bg-white">Start a conversation <ArrowRight size={16} /></a>
              <a href="https://api.braidera.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 hover:border-cyan-200/40 hover:bg-white/5">Inspect the live API <ArrowRight size={16} /></a>
            </div>
            <p className="mt-5 text-xs text-slate-600">Design-partner conversations begin under appropriate confidentiality and data-governance terms.</p>
          </div>
          <div className="rounded-2xl border border-cyan-200/15 bg-[#0a1727] p-6 glow-cyan sm:p-8">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-200/10 text-cyan-100"><MessageSquare size={18} /></span><div><p className="text-sm font-medium text-white">A useful first brief</p><p className="text-xs text-slate-500">No polished deck required.</p></div></div>
            <div className="mt-7 space-y-4">{prompts.map((prompt, index) => <div key={prompt} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-cyan-200/25 text-[10px] text-cyan-100">{index + 1}</span><p className="text-sm leading-6 text-slate-400">{prompt}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1727]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-2xl"><p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">What the program returns</p><h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">A computationally complete package, ready for focused verification.</h2></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Target, 'Target and mechanism map'],
              [CircleDot, 'Candidate and recognition logic'],
              [FlaskConical, 'Safety, ADMET, and validation plan'],
              [LockKeyhole, 'Provenance, confidence, and next decision'],
            ].map(([Icon, text]) => { const IconComponent = Icon as typeof Target; return <div key={text as string} className="rounded-xl border border-white/10 bg-[#07101f]/70 p-5"><IconComponent size={17} className="text-cyan-200" /><p className="mt-5 text-sm font-medium leading-6 text-white">{text as string}</p><div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[.14em] text-amber-100/70"><Check size={12} /> computational · verification downstream</div></div> })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-[#07101f] p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="text-lg font-medium text-white">Prefer to explore first?</p><p className="mt-2 text-sm text-slate-500">Read the evidence or inspect the live public API.</p></div><div className="flex flex-wrap gap-3"><Link to="/evidence" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">Read evidence <ArrowRight size={14} /></Link><Link to="/programs" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">See programs <ArrowRight size={14} /></Link></div></div>
      </section>
    </div>
  )
}
