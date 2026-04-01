import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { scoreColor, formatScore, scoreBg } from '../utils/scores'
import MetricRow from '../components/MetricRow'
import type { DeepDiveData } from '../types'

import performanceData from '../data/deep-dives/performance.json'
import reliabilityData from '../data/deep-dives/reliability.json'
import scalabilityData from '../data/deep-dives/scalability.json'
import securityData from '../data/deep-dives/security.json'
import efficiencyData from '../data/deep-dives/efficiency.json'
import connectivityData from '../data/deep-dives/connectivity.json'

const deepDives: Record<string, DeepDiveData> = {
  performance: performanceData as DeepDiveData,
  reliability: reliabilityData as DeepDiveData,
  scalability: scalabilityData as DeepDiveData,
  security: securityData as DeepDiveData,
  efficiency: efficiencyData as DeepDiveData,
  connectivity: connectivityData as DeepDiveData,
}

export default function DeepDive() {
  const { pillar } = useParams<{ pillar: string }>()
  const data = pillar ? deepDives[pillar] : undefined

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-400">Pillar not found</h2>
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{data.pillarName}</h1>
          <p className="text-gray-400">{data.subtitle}</p>
        </div>
        <div className={`flex items-center justify-center w-20 h-20 rounded-2xl ${scoreBg(data.overallScore)}`}>
          <span className={`text-3xl font-bold ${scoreColor(data.overallScore)}`}>
            {formatScore(data.overallScore)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.sections.map((section, i) => (
          <MetricRow key={i} section={section} />
        ))}
      </div>
    </div>
  )
}
