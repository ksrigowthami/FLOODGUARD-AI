import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Siren, Phone, MapPin, X, Send, Navigation } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function EmergencySOS() {
  const { t } = useLanguage()
  const [sosOpen, setSosOpen] = useState(false)
  const [sosSent, setSosSent] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('')

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported')
      return
    }
    setLocationStatus('Getting location...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus(`Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
      },
      () => setLocationStatus('Location access denied'),
    )
  }

  const handleSOS = (e) => {
    e.preventDefault()
    setSosSent(true)
    setTimeout(() => {
      setSosSent(false)
      setSosOpen(false)
    }, 2500)
  }

  const shareLocation = () => {
    if (navigator.share && location) {
      navigator.share({
        title: 'Emergency Location',
        text: `I need help. My location: ${location.lat}, ${location.lng}`,
        url: `https://maps.google.com/?q=${location.lat},${location.lng}`,
      }).catch(() => {})
    } else if (location) {
      const url = `https://maps.google.com/?q=${location.lat},${location.lng}`
      navigator.clipboard?.writeText(url)
      setLocationStatus('Location link copied')
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6 border border-risk-critical/20"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSosOpen(true)}
            className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-risk-critical to-red-700 shadow-2xl shadow-risk-critical/30 flex-shrink-0"
          >
            <span className="absolute inset-0 rounded-full bg-risk-critical/30 animate-ping" />
            <div className="relative z-10 flex flex-col items-center">
              <Siren className="w-8 h-8 text-white" />
              <span className="text-sm font-bold text-white mt-1">{t('sos')}</span>
            </div>
          </motion.button>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-base font-bold text-white">{t('emergency')}</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md">{t('sosDescription')}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <a
                href="tel:108"
                className="btn-danger text-xs px-3 py-2"
              >
                <Phone className="w-3.5 h-3.5" />
                {t('emergency')} — 108
              </a>
              <button
                onClick={getLocation}
                className="btn btn-ghost text-xs px-3 py-2 border border-white/10"
              >
                <Navigation className="w-3.5 h-3.5" />
                {location ? t('currentLocation') : 'Get Location'}
              </button>
              {location && (
                <button
                  onClick={shareLocation}
                  className="btn btn-ghost text-xs px-3 py-2 border border-white/10"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Share Location
                </button>
              )}
            </div>
            {locationStatus && (
              <p className="text-xs text-slate-500 mt-2">{locationStatus}</p>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {sosOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !sosSent && setSosOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-md"
            >
              {sosSent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-success/15 mb-4"
                  >
                    <Send className="w-8 h-8 text-success" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">{t('sosSignalSent')}</h3>
                  <p className="text-sm text-slate-400 mt-2">{t('sosSentDesc')}</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Siren className="w-5 h-5 text-risk-critical" />
                      <h3 className="text-lg font-bold text-white">{t('sendSOS')}</h3>
                    </div>
                    <button onClick={() => setSosOpen(false)} className="text-slate-500 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSOS} className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">{t('yourName')}</label>
                      <input type="text" required className="input" placeholder={t('enterName')} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">{t('currentLocation')}</label>
                      <input type="text" required className="input" placeholder={t('addressLandmark')} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">{t('people')}</label>
                        <input type="number" min="1" defaultValue="1" className="input" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">{t('urgency')}</label>
                        <select defaultValue="critical" className="input">
                          <option value="critical">{t('critical')}</option>
                          <option value="high">{t('high')}</option>
                          <option value="moderate">{t('moderate')}</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" onClick={getLocation} className="btn btn-ghost w-full text-xs border border-white/10">
                      <Navigation className="w-3.5 h-3.5" />
                      {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Auto-detect location'}
                    </button>
                    <button type="submit" className="btn-danger w-full mt-2">
                      <Siren className="w-4 h-4" />
                      {t('sendSOSSignal')}
                    </button>
                    <p className="text-xs text-slate-500 text-center">{t('sosAlertNote')}</p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
