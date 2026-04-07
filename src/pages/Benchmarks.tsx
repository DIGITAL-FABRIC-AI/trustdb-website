import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Search, Pencil, Layers, GitBranch, MapPin, FileSearch,
  Combine, Shield, HardDrive, Battery, ChevronDown, ChevronRight,
  Clock, Database, FlaskConical, Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import benchmarkData from '../data/benchmarks.json'

type Perspective = 'operation' | 'competitor' | 'timeline' | 'source'

const perspectiveTabs: { id: Perspective; label: string; icon: typeof Search }[] = [
  { id: 'operation', label: 'By Operation', icon: Layers },
  { id: 'competitor', label: 'vs Competitors', icon: Zap },
  { id: 'timeline', label: 'Progress Over Time', icon: Clock },
  { id: 'source', label: 'By Data Source', icon: Database },
]

const operationIcons: Record<string, typeof Search> = {
  'search': Search,
  'pencil': Pencil,
  'layers': Layers,
  'git-branch': GitBranch,
  'map-pin': MapPin,
  'file-search': FileSearch,
  'combine': Combine,
  'shield': Shield,
  'hard-drive': HardDrive,
  'battery': Battery,
}

function WinnerBadge({ winner }: { winner: string }) {
  if (winner === 'trustdb') return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-400">WIN</span>
  if (winner === 'competitor') return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-400/20 text-red-400">LOSE</span>
  return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-400">TIE</span>
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    'db-gym': 'bg-blue-400/15 text-blue-400',
    'criterion': 'bg-purple-400/15 text-purple-400',
    'security-gym': 'bg-red-400/15 text-red-400',
    'multimodal': 'bg-amber-400/15 text-amber-400',
    'locality': 'bg-cyan-400/15 text-cyan-400',
    'geo': 'bg-green-400/15 text-green-400',
    'simd': 'bg-pink-400/15 text-pink-400',
    'competitive': 'bg-orange-400/15 text-orange-400',
  }
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${colors[source] || 'bg-gray-400/15 text-gray-400'}`}>{source}</span>
}

function PillarBadge({ pillar }: { pillar: string }) {
  const colors: Record<string, string> = {
    performance: 'bg-blue-500/15 text-blue-300',
    reliability: 'bg-emerald-500/15 text-emerald-300',
    scalability: 'bg-purple-500/15 text-purple-300',
    security: 'bg-red-500/15 text-red-300',
    efficiency: 'bg-amber-500/15 text-amber-300',
  }
  return (
    <Link to={`/${pillar}`} className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize hover:opacity-80 transition-opacity ${colors[pillar] || 'bg-gray-500/15 text-gray-300'}`}>
      {pillar}
    </Link>
  )
}

