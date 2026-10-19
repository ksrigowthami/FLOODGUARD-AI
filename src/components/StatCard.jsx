import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const riskColors = {
  low: 'text-risk-low bg-risk-low/10',
  moderate: 'text-risk-moderate bg-risk-moderate/10',
  high: 'text-risk-high bg-risk-high/10',
  critical: 'text-risk-critical bg-risk-critical/10',
}

export default function StatCard({ title, value, unit, icon: Icon, change, trend, risk, delay = 0 }) {
  const trendColor = trend === 'up' ? 'text-risk-high' : 'text-risk-low'
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card card-hover p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${risk ? riskColors[risk] : 'bg-accent/10 text-accent'}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{change}{unit === 'mm' ? 'mm' : unit === 'm' ? 'm' : ''}</span>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
      </div>
    </motion.div>
  )
}
