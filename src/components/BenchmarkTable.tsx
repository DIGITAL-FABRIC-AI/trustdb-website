import { Check, X, Minus } from 'lucide-react'
import type { Benchmark } from '../types'

export default function BenchmarkTable({ benchmarks }: { benchmarks: Benchmark[] }) {
  if (benchmarks.length === 0) return null

  const hasComparisons = benchmarks.some(b => b.comparisons && b.comparisons.length > 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-2 pr-4 text-gray-400 font-medium">Benchmark</th>
            <th className="text-right py-2 px-4 text-gray-400 font-medium">TrustDB</th>
            {hasComparisons && (
              <th className="text-right py-2 px-4 text-gray-400 font-medium">Comparisons</th>
            )}
            <th className="text-right py-2 px-4 text-gray-400 font-medium">Target</th>
            <th className="text-center py-2 pl-4 text-gray-400 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {benchmarks.map((b, i) => (
            <tr key={i} className="border-b border-gray-800/50 align-top">
              <td className="py-2.5 pr-4 text-gray-200">{b.name}</td>
              <td className="py-2.5 px-4 text-right font-mono text-blue-300 font-medium">{b.value}</td>
              {hasComparisons && (
                <td className="py-2.5 px-4 text-right">
                  {b.comparisons && b.comparisons.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {b.comparisons.map((c, ci) => (
                        <div key={ci} className="flex items-center justify-end gap-2">
                          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{c.system}</span>
                          <span className="font-mono text-xs text-gray-400">{c.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-700">--</span>
                  )}
                </td>
              )}
              <td className="py-2.5 px-4 text-right font-mono text-gray-500">{b.target}</td>
              <td className="py-2.5 pl-4 text-center">
                {b.met === true && <Check className="w-4 h-4 text-emerald-400 mx-auto" />}
                {b.met === false && <X className="w-4 h-4 text-red-400 mx-auto" />}
                {b.met === null && <Minus className="w-4 h-4 text-gray-600 mx-auto" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
