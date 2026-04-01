import { statusLabel, statusColor } from '../utils/scores'
import type { MetricStatus } from '../types'

export default function StatusBadge({ status }: { status: MetricStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(status)}`}>
      {statusLabel(status)}
    </span>
  )
}
