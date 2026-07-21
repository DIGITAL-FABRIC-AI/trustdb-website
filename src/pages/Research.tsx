import { ArrowRight, BookOpen, ExternalLink, FileText, FlaskConical, Network, Orbit, PenLine } from 'lucide-react'
import { Link } from 'react-router-dom'

const articles = [
  ['The wet lab is the validator, not the discovery engine', 'Operating model', 'Why compute-first programs produce better, narrower experiments—and how measured results improve the next run.'],
  ['From shared LBS liability to disease-selective recognition', 'Apo(a) / Lp(a)', 'How KIV-2 repeat absence, KIV-9 positioning, and ASGPR delivery become one ligand-and-recognition system.'],
  ['The dynamic state problem in covalent discovery', 'Methods', 'Why ensemble reasoning, transient pockets, and reactive-site physics matter when a static structure is not the target.'],
  ['Map broadly, design specifically', 'Chemistry', 'What proteome-scale generic triage can do—and why it must be followed by target-specific chemistry.'],
  ['A program is more valuable than a prediction', 'Architecture', 'Why evidence, provenance, uncertainty, and validation contracts belong in the primary scientific object.'],
  ['Commodity-scale biology', 'Infrastructure', 'What changes when proteome-scale computational discovery can run near the data on ordinary hardware.'],
  ['Selectivity as a generative constraint', 'Covalent design', 'Created cysteines, conserved pan-family sites, warhead cleanliness, and functional consequence in one decision system.'],
  ['8DB: one state, many scientific views', 'Platform', 'How graphs, geometry, manifolds, MERA, braids, order-lattices, and topology can work over one evidence-bearing substrate.'],
]

function Label({ children }: { children: string }) { return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p> }

export default function Research() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <Label>BraidEra field notes</Label>
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">Research for a field that wants better questions.</h1>
          <p className="text-base leading-7 text-slate-400">Methods, evidence, and operating ideas for computational discovery that stays connected to the experiment it is meant to decide.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07101f]/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map(([title, category, text], index) => <article key={title} className="group rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-cyan-200/25 hover:bg-white/[.055]"><div className="flex items-center justify-between"><span className="rounded-full border border-cyan-200/15 bg-cyan-200/5 px-2.5 py-1 text-[10px] uppercase tracking-[.14em] text-cyan-100/80">{category}</span><span className="text-xs text-slate-700">0{index + 1}</span></div><h2 className="mt-7 text-xl font-medium leading-7 text-white">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p><span className="mt-7 inline-flex items-center gap-2 text-xs text-cyan-200/80">Read the research note <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            [BookOpen, 'Methods', 'Mechanistic engines, dynamic ensembles, topology, chemistry, and validation methodology.'],
            [Network, 'Architecture', 'How evidence-native programs and omnimodal 8DB projections change the shape of discovery.'],
            [PenLine, 'Market notes', 'Where time and money are lost today, and which BraidEra capabilities can remove the most expensive loops.'],
          ].map(([Icon, title, text]) => { const IconComponent = Icon as typeof BookOpen; return <div key={title as string} className="rounded-2xl border border-white/10 bg-[#0a1727] p-6"><IconComponent size={18} className="text-cyan-200" /><h2 className="mt-6 text-lg font-medium text-white">{title as string}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{text as string}</p></div> })}
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a1727] p-7 sm:p-9">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><FlaskConical size={18} /></span><span className="text-sm font-medium text-white">Research standard</span></div>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-white">Every article should separate implemented capability, dated computational evidence, modelled route, research prototype, and experimentally validated outcome.</p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">The goal is not to understate what the system can do. It is to make the boundary visible enough that a serious scientific reader can trust the ambition.</p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a1727]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-16 sm:px-8 md:flex-row md:items-center"><div><p className="text-xl font-medium text-white">Explore the evidence library.</p><p className="mt-2 text-sm text-slate-500">The full research and publication pipeline lives in Notion.</p></div><a href="https://app.notion.com/p/3a4825bc1d8b8161bd2ac5899019eac1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">Open publication library <ExternalLink size={14} /></a></div>
      </section>
    </div>
  )
}
