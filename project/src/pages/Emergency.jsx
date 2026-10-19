import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Siren, Phone, Shield, Flame, Truck, MapPin, X, Send, Home, Heart } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { emergencyContacts, shelters, hospitals } from '../data/mockData'

const iconMap = { shield: Shield, flame: Flame, truck: Truck, phone: Phone }

export default function Emergency() {
  const [sosOpen, setSosOpen] = useState(false)
  const [sosSent, setSosSent] = useState(false)
  const [sosForm, setSosForm] = useState({ name: '', location: '', people: '1', urgency: 'critical' })

  const handleSOS = (e) => {
    e.preventDefault()
    setSosSent(true)
    setTimeout(() => {
      setSosSent(false)
      setSosOpen(false)
    }, 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency" subtitle="SOS, emergency contacts, shelters & hospitals" icon={Siren} />

      {/* SOS Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 flex flex-col items-center text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSosOpen(true)}
          className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-risk-critical to-red-700 shadow-2xl shadow-risk-critical/30"
        >
          <span className="absolute inset-0 rounded-full bg-risk-critical/30 animate-ping" />
          <div className="relative z-10 flex flex-col items-center">
            <Siren className="w-10 h-10 text-white" />
            <span className="text-lg font-bold text-white mt-1">SOS</span>
          </div>
        </motion.button>
        <p className="text-sm text-slate-400 mt-4 max-w-xs">
          Press to send an emergency distress signal with your location to rescue services
        </p>
      </motion.div>

      {/* Emergency Contacts */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Emergency Contacts</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, i) => {
            const Icon = iconMap[contact.icon] || Phone
            return (
              <motion.a
                key={contact.name}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="card card-hover p-4 flex flex-col items-center text-center group"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${contact.color}15`, color: contact.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">{contact.name}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: contact.color }}>{contact.number}</p>
                <p className="text-xs text-slate-500 mt-1">Tap to call</p>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Shelters & Hospitals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shelters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-white">Relief Shelters</h3>
          </div>
          <div className="space-y-3">
            {shelters.map((shelter) => {
              const pct = Math.round((shelter.occupied / shelter.capacity) * 100)
              return (
                <div key={shelter.id} className="p-3 rounded-lg bg-bg-input/50 hover:bg-bg-input transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{shelter.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">{shelter.address} · {shelter.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-bg-input rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: pct > 80 ? '#ef4444' : pct > 50 ? '#f97316' : '#22c55e' }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                      {shelter.occupied}/{shelter.capacity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Hospitals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-risk-critical" />
            <h3 className="text-sm font-semibold text-white">Hospitals</h3>
          </div>
          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="p-3 rounded-lg bg-bg-input/50 hover:bg-bg-input transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{hospital.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{hospital.address} · {hospital.distance}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Beds Available</p>
                    <p className={`text-lg font-bold ${hospital.available < 25 ? 'text-risk-high' : 'text-success'}`}>
                      {hospital.available}
                    </p>
                    <p className="text-[10px] text-slate-600">of {hospital.beds}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SOS Modal */}
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
                  <h3 className="text-lg font-bold text-white">SOS Signal Sent</h3>
                  <p className="text-sm text-slate-400 mt-2">Rescue services have been notified. Stay where you are — help is on the way.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Siren className="w-5 h-5 text-risk-critical" />
                      <h3 className="text-lg font-bold text-white">Send SOS</h3>
                    </div>
                    <button onClick={() => setSosOpen(false)} className="text-slate-500 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSOS} className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={sosForm.name}
                        onChange={(e) => setSosForm({ ...sosForm, name: e.target.value })}
                        className="input"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">Current Location</label>
                      <input
                        type="text"
                        required
                        value={sosForm.location}
                        onChange={(e) => setSosForm({ ...sosForm, location: e.target.value })}
                        className="input"
                        placeholder="Address or landmark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">People</label>
                        <input
                          type="number"
                          min="1"
                          value={sosForm.people}
                          onChange={(e) => setSosForm({ ...sosForm, people: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">Urgency</label>
                        <select
                          value={sosForm.urgency}
                          onChange={(e) => setSosForm({ ...sosForm, urgency: e.target.value })}
                          className="input"
                        >
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="moderate">Moderate</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn-danger w-full mt-2">
                      <Siren className="w-4 h-4" />
                      Send SOS Signal
                    </button>
                    <p className="text-xs text-slate-500 text-center">This will alert emergency services with your details</p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
