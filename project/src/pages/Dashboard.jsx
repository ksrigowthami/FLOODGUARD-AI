import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CloudRain,
  Waves,
  AlertTriangle,
  MapPin,
  Cpu,
  Activity,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import RiskBadge from '../components/RiskBadge'
import EmergencySOS from '../components/EmergencySOS'
import { useLanguage } from '../i18n/LanguageContext'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { riskZones, aiStatus, dashboardStats, weatherData, alerts, prediction24h, prediction48h, prediction72h, rainfallData } from '../data/mockData'

const chartTooltipStyle = {
  backgroundColor: '#111C2E',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

export default function Dashboard() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('24h')
  const [time, setTime] = useState(new Date())

  const predictionTabs = [
    { key: '24h', label: t('hours24'), data: prediction24h },
    { key: '48h', label: t('hours48'), data: prediction48h },
    { key: '72h', label: t('hours72'), data: prediction72h },
  ]

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeData = predictionTabs.find((tab) => tab.key === activeTab).data
  const recentAlerts = alerts.slice(0, 4)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard')}
        subtitle={`${t('dashboardSubtitle')} · ${time.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`}
        icon={LayoutDashboard}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-success">{t('systemOnline')}</span>
        </div>
      </PageHeader>

      <EmergencySOS />

      {/* AI Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent-dark/10 border border-accent/20">
            <Cpu className="w-6 h-6 text-accent" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-bg-card animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{aiStatus.model}</h3>
              <span className="badge bg-success/10 text-success">{t('online')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('accuracy')} {aiStatus.accuracy}% · {t('confidence')} {aiStatus.confidence}% · {aiStatus.predictionsToday} {t('predictionsToday')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-slate-500">{t('lastTrained')}</p>
            <p className="text-sm font-medium text-slate-300">Aug 28, 2026</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">{t('uptime')}</p>
            <p className="text-sm font-medium text-success">99.8%</p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('rainfall24h')} value={dashboardStats.rainfall.value} unit="mm" icon={CloudRain} change={dashboardStats.rainfall.change} trend="up" delay={0} />
        <StatCard title={t('waterLevel')} value={dashboardStats.waterLevel.value} unit="m" icon={Waves} change={dashboardStats.waterLevel.change} trend="up" delay={0.05} />
        <StatCard title={t('riskLevel')} value={dashboardStats.riskLevel.value} unit="%" icon={AlertTriangle} risk="high" delay={0.1} />
        <StatCard title={t('affectedZones')} value={dashboardStats.affectedAreas.value} unit={t('zones')} icon={MapPin} change={dashboardStats.affectedAreas.change} trend="up" delay={0.15} />
      </div>

      {/* Map + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">{t('liveRiskMap')}</h3>
            <span className="text-xs text-slate-500">{riskZones.length} {t('zonesMonitored')}</span>
          </div>
          <MapContainer center={[26.82, 80.95]} zoom={11} style={{ height: '320px', borderRadius: '0.75rem' }} scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            {riskZones.map((zone) => {
              const colors = { low: '#22c55e', moderate: '#eab308', high: '#f97316', critical: '#ef4444' }
              return (
                <CircleMarker
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={zone.risk === 'critical' ? 14 : zone.risk === 'high' ? 11 : 8}
                  pathOptions={{ color: colors[zone.risk], fillColor: colors[zone.risk], fillOpacity: 0.6, weight: 2 }}
                >
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold text-sm mb-1">{zone.name}</p>
                      <p>{t('risk')}: <span className="font-medium capitalize">{zone.risk}</span></p>
                      <p>{t('waterLevel')}: {zone.waterLevel}m</p>
                      <p>{t('rainfall')}: {zone.rainfall}mm</p>
                      <p>Population: {zone.population.toLocaleString()}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-5 flex flex-col"
        >
          <h3 className="text-sm font-semibold text-white mb-4">{t('weather')}</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10">
              <CloudRain className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{weatherData.temp}°C</p>
              <p className="text-sm text-slate-400">{weatherData.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-bg-input rounded-lg p-3">
              <p className="text-xs text-slate-500">{t('humidity')}</p>
              <p className="text-sm font-semibold text-white">{weatherData.humidity}%</p>
            </div>
            <div className="bg-bg-input rounded-lg p-3">
              <p className="text-xs text-slate-500">{t('wind')}</p>
              <p className="text-sm font-semibold text-white">{weatherData.windSpeed} km/h</p>
            </div>
            <div className="bg-bg-input rounded-lg p-3">
              <p className="text-xs text-slate-500">{t('pressure')}</p>
              <p className="text-sm font-semibold text-white">{weatherData.pressure} hPa</p>
            </div>
            <div className="bg-bg-input rounded-lg p-3">
              <p className="text-xs text-slate-500">{t('visibility')}</p>
              <p className="text-sm font-semibold text-white">{weatherData.visibility} km</p>
            </div>
          </div>
          <div className="space-y-2 mt-auto">
            {weatherData.forecast.slice(0, 3).map((f) => (
              <div key={f.day} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{f.day}</span>
                <span className="text-slate-300">{f.temp}°C</span>
                <span className="text-slate-500">{f.condition}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Prediction Charts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-white">{t('aiRainfallPredictions')}</h3>
          <div className="flex gap-1 bg-bg-input rounded-lg p-1">
            {predictionTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.key ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={activeData}>
            <defs>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} fill="url(#predGrad)" name={t('predicted')} />
            {activeTab === '24h' && (
              <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={false} name={t('actual')} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Alerts + Rainfall Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">{t('recentAlerts')}</h3>
            <a href="#/alerts" className="text-xs text-accent hover:underline">{t('viewAll')}</a>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-bg-input/50 hover:bg-bg-input transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-risk-critical' : alert.severity === 'high' ? 'bg-risk-high' : alert.severity === 'moderate' ? 'bg-risk-moderate' : 'bg-risk-low'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(alert.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {alert.zone}</p>
                </div>
                <RiskBadge level={alert.severity} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="card p-4"
        >
          <h3 className="text-sm font-semibold text-white mb-4">{t('rainfallLast24h')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={rainfallData}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="rainfall" stroke="#22c55e" strokeWidth={2} fill="url(#rainGrad)" name={t('rainfall')} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
