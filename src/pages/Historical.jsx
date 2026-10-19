import { motion } from 'framer-motion'
import { History, TrendingUp, Waves, CloudRain } from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { historicalFloods, historicalMonthly } from '../data/mockData'

const chartTooltipStyle = {
  backgroundColor: '#111C2E',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

export default function Historical() {
  const totalRain = historicalFloods.reduce((s, d) => s + d.rainfall, 0)
  const totalFloodDays = historicalFloods.reduce((s, d) => s + d.floodDays, 0)
  const totalAffected = historicalFloods.reduce((s, d) => s + d.affected, 0)
  const avgRain = (totalRain / historicalFloods.length).toFixed(0)

  return (
    <div className="space-y-6">
      <PageHeader title="Historical Data" subtitle="Flood records and rainfall trends (2018-2025)" icon={History} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Annual Rainfall" value={avgRain} unit="mm" icon={CloudRain} delay={0} />
        <StatCard title="Total Flood Days" value={totalFloodDays} unit="days" icon={Waves} delay={0.05} />
        <StatCard title="Total Affected" value={(totalAffected / 1000).toFixed(0)} unit="K people" icon={TrendingUp} delay={0.1} />
        <StatCard title="Years Recorded" value={historicalFloods.length} unit="years" icon={History} delay={0.15} />
      </div>

      {/* Annual Rainfall + Flood Days */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Annual Rainfall vs Flood Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historicalFloods}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar yAxisId="left" dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
            <Bar yAxisId="right" dataKey="floodDays" fill="#f97316" radius={[4, 4, 0, 0]} name="Flood Days" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Affected Population */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">People Affected by Floods (Yearly)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={historicalFloods}>
            <defs>
              <linearGradient id="affectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey="affected" stroke="#ef4444" strokeWidth={2} fill="url(#affectedGrad)" name="Affected People" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Monthly Rainfall + Water Level */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Monthly Rainfall & Water Levels (Monsoon 2025)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={historicalMonthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line yAxisId="left" type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Rainfall (mm)" />
            <Line yAxisId="right" type="monotone" dataKey="waterLevel" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Water Level (m)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Flood Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Flood Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 font-medium text-right">Rainfall (mm)</th>
                <th className="pb-3 font-medium text-right">Flood Days</th>
                <th className="pb-3 font-medium text-right">Affected</th>
                <th className="pb-3 font-medium text-center">Severity</th>
              </tr>
            </thead>
            <tbody>
              {historicalFloods.map((f) => (
                <tr key={f.year} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium text-slate-200">{f.year}</td>
                  <td className="py-3 text-right text-slate-300">{f.rainfall}</td>
                  <td className="py-3 text-right text-slate-300">{f.floodDays}</td>
                  <td className="py-3 text-right text-slate-300">{f.affected.toLocaleString()}</td>
                  <td className="py-3 text-center">
                    <span className={`badge ${
                      f.severity === 'critical' ? 'bg-risk-critical/15 text-risk-critical' :
                      f.severity === 'high' ? 'bg-risk-high/15 text-risk-high' :
                      f.severity === 'moderate' ? 'bg-risk-moderate/15 text-risk-moderate' :
                      'bg-risk-low/15 text-risk-low'
                    }`}>
                      {f.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