// --- Operation View ---
function OperationView() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    benchmarkData.perspectives.byOperation.groups.forEach(g => { initial[g.name] = true })
    return initial
  })

  const toggle = (name: string) => setExpandedGroups(prev => ({ ...prev, [name]: !prev[name] }))

  return (
    <div className="space-y-3">
      {benchmarkData.perspectives.byOperation.groups.map(group => {
        const Icon = operationIcons[group.icon] || Layers
        const expanded = expandedGroups[group.name]
        return (
          <div key={group.name} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <button onClick={() => toggle(group.name)} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-3">
                {expanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                <Icon className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">{group.name}</h3>
                <span className="text-xs text-gray-500">{group.benchmarks.length} benchmarks</span>
              </div>
            </button>
            {expanded && (
              <div className="px-4 pb-4 border-t border-gray-800">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-2 pr-3 text-gray-400 font-medium">Benchmark</th>
                      <th className="text-right py-2 px-3 text-gray-400 font-medium">TrustDB</th>
                      <th className="text-right py-2 px-3 text-gray-400 font-medium">Comparisons</th>
                      <th className="text-left py-2 px-3 text-gray-400 font-medium">Verdict</th>
                      <th className="text-center py-2 pl-3 text-gray-400 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.benchmarks.map((b, i) => (
                      <tr key={i} className="border-b border-gray-800/50 align-top">
                        <td className="py-2.5 pr-3">
                          <div className="text-gray-200">{b.name}</div>
                          {b.pillar && <PillarBadge pillar={b.pillar} />}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-blue-300 font-medium whitespace-nowrap">{b.value}</td>
                        <td className="py-2.5 px-3 text-right">
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
                        <td className="py-2.5 px-3 text-xs text-gray-400 max-w-xs">{b.verdict}</td>
                        <td className="py-2.5 pl-3 text-center"><SourceBadge source={b.source} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Competitor View ---
function CompetitorView() {
  const [selected, setSelected] = useState(benchmarkData.perspectives.byCompetitor.competitors[0].name)
  const comp = benchmarkData.perspectives.byCompetitor.competitors.find(c => c.name === selected)!

  const wins = comp.matchups.filter(m => m.winner === 'trustdb').length
  const losses = comp.matchups.filter(m => m.winner === 'competitor').length
  const ties = comp.matchups.filter(m => m.winner === 'tie').length

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {benchmarkData.perspectives.byCompetitor.competitors.map(c => (
          <button
            key={c.name}
            onClick={() => setSelected(c.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === c.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">TrustDB vs {comp.name}</h3>
            <p className="text-sm text-gray-500">{comp.category}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{wins}</div>
              <div className="text-gray-500 text-xs">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{ties}</div>
              <div className="text-gray-500 text-xs">Ties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{losses}</div>
              <div className="text-gray-500 text-xs">Losses</div>
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 pr-3 text-gray-400 font-medium">Dimension</th>
              <th className="text-right py-2 px-3 text-gray-400 font-medium">TrustDB</th>
              <th className="text-right py-2 px-3 text-gray-400 font-medium">{comp.name}</th>
              <th className="text-center py-2 px-3 text-gray-400 font-medium">Result</th>
              <th className="text-left py-2 pl-3 text-gray-400 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {comp.matchups.map((m, i) => (
              <tr key={i} className="border-b border-gray-800/50">
                <td className="py-2.5 pr-3 text-gray-200 font-medium">{m.dimension}</td>
                <td className={`py-2.5 px-3 text-right font-mono text-sm ${m.winner === 'trustdb' ? 'text-emerald-300' : m.winner === 'competitor' ? 'text-gray-400' : 'text-blue-300'}`}>{m.trustdb}</td>
                <td className={`py-2.5 px-3 text-right font-mono text-sm ${m.winner === 'competitor' ? 'text-emerald-300' : m.winner === 'trustdb' ? 'text-gray-400' : 'text-blue-300'}`}>{m.competitor}</td>
                <td className="py-2.5 px-3 text-center"><WinnerBadge winner={m.winner} /></td>
                <td className="py-2.5 pl-3 text-xs text-gray-500">{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-gray-800">{comp.summary}</p>
      </div>
    </div>
  )
}

// --- Timeline View ---
function TimelineView() {
  const milestones = benchmarkData.perspectives.byTimeline.milestones

  // Build sparkline data for point write latency
  const writeLatencyData = [
    { date: 'Mar 28', value: 87.1 },
    { date: 'Mar 29', value: 40 },
    { date: 'Mar 30', value: 19.2 },
  ]

  return (
    <div>
      {/* Sparkline: Point Write Latency Improvement */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-1">Point Write Latency Improvement</h3>
        <div className="flex items-end gap-4 mb-2">
          <span className="text-3xl font-bold text-emerald-400">19.2µs</span>
          <span className="text-sm text-gray-500">from 87.1µs — <span className="text-emerald-400 font-medium">4.5x improvement</span> in 3 days</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={writeLatencyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6', fontSize: '12px' }}
                formatter={(value) => [`${value}µs`, 'Latency']}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />
        {milestones.map((milestone, i) => (
          <div key={i} className="relative pl-14 pb-8">
            <div className="absolute left-4 w-5 h-5 rounded-full bg-gray-900 border-2 border-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-mono text-blue-400">{milestone.date}</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-400/15 text-blue-300">{milestone.phase}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {milestone.highlights.map((h, hi) => (
                  <div key={hi} className="bg-gray-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-500 mb-0.5">{h.metric}</div>
                    <div className="text-sm font-mono text-white font-medium">{h.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{h.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Source View ---
function SourceView() {
  const sources = benchmarkData.sources
  const groups = benchmarkData.perspectives.bySource.groups

  return (
    <div className="space-y-4">
      {/* Source status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {sources.map(s => (
          <div key={s.id} className={`bg-gray-900 border rounded-xl p-4 ${s.status === 'active' ? 'border-emerald-800' : s.status === 'partial' ? 'border-yellow-800' : 'border-gray-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{s.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                s.status === 'active' ? 'bg-emerald-400/20 text-emerald-400'
                : s.status === 'partial' ? 'bg-yellow-400/20 text-yellow-400'
                : 'bg-gray-400/20 text-gray-400'
              }`}>{s.status}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{s.description}</p>
            {s.lastRun && <div className="text-[10px] text-gray-600">Last run: {s.lastRun}</div>}
          </div>
        ))}
      </div>

      {/* Detailed source breakdown */}
      {groups.map(g => (
        <div key={g.source} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">{g.source}</h3>
              <span className="text-xs text-gray-500">{g.benchmarkCount} benchmarks</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">{g.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {g.keyResults.map((r, i) => (
              <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-gray-300">{r}</span>
            ))}
          </div>

          <div className="flex flex-col gap-1 text-xs text-gray-500 border-t border-gray-800 pt-3">
            <div><span className="text-gray-600 font-medium">Run:</span> <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">{g.runCommand}</code></div>
            <div><span className="text-gray-600 font-medium">Results:</span> <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">{g.resultPath}</code></div>
            {'note' in g && (g as {note?: string}).note && <div className="text-yellow-500 mt-1">{(g as {note?: string}).note}</div>}
          </div>
        </div>
      ))}

      {/* Integration notes */}
      <div className="bg-gray-900 border border-yellow-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          Integration Notes
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div>
            <div className="font-medium text-gray-300 mb-1">DB-Gym → Scorecard Pipeline</div>
            <p>DB-Gym results (JSON) should auto-update scorecard deep-dive JSONs. Currently manual. Run <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">cargo run -p trustdb_gym --release</code> then copy key metrics to <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">src/data/deep-dives/performance.json</code>.</p>
          </div>
          <div>
            <div className="font-medium text-gray-300 mb-1">SecurityGYM → Security Pillar</div>
            <p>23 adversarial tests exist as inline <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">gym_*.rs</code> files. When full SecurityGYM crate is built (WN-SGYM-000), results should feed <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">src/data/deep-dives/security.json</code>. 8 planned modules: CryptGym, GovGym, ChannelGym, CipherGym, PrivGym, FuzzGym, AgentGym, AuditGym.</p>
          </div>
          <div>
            <div className="font-medium text-gray-300 mb-1">Criterion → Latency/Throughput Metrics</div>
            <p>Statistical benchmarks with confidence intervals. Results go to <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">trustdb/target/criterion/</code>. Key metrics (point read/write, batch, decay eval) feed the Performance pillar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ---
export default function Benchmarks() {
  const [perspective, setPerspective] = useState<Perspective>('operation')
  const { summary } = benchmarkData

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Benchmarks</h1>
        <p className="text-gray-400">All TrustDB benchmarks from every source, viewed from multiple perspectives</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{summary.totalBenchmarks}</div>
          <div className="text-xs text-gray-500">Total Benchmarks</div>
        </div>
        <div className="bg-gray-900 border border-emerald-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{summary.targetsMet}</div>
          <div className="text-xs text-gray-500">Targets Met</div>
        </div>
        <div className="bg-gray-900 border border-red-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{summary.targetsUnmet}</div>
          <div className="text-xs text-gray-500">Targets Unmet</div>
        </div>
        <div className="bg-gray-900 border border-blue-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{summary.overallPassRate}</div>
          <div className="text-xs text-gray-500">Pass Rate</div>
        </div>
      </div>

      {/* Perspective tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 border border-gray-800">
        {perspectiveTabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setPerspective(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                perspective === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Perspective content */}
      {perspective === 'operation' && <OperationView />}
      {perspective === 'competitor' && <CompetitorView />}
      {perspective === 'timeline' && <TimelineView />}
      {perspective === 'source' && <SourceView />}

      {/* Footer: last updated */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-gray-600 text-center">
        Last updated: {benchmarkData.lastUpdated} · {benchmarkData.sources.filter(s => s.status === 'active').length} active sources · {benchmarkData.sources.filter(s => s.status === 'partial').length} partial · {benchmarkData.sources.filter(s => s.status === 'planned').length} planned
      </div>
    </div>
  )
}
