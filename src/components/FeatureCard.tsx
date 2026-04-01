import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { featureStatusStyle, featureStatusLabel } from '../utils/scores'
import type { FeatureSummary } from '../types'

export default function FeatureCard({ feature }: { feature: FeatureSummary }) {
  return (
    <Link
      to={`/features/${feature.slug}`}
      className="group flex items-start justify-between gap-3 bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:bg-gray-900/80 transition-all"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-white truncate">{feature.name}</h4>
          <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium border ${featureStatusStyle(feature.status)}`}>
            {featureStatusLabel(feature.status)}
          </span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2">{feature.tagline}</p>
      </div>
      <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}
