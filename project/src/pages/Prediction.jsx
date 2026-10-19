import { motion } from 'framer-motion'
import { Brain, Activity, Waves } from 'lucide-react'
import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import PageHeader from '../components/PageHeader'
import { useLanguage } from '../i18n/LanguageContext'
import { predictionModelData, waterLevelData, riskDistribution } from '../data/mockData'

const chartTooltipStyle = {
  backgroundColor: '#111C2E',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

export default function Prediction() {
  const { t } = useLanguage()
  const gaugeData = [{ name: t('risk'), value: predictionModelData.riskScore, fill: '#f97316' }]

  return (
    <div className="space-y-6">
      <PageHeader title={t('prediction')} subtitle={t('predictionSubtitle')} icon={Brain}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">{t('confidence')} {predictionModelData.confidence}%</span>
        </div>
      </PageHeader>

      {/* Risk Gauge + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex flex-col items-center"
        >
          <h3 className="text-sm font-semibold text-white mb-2">{t('floodRiskScore')}</h3>
          <div className="relative w-full" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={gaugeData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#0D1A2E' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-5xl font-bold text-risk-high"
              >
                {predictionModelData.riskScore}%
              </motion.span>
              <span className="text-sm text-slate-400 mt-1">{t('highRisk')}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full mt-2">
            <div className="text-center">
              <p className="text-xs text-slate-500">{t('low')}</p>
              <p className="text-xs font-medium text-risk-low">0-40</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">{t('moderate')}</p>
              <p className="text-xs font-medium text-risk-moderate">41-70</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">{t('highPlus')}</p>
              <p className="text-xs font-medium text-risk-high">71-100</p>
            </div>
          </div>
        </motion.div>

        {/* Risk Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-2">{t('riskZoneDistribution')}</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-slate-400">{item.name}</span>
                <span className="text-xs font-medium text-slate-300 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Factor Weights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">{t('riskFactorAnalysis')}</h3>
          <div className="space-y-3">
            {predictionModelData.factors.map((factor, i) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{factor.name}</span>
                  <span className="text-xs font-medium text-slate-300">{factor.value}%</span>
                </div>
                <div className="h-2 bg-bg-input rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.value}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{
                      background: factor.value > 80 ? '#ef4444' : factor.value > 65 ? '#f97316' : factor.value > 50 ? '#eab308' : '#22c55e',
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">{t('weight')}: {factor.weight}%</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Water Level Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">{t('waterLevelPrediction')}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Waves className="w-3.5 h-3.5" />
            {t('dangerThreshold')}: 9.5m
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={predictionModelData.timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name={t('waterLevel')} />
            <Line type="monotone" dataKey="rainfall" stroke="#22c55e" strokeWidth={2} dot={false} name={t('rainfall')} />
            <Line type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={2} dot={false} name={t('risk')} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Current Water Levels */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4">{t('currentWaterLevels')}</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={waterLevelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={[0, 12]} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Bar dataKey="level" radius={[4, 4, 0, 0]} name={t('waterLevel')}>
              {waterLevelData.map((entry, i) => (
                <Cell key={i} fill={entry.level >= 9 ? '#ef4444' : entry.level >= 8 ? '#f97316' : entry.level >= 6 ? '#eab308' : '#22c55e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
