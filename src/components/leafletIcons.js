import L from 'leaflet'

// Fix Leaflet default marker icons which break with bundlers
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const riskIconColors = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

export function createRiskIcon(risk) {
  const color = riskIconColors[risk] || '#3b82f6'
  return L.divIcon({
    className: 'custom-risk-marker',
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    "><div style="
      width: 8px; height: 8px; background: rgba(255,255,255,0.9); border-radius: 50%; transform: rotate(45deg);
    "></div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
  })
}

export { riskIconColors }
