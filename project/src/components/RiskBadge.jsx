const riskConfig = {
  low: { label: 'Low', bg: 'bg-risk-low/15', text: 'text-risk-low', dot: 'bg-risk-low' },
  moderate: { label: 'Moderate', bg: 'bg-risk-moderate/15', text: 'text-risk-moderate', dot: 'bg-risk-moderate' },
  high: { label: 'High', bg: 'bg-risk-high/15', text: 'text-risk-high', dot: 'bg-risk-high' },
  critical: { label: 'Critical', bg: 'bg-risk-critical/15', text: 'text-risk-critical', dot: 'bg-risk-critical' },
}

export default function RiskBadge({ level, size = 'sm' }) {
  const config = riskConfig[level] || riskConfig.low
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
