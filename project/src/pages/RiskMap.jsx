import { useState, useMemo } from 'react'
import { Map as MapIcon, Search, Maximize2, Layers, MapPin } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import RiskBadge from '../components/RiskBadge'
import { useLanguage } from '../i18n/LanguageContext'
import { createRiskIcon, riskIconColors } from '../components/leafletIcons'
import { riskZones } from '../data/mockData'

const tileLayers = {
  dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; OpenStreetMap &copy; CARTO' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' },
  terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenTopoMap' },
}

const riskFilters = ['all', 'low', 'moderate', 'high', 'critical']

function FullscreenControl({ mapRef }) {
  const map = useMap()
  return null
}

export default function RiskMap() {
  const { t } = useLanguage()
  const [tileLayer, setTileLayer] = useState('dark')
  const [riskFilter, setRiskFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showLegend, setShowLegend] = useState(true)
  const [mapRef, setMapRef] = useState(null)

  const filteredZones = useMemo(() => {
    return riskZones.filter((z) => {
      const riskMatch = riskFilter === 'all' || z.risk === riskFilter
      const searchMatch = z.name.toLowerCase().includes(search.toLowerCase())
      return riskMatch && searchMatch
    })
  }, [riskFilter, search])

  const handleFullscreen = () => {
    if (mapRef) {
      const container = mapRef.getContainer()
      if (!document.fullscreenElement) {
        container.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
    }
  }

  const focusZone = (zone) => {
    if (mapRef) {
      mapRef.flyTo([zone.lat, zone.lng], 13, { duration: 1 })
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title={t('riskMap')} subtitle={t('riskMapSubtitle')} icon={MapIcon} />

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={t('searchZones')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-1 bg-bg-input rounded-lg p-1 overflow-x-auto">
          {riskFilters.map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap ${
                riskFilter === r ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'all' ? t('all') : r}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 card p-2 relative">
          <MapContainer
            center={[26.82, 80.95]}
            zoom={11}
            style={{ height: '500px', borderRadius: '0.75rem' }}
            ref={setMapRef}
          >
            <TileLayer key={tileLayer} url={tileLayers[tileLayer].url} attribution={tileLayers[tileLayer].attribution} />
            {filteredZones.map((zone) => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={createRiskIcon(zone.risk)}>
                <Popup>
                  <div className="text-xs min-w-[160px]">
                    <p className="font-bold text-sm mb-2">{zone.name}</p>
                    <div className="space-y-1">
                      <p>{t('risk')}: <span className="font-medium capitalize">{zone.risk}</span></p>
                      <p>{t('waterLevel')}: {zone.waterLevel}m</p>
                      <p>{t('rainfall')}: {zone.rainfall}mm</p>
                      <p>Population: {zone.population.toLocaleString()}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Layer Toggle */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1">
            <div className="bg-bg-card/90 backdrop-blur-md rounded-lg p-1 border border-white/10">
              {Object.keys(tileLayers).map((key) => (
                <button
                  key={key}
                  onClick={() => setTileLayer(key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium capitalize transition-all w-full text-left ${
                    tileLayer === key ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {key}
                </button>
              ))}
            </div>
            <button
              onClick={handleFullscreen}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-bg-card/90 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              {t('fullscreen')}
            </button>
          </div>

          {/* Legend */}
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 z-[1000] bg-bg-card/90 backdrop-blur-md rounded-lg p-3 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">{t('riskLegend')}</span>
                <button onClick={() => setShowLegend(false)} className="text-slate-500 hover:text-white text-xs">
                  {t('hide')}
                </button>
              </div>
              <div className="space-y-1.5">
                {Object.entries(riskIconColors).map(([level, color]) => (
                  <div key={level} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                    <span className="text-xs text-slate-300 capitalize">{level}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {!showLegend && (
            <button
              onClick={() => setShowLegend(true)}
              className="absolute bottom-4 left-4 z-[1000] bg-bg-card/90 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10 text-xs text-slate-400 hover:text-white"
            >
              {t('showLegend')}
            </button>
          )}
        </div>

        {/* Zone List */}
        <div className="card p-3 max-h-[500px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-3 sticky top-0 bg-bg-card pb-2">
            {t('riskMap')} ({filteredZones.length})
          </h3>
          <div className="space-y-2">
            {filteredZones.map((zone, i) => (
              <motion.button
                key={zone.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => focusZone(zone)}
                className="w-full text-left p-3 rounded-lg bg-bg-input/50 hover:bg-bg-input transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-200">{zone.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <RiskBadge level={zone.risk} />
                  <span className="text-xs text-slate-500">{zone.waterLevel}m · {zone.rainfall}mm</span>
                </div>
              </motion.button>
            ))}
            {filteredZones.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500">{t('noAlertsMatch')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
