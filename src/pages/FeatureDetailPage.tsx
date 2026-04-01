import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { featureStatusStyle, featureStatusLabel, pillarSlugToColor } from '../utils/scores'
import BenchmarkTable from '../components/BenchmarkTable'
import HowItWorks from '../components/HowItWorks'
import CompetitorTable from '../components/CompetitorTable'
import featuresIndex from '../data/features.json'
import type { FeatureDetail, FeaturesData } from '../types'

// Dynamic import of all feature detail JSONs
const featureModules = import.meta.glob('../data/features/*.json', { eager: true }) as Record<string, { default: FeatureDetail }>

function loadFeature(slug: string): FeatureDetail | undefined {
  const key = `../data/features/${slug}.json`
  const mod = featureModules[key]
  return mod ? (mod.default || mod) as FeatureDetail : undefined
}

// Build a name lookup from the index
const allFeatures = (featuresIndex as FeaturesData).categories.flatMap(c => c.features)
function featureNameBySlug(slug: string): string {
  return allFeatures.find(f => f.slug === slug)?.name || slug
}

export default function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? loadFeature(slug) : undefined

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-400">Feature not found</h2>
        <Link to="/features" className="text-blue-400 hover:underline mt-4 inline-block">Back to Features</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/features" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Features
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{data.category}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${featureStatusStyle(data.status)}`}>
            {featureStatusLabel(data.status)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{data.name}</h1>
        <div className="flex flex-wrap gap-1.5">
          {data.pillarsAffected.map(p => (
            <span key={p} className={`px-2 py-0.5 rounded text-xs font-medium ${pillarSlugToColor(p)}`}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-3">Overview</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{data.overview}</p>
        </section>

        {/* How It Works */}
        {data.howItWorks.length > 0 && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">How It Works</h2>
            <HowItWorks steps={data.howItWorks} />
          </section>
        )}

        {/* Benchmarks */}
        {data.benchmarks.length > 0 && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Benchmarks</h2>
            <BenchmarkTable benchmarks={data.benchmarks} />
          </section>
        )}

        {/* Competitor Comparison */}
        {data.comparisons.competitors.length > 0 && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Competitive Landscape</h2>
            <CompetitorTable
              narrative={data.comparisons.narrative}
              competitors={data.comparisons.competitors}
            />
          </section>
        )}

        {/* Evidence */}
        {data.evidence.length > 0 && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-3">Evidence & Source</h2>
            <div className="flex flex-wrap gap-2">
              {data.evidence.map((e, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-gray-300">
                  <FileText className="w-3 h-3" />
                  {e.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related Features */}
        {data.relatedFeatures.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-white mb-3">Related Features</h2>
            <div className="flex flex-wrap gap-2">
              {data.relatedFeatures.map(slug => (
                <Link
                  key={slug}
                  to={`/features/${slug}`}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-blue-400 hover:border-blue-800 transition-colors"
                >
                  {featureNameBySlug(slug)}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
