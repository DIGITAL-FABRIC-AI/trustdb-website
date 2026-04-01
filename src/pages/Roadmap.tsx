import { pillarSlugToColor } from '../utils/scores'
import roadmapData from '../data/roadmap.json'
import type { RoadmapData, RoadmapStatus, RoadmapPriority } from '../types'

const roadmap = roadmapData as RoadmapData

const statusStyles: Record<RoadmapStatus, string> = {
  'idea': 'bg-gray-700/50 text-gray-300',
  'planned': 'bg-blue-500/20 text-blue-300',
  'in-progress': 'bg-amber-500/20 text-amber-300',
  'complete': 'bg-emerald-500/20 text-emerald-300',
}

const priorityStyles: Record<RoadmapPriority, string> = {
  'low': 'text-gray-500',
  'medium': 'text-gray-400',
  'high': 'text-orange-400',
  'critical': 'text-red-400',
}

const priorityDots: Record<RoadmapPriority, string> = {
  'low': 'bg-gray-600',
  'medium': 'bg-gray-500',
  'high': 'bg-orange-400',
  'critical': 'bg-red-400',
}

export default function Roadmap() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Roadmap</h1>
        <p className="text-gray-400">Ideas and planned work organized by category</p>
      </div>

      <div className="space-y-8">
        {roadmap.categories.map((category, ci) => (
          <div key={ci}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {category.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((item, ii) => (
                <div key={ii} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white pr-3">{item.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.pillarsAffected.map(p => (
                        <span key={p} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${pillarSlugToColor(p)}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityDots[item.priority]}`} />
                      <span className={`text-[10px] font-medium ${priorityStyles[item.priority]}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
