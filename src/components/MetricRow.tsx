import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { useState } from 'react'
import { scoreColor, formatScore } from '../utils/scores'
import StatusBadge from './StatusBadge'
import BenchmarkTable from './BenchmarkTable'
import HistoryChart from './HistoryChart'
import type { DeepDiveSection } from '../types'

export default function MetricRow({ section }: { section: DeepDiveSection }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-white">{section.metricName}</h3>
              <StatusBadge status={section.status} />
            </div>
          </div>
        </div>
        <span className={`text-2xl font-bold ${scoreColor(section.score)}`}>
          {formatScore(section.score)}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-800">
          {section.narrative && (
            <p className="text-sm text-gray-400 mt-4 mb-4 leading-relaxed">
              {section.narrative}
            </p>
          )}

          {section.benchmarks.length > 0 && (
            <div className="mb-4">
              <BenchmarkTable benchmarks={section.benchmarks} />
            </div>
          )}

          {section.history.length >= 2 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-1">History</h4>
              <HistoryChart history={section.history} />
            </div>
          )}

          {section.evidence.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Evidence</h4>
              <div className="flex flex-wrap gap-2">
                {section.evidence.map((e, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-gray-300"
                  >
                    <FileText className="w-3 h-3" />
                    {e.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
