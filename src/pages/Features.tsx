import FeatureCard from '../components/FeatureCard'
import featuresData from '../data/features.json'
import type { FeaturesData } from '../types'

const features = featuresData as FeaturesData

export default function Features() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Features</h1>
        <p className="text-gray-400">Key capabilities organized by domain</p>
      </div>

      <div className="space-y-10">
        {features.categories.map((category, ci) => (
          <div key={ci}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                {category.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1 ml-4">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-4">
              {category.features.map(feature => (
                <FeatureCard key={feature.slug} feature={feature} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
