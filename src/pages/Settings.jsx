import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Globe, Shield, Cpu, Database, Moon, Save } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../i18n/LanguageContext'
import { languages } from '../i18n/translations'

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-accent' : 'bg-bg-input'}`}
    >
      <motion.span
        layout
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        style={{ left: on ? '22px' : '2px' }}
      />
    </button>
  )
}

function SettingRow({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { t, lang, changeLang } = useLanguage()
  const [settings, setSettings] = useState({
    alertSound: true,
    pushNotif: true,
    emailNotif: false,
    autoRefresh: true,
    darkMode: true,
    riskThreshold: true,
    aiPredictions: true,
    dataSharing: false,
  })

  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }))

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title={t('settings')} subtitle={t('settingsSubtitle')} icon={SettingsIcon}>
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          {t('saveChanges')}
        </button>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent" />
          {t('language')}
        </h3>
        <SettingRow icon={Globe} title={t('language')} desc={t('languageDesc')}>
          <div className="flex gap-1 bg-bg-input rounded-lg p-1">
            {Object.values(languages).map((l) => (
              <button
                key={l.code}
                onClick={() => changeLang(l.code)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  lang === l.code ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l.nativeName}
              </button>
            ))}
          </div>
        </SettingRow>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" />
          {t('notifications')}
        </h3>
        <SettingRow icon={Bell} title={t('alertSounds')} desc={t('alertSoundsDesc')}>
          <Toggle on={settings.alertSound} onChange={() => toggle('alertSound')} />
        </SettingRow>
        <SettingRow icon={Bell} title={t('pushNotifications')} desc={t('pushNotifDesc')}>
          <Toggle on={settings.pushNotif} onChange={() => toggle('pushNotif')} />
        </SettingRow>
        <SettingRow icon={Bell} title={t('emailNotifications')} desc={t('emailNotifDesc')}>
          <Toggle on={settings.emailNotif} onChange={() => toggle('emailNotif')} />
        </SettingRow>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent" />
          {t('aiPredictions')}
        </h3>
        <SettingRow icon={Cpu} title={t('aiPredictions')} desc={t('aiPredictionsDesc')}>
          <Toggle on={settings.aiPredictions} onChange={() => toggle('aiPredictions')} />
        </SettingRow>
        <SettingRow icon={Shield} title={t('riskThresholdAlerts')} desc={t('riskThresholdDesc')}>
          <Toggle on={settings.riskThreshold} onChange={() => toggle('riskThreshold')} />
        </SettingRow>
        <SettingRow icon={Database} title={t('autoRefreshData')} desc={t('autoRefreshDesc')}>
          <Toggle on={settings.autoRefresh} onChange={() => toggle('autoRefresh')} />
        </SettingRow>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent" />
          {t('preferences')}
        </h3>
        <SettingRow icon={Moon} title={t('darkMode')} desc={t('darkModeDesc')}>
          <Toggle on={settings.darkMode} onChange={() => toggle('darkMode')} />
        </SettingRow>
        <SettingRow icon={Shield} title={t('anonymousDataSharing')} desc={t('dataSharingDesc')}>
          <Toggle on={settings.dataSharing} onChange={() => toggle('dataSharing')} />
        </SettingRow>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-3">{t('systemInfo')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-bg-input/50">
            <p className="text-xs text-slate-500">{t('modelVersion')}</p>
            <p className="font-medium text-slate-200 mt-1">FloodNet-v3.2</p>
          </div>
          <div className="p-3 rounded-lg bg-bg-input/50">
            <p className="text-xs text-slate-500">{t('apiStatus')}</p>
            <p className="font-medium text-success mt-1">{t('connected')}</p>
          </div>
          <div className="p-3 rounded-lg bg-bg-input/50">
            <p className="text-xs text-slate-500">{t('lastSync')}</p>
            <p className="font-medium text-slate-200 mt-1">{t('justNow')}</p>
          </div>
          <div className="p-3 rounded-lg bg-bg-input/50">
            <p className="text-xs text-slate-500">{t('region')}</p>
            <p className="font-medium text-slate-200 mt-1">{t('northIndia')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
