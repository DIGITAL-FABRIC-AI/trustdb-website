import type { HowItWorksStep } from '../types'

export default function HowItWorks({ steps }: { steps: HowItWorksStep[] }) {
  if (steps.length === 0) return null

  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-bold">
            {s.step}
          </div>
          <div className="pt-1">
            <h4 className="text-sm font-semibold text-white mb-1">{s.title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
