import { pillarSlugToColor } from '../utils/scores'
import changelogData from '../data/changelog.json'
import type { ChangelogEntry } from '../types'

const changelog = changelogData as ChangelogEntry[]

const tagColors: Record<string, string> = {
  milestone: 'bg-purple-500/20 text-purple-300',
  benchmark: 'bg-blue-500/20 text-blue-300',
  feature: 'bg-emerald-500/20 text-emerald-300',
  fix: 'bg-orange-500/20 text-orange-300',
  architecture: 'bg-cyan-500/20 text-cyan-300',
  security: 'bg-red-500/20 text-red-300',
}

export default function Changelog() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Changelog</h1>
        <p className="text-gray-400">Timeline of major changes and enhancements</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />

        <div className="space-y-6">
          {changelog.map((entry, i) => (
            <div key={i} className="relative pl-14">
              <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-600" />

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-500">{entry.date}</span>
                  {entry.version && (
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-xs font-medium text-gray-300">
                      {entry.version}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{entry.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{entry.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 rounded text-xs font-medium ${tagColors[tag] || 'bg-gray-700 text-gray-300'}`}>
                      {tag}
                    </span>
                  ))}
                  {entry.pillarsAffected.map(p => (
                    <span key={p} className={`px-2 py-0.5 rounded text-xs font-medium ${pillarSlugToColor(p)}`}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
