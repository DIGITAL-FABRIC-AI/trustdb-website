import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { scoreColor, scoreBg, formatScore } from '../utils/scores'
import type { Pillar } from '../types'

interface PillarCardProps {
  slug: string
  pillar: Pillar
}

const pillarIcons: Record<string, string> = {
  performance: '\u26A1',
  reliability: '\uD83D\uDEE1\uFE0F',
  scalability: '\uD83D\uDCC8',
  security: '\uD83D\uDD12',
  efficiency: '\uD83C\uDF31',
  connectivity: '\uD83D\uDD17',
}

export default function PillarCard({ slug, pillar }: PillarCardProps) {
  const metrics = Object.entries(pillar.metrics)

  return (
    <Link
      to={`/${slug}`}
      className="group block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 hover:bg-gray-900/80 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{pillarIcons[slug] || '\uD83D\uDCCA'}</span>
            <h3 className="text-lg font-semibold text-white">{pillar.name}</h3>
          </div>
          <p className="text-sm text-gray-500">{pillar.subtitle}</p>
        </div>
        <div className={`relative flex items-center justify-center w-16 h-16 rounded-full ${scoreBg(pillar.overallScore)}`}>
          <span className={`text-xl font-bold ${scoreColor(pillar.overallScore)}`}>
            {formatScore(pillar.overallScore)}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {metrics.map(([key, metric]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{metric.name}</span>
              <span className={`text-xs font-medium ${scoreColor(metric.score)}`}>
                {formatScore(metric.score)}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metric.score === null ? 'bg-gray-700' :
                  metric.score >= 9 ? 'bg-emerald-400' :
                  metric.score >= 7 ? 'bg-blue-400' :
                  metric.score >= 5 ? 'bg-yellow-400' :
                  metric.score >= 3 ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${(metric.score ?? 0) * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm text-gray-500 group-hover:text-blue-400 transition-colors">
        <span>Deep dive</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}
