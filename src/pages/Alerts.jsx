import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Filter, Check, AlertCircle, Info, CloudRain, Waves, Radio } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import RiskBadge from '../components/RiskBadge'
import { useLanguage } from '../i18n/LanguageContext'
import { alerts as initialAlerts } from '../data/mockData'

const readFilters = ['all', 'unread', 'read']

const typeIcons = {
  flood: AlertCircle,
  rainfall: CloudRain,
  water: Waves,
  system: Radio,
  weather: CloudRain,
}

const severityBorder = {
  critical: 'border-l-risk-critical',
  high: 'border-l-risk-high',
  moderate: 'border-l-risk-moderate',
  low: 'border-l-risk-low',
}

export default function Alerts() {
  const { t } = useLanguage()
  const [alertList, setAlertList] = useState(initialAlerts)
  const [severityFilter, setSeverityFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')

  const severityFilters = ['all', 'critical', 'high', 'moderate', 'low']

  const filteredAlerts = useMemo(() => {
    return alertList.filter((a) => {
      const sevMatch = severityFilter === 'all' || a.severity === severityFilter
      const readMatch = readFilter === 'all' || (readFilter === 'unread' && !a.read) || (readFilter === 'read' && a.read)
      return sevMatch && readMatch
    })
  }, [alertList, severityFilter, readFilter])

  const markRead = (id) => {
    setAlertList((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  const markAllRead = () => {
    setAlertList((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  const unreadCount = alertList.filter((a) => !a.read).length

  return (
    <div className="space-y-6">
      <PageHeader title={t('alerts')} subtitle={`${unreadCount} ${t('unreadAlerts')} · ${alertList.length} ${t('total')}`} icon={Bell}>
        <button onClick={markAllRead} className="btn-ghost text-xs">
          <Check className="w-4 h-4" />
          {t('markAllRead')}
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-400">{t('severity')}:</span>
        </div>
        <div className="flex gap-1 bg-bg-input rounded-lg p-1 overflow-x-auto">
          {severityFilters.map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap ${
                severityFilter === s ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'all' ? t('all') : s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-bg-input rounded-lg p-1">
          {readFilters.map((r) => (
            <button
              key={r}
              onClick={() => setReadFilter(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                readFilter === r ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'all' ? t('all') : r === 'unread' ? t('unread') : t('read')}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map((alert, i) => {
            const Icon = typeIcons[alert.type] || Info
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className={`card p-4 border-l-4 ${severityBorder[alert.severity]} ${!alert.read ? 'bg-bg-card' : 'bg-bg-card/60'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                    alert.severity === 'critical' ? 'bg-risk-critical/10 text-risk-critical' :
                    alert.severity === 'high' ? 'bg-risk-high/10 text-risk-high' :
                    alert.severity === 'moderate' ? 'bg-risk-moderate/10 text-risk-moderate' :
                    'bg-risk-low/10 text-risk-low'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {!alert.read && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                          <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400">{alert.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>{new Date(alert.time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          <span>·</span>
                          <span>{alert.zone}</span>
                          <span>·</span>
                          <span className="uppercase">{alert.type}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <RiskBadge level={alert.severity} />
                        {!alert.read && (
                          <button
                            onClick={() => markRead(alert.id)}
                            className="text-xs text-accent hover:underline flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            {t('markRead')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filteredAlerts.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{t('noAlertsMatch')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
