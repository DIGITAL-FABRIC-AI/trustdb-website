import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { HistoryEntry } from '../types'

export default function HistoryChart({ history }: { history: HistoryEntry[] }) {
  if (history.length < 2) return null

  const data = history.map(h => ({
    date: h.date,
    value: h.value,
    note: h.note,
  }))

  return (
    <div className="h-40 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '12px',
            }}
            formatter={(value, _name, props) => {
              const note = (props as { payload?: { note?: string } })?.payload?.note || '';
              return [`${value} — ${note}`, 'Value'];
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
