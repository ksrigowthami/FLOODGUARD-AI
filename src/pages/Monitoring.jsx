import { motion } from 'framer-motion'
import { Activity, CloudRain, Waves, Radio, MapPin } from 'lucide-react'
import {
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
import { useLanguage } from '../i18n/LanguageContext'
import { monitoringStations, rainfallData, waterLevelData } from '../data/mockData'

const chartTooltipStyle = {
  backgroundColor: '#111C2E',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

export default function Monitoring() {
  const { t } = useLanguage()
  const totalRain = rainfallData.reduce((s, d) => s + d.rainfall, 0)
  const avgWater = (waterLevelData.reduce((s, d) => s + d.level, 0) / waterLevelData.length).toFixed(1)
  const onlineCount = monitoringStations.filter((s) => s.status === 'online').length

  const statusConfig = {
    online: { label: t('online'), color: 'text-success', bg: 'bg-success/10', dot: 'bg-success' },
    warning: { label: t('moderate'), color: 'text-risk-moderate', bg: 'bg-risk-moderate/10', dot: 'bg-risk-moderate' },
    offline: { label: t('critical'), color: 'text-risk-critical', bg: 'bg-risk-critical/10', dot: 'bg-risk-critical' },
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('monitoring')} subtitle={t('monitoringSubtitle')} icon={Activity} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('totalRainfall24h')} value={totalRain.toFixed(1)} unit="mm" icon={CloudRain} delay={0} />
        <StatCard title={t('avgWaterLevel')} value={avgWater} unit="m" icon={Waves} delay={0.05} />
        <StatCard title={t('activeStations')} value={`${onlineCount}/${monitoringStations.length}`} icon={Radio} delay={0.1} />
        <StatCard title={t('peakRainfall')} value={Math.max(...rainfallData.map(d => d.rainfall))} unit="mm" icon={Activity} delay={0.15} />
      </div>

      {/* Rainfall Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">{t('hourlyRainfall')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Bar dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t('rainfall')} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Water Level Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">{t('waterLevelDanger')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={waterLevelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name={t('waterLevel')} />
            <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name={t('dangerThreshold')} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stations Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">{t('monitoringStations')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                <th className="pb-3 font-medium">{t('station')}</th>
                <th className="pb-3 font-medium">{t('location')}</th>
                <th className="pb-3 font-medium">{t('status')}</th>
                <th className="pb-3 font-medium text-right">{t('rainfall')}</th>
                <th className="pb-3 font-medium text-right">{t('waterLevel')}</th>
                <th className="pb-3 font-medium text-right">{t('lastUpdate')}</th>
              </tr>
            </thead>
            <tbody>
              {monitoringStations.map((station, i) => {
                const status = statusConfig[station.status]
                return (
                  <motion.tr
                    key={station.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-200">{station.name}</p>
                          <p className="text-xs text-slate-600">{station.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {station.location}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`badge ${status.bg} ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${station.status === 'online' ? 'animate-pulse' : ''}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-300">{station.rainfall} mm</td>
                    <td className="py-3 text-right font-medium text-slate-300">{station.waterLevel} m</td>
                    <td className="py-3 text-right text-xs text-slate-500">{station.lastUpdate}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
