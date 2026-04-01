import type { CompetitorApproach } from '../types'

export default function CompetitorTable({ competitors, narrative }: { competitors: CompetitorApproach[]; narrative: string }) {
  if (competitors.length === 0) return null

  return (
    <div>
      {narrative && (
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{narrative}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 pr-4 text-gray-400 font-medium">System</th>
              <th className="text-left py-2 px-4 text-gray-400 font-medium">Approach</th>
              <th className="text-left py-2 pl-4 text-gray-400 font-medium">Limitation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-800/30 bg-blue-950/20">
              <td className="py-2.5 pr-4 text-blue-300 font-medium">TrustDB</td>
              <td className="py-2.5 px-4 text-blue-200" colSpan={2}>Storage-native implementation (see How It Works above)</td>
            </tr>
            {competitors.map((c, i) => (
              <tr key={i} className="border-b border-gray-800/50">
                <td className="py-2.5 pr-4 text-gray-300 font-medium">{c.system}</td>
                <td className="py-2.5 px-4 text-gray-400">{c.approach}</td>
                <td className="py-2.5 pl-4 text-gray-500">{c.limitation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
