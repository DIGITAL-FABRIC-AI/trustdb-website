import PillarCard from '../components/PillarCard'
import scoresData from '../data/scores.json'
import type { ScoresData } from '../types'

const scores = scoresData as ScoresData

const pillarOrder = ['performance', 'reliability', 'scalability', 'security', 'efficiency', 'connectivity']

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">TrustDB Scorecard</h1>
        <p className="text-gray-400">
          Tracking quality across 6 pillars. Last updated{' '}
          <span className="text-gray-300">{scores.lastUpdated}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillarOrder.map(slug => {
          const pillar = scores.pillars[slug]
          if (!pillar) return null
          return <PillarCard key={slug} slug={slug} pillar={pillar} />
        })}
      </div>
    </div>
  )
}
