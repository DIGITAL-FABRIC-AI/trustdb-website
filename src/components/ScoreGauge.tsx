import { scoreRing, scoreTrack, scoreColor, formatScore } from '../utils/scores'

interface ScoreGaugeProps {
  score: number | null
  size?: number
  strokeWidth?: number
  label?: string
}

export default function ScoreGauge({ score, size = 120, strokeWidth = 8, label }: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = score !== null ? (score / 10) * circumference : 0
  const offset = circumference - progress

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={scoreTrack()}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${scoreRing(score)} transition-all duration-700`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className={`text-2xl font-bold ${scoreColor(score)}`}>
          {formatScore(score)}
        </span>
        {label && <span className="text-xs text-gray-500 mt-0.5">{label}</span>}
      </div>
    </div>
  )
}
