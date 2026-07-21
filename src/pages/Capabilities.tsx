import { ArrowRight, Atom, Boxes, BrainCircuit, CircleDot, Eye, GitBranch, Layers3, Network, ShieldCheck, Target, Workflow, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const capabilities = [
  { icon: Eye, title: 'Expose hidden structural states', maturity: 'Launch-ready', text: 'Reason across ensemble hypotheses, geometry, topology, disorder, reactive surfaces, and interfaces to identify mechanisms that a single static snapshot can miss.', proof: 'Dynamic ensemble and cryptic-pocket workflows', href: '/how-it-works' },
  { icon: Target, title: 'Find a tractable mechanism', maturity: 'Implemented', text: 'Map target, disease, pathway, and causal context before committing the program to one intervention type.', proof: 'Mechanism branches and explicit stop gates', href: '/programs' },
  { icon: Atom, title: 'Design target-specific chemistry', maturity: 'Implemented', text: 'Move beyond generic warhead templates into recognition scaffold, linker, prodrug logic, and site-matched reversible or covalent chemistry.', proof: 'STAT3 · β-catenin · KRAS-Cys118 · C3/C3b', href: '/programs' },
  { icon: Layers3, title: 'Compare solution modalities', maturity: 'Program-dependent', text: 'Keep small molecules, degraders, molecular glues, PPI modulation, immune, nucleic-acid, metabolic, and regenerative routes in one decision space.', proof: 'Lp(a) multi-route frontier', href: '/programs' },
  { icon: ShieldCheck, title: 'Model selectivity and liabilities', maturity: 'Implemented', text: 'Treat selectivity as a generative constraint: distinguish created cysteines from conserved pan-family sites and intersect recognition with warhead cleanliness.', proof: 'KRAS Cys12 vs Cys118 regime detection', href: '/evidence' },
  { icon: Network, title: 'Preserve evidence and uncertainty', maturity: 'Live', text: 'Keep provenance, confidence, freshness, alternatives, blockers, and the next falsification step attached to the program.', proof: '8DB-native Program and public API', href: '/platform' },
  { icon: Zap, title: 'Run broad, then go deep', maturity: 'Demonstrated', text: 'Map proteome and portfolio opportunity on commodity hardware, then spend design depth on targets with a decision worth making.', proof: '20,279 proteins processed on desktop', href: '/evidence' },
  { icon: Workflow, title: 'Prepare the verification handoff', maturity: 'Implemented', text: 'Deliver a sequenced package of controls, thresholds, predicted outcome, and branch-changing result for the downstream laboratory.', proof: 'Confirm-not-discover operating model', href: '/how-it-works' },
]

const modalities = [
  ['Small molecules', 'targeted chemistry', 'Implemented'],
  ['Covalent / reversible covalent', 'reactive-site programs', 'Implemented'],
  ['Molecular glues', 'induced proximity', 'Program-dependent'],
  ['Degraders / LYTAC', 'compartment-aware clearance', 'Program-dependent'],
  ['PPI modulation', 'interface and surface logic', 'In progress'],
  ['Protein rescue', 'stabilisation and proteostasis', 'In progress'],
  ['Immune recognition', 'epitope and recognition routes', 'In progress'],
  ['DNA / RNA intervention', 'transcript and nucleic-acid routes', 'Roadmap'],
  ['Metabolic / causal network', 'system-level intervention', 'In progress'],
  ['Cellular / regenerative', 'state and tissue programs', 'Roadmap'],
]

function Label({ children }: { children: string }) { return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200/80">{children}</p> }

export default function Capabilities() {
  return (
    <div className="bg-grid">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <div className="max-w-3xl">
          <Label>Capabilities</Label>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl">Make hard-target discovery a <span className="text-gradient">decision system.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">BioTwin organizes the work by the decision a discovery team needs to make—not by a disconnected list of models.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07101f]/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, maturity, text, proof, href }, index) => (
              <Link key={title} to={href} className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-cyan-200/30 hover:bg-white/[.055]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Icon size={19} /></span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-medium text-white">{title}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[.12em] text-slate-500">{maturity}</span>
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-slate-400">{text}</span>
                  <span className="mt-4 flex items-center gap-2 text-xs text-cyan-200/80">Proof: {proof} <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span>
                </span>
                <span className="hidden text-xs text-slate-700 sm:block">0{index + 1}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <Label>One target, many routes</Label>
            <h2 className="text-3xl font-semibold tracking-[-.03em] text-white sm:text-4xl">Choose the intervention after you understand the biology.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">The platform can organize competing solution architectures before a program is forced into the first familiar modality. Each route carries an explicit maturity state; a taxonomy is not a validation claim.</p>
            <Link to="/programs" className="mt-8 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">See programs in context <ArrowRight size={15} /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {modalities.map(([name, detail, status]) => (
              <div key={name} className="rounded-xl border border-white/10 bg-[#0a1727] p-4">
                <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-white">{name}</p><CircleDot size={14} className={status === 'Implemented' || status === 'Demonstrated' ? 'text-emerald-200' : 'text-amber-200'} /></div>
                <p className="mt-2 text-xs text-slate-500">{detail}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[.15em] text-slate-600">{status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a1727]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [BrainCircuit, 'Evidence-native', 'The output is a replayable program with its reasoning, confidence, and limits attached.'],
              [GitBranch, 'Generative constraints', 'Selectivity, safety, and exposure shape what gets designed—not only how it gets scored.'],
              [Boxes, 'Portfolio-ready', 'Reusable engines, recipes, and state make every target a contribution to the next program.'],
            ].map(([Icon, title, text]) => {
              const IconComponent = Icon as typeof BrainCircuit
              return <div key={title as string} className="rounded-2xl border border-white/10 bg-[#07101f]/70 p-6"><IconComponent size={19} className="text-cyan-200" /><h3 className="mt-6 text-base font-medium text-white">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text as string}</p></div>
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
