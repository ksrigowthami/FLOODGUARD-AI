// Centralized mock data for FloodGuard AI
// All data is structured to mirror real API responses

export const aiStatus = {
  model: 'FloodNet-v3.2',
  status: 'online',
  accuracy: 94.2,
  lastTraining: '2026-08-28T14:00:00Z',
  predictionsToday: 127,
  confidence: 91.5,
}

export const dashboardStats = {
  rainfall: { value: 142.7, unit: 'mm', change: 23.5, trend: 'up' },
  waterLevel: { value: 8.3, unit: 'm', change: 1.2, trend: 'up', threshold: 9.5 },
  riskLevel: { value: 78, level: 'high', label: 'High Risk' },
  affectedAreas: { value: 14, unit: 'zones', change: 3, trend: 'up' },
}

export const rainfallData = [
  { time: '00:00', rainfall: 2.1, cumulative: 2.1 },
  { time: '02:00', rainfall: 3.4, cumulative: 5.5 },
  { time: '04:00', rainfall: 5.2, cumulative: 10.7 },
  { time: '06:00', rainfall: 8.7, cumulative: 19.4 },
  { time: '08:00', rainfall: 12.3, cumulative: 31.7 },
  { time: '10:00', rainfall: 15.6, cumulative: 47.3 },
  { time: '12:00', rainfall: 18.2, cumulative: 65.5 },
  { time: '14:00', rainfall: 14.8, cumulative: 80.3 },
  { time: '16:00', rainfall: 11.5, cumulative: 91.8 },
  { time: '18:00', rainfall: 9.3, cumulative: 101.1 },
  { time: '20:00', rainfall: 7.1, cumulative: 108.2 },
  { time: '22:00', rainfall: 4.8, cumulative: 113.0 },
]

export const prediction24h = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  predicted: Math.round((20 + Math.sin(i / 3) * 15 + Math.random() * 10) * 10) / 10,
  actual: i < 12 ? Math.round((18 + Math.sin(i / 3) * 14 + Math.random() * 8) * 10) / 10 : null,
}))

export const prediction48h = Array.from({ length: 48 }, (_, i) => ({
  hour: `${i}h`,
  predicted: Math.round((15 + Math.sin(i / 5) * 20 + Math.random() * 12) * 10) / 10,
  actual: null,
}))

export const prediction72h = Array.from({ length: 72 }, (_, i) => ({
  hour: `${i}h`,
  predicted: Math.round((12 + Math.sin(i / 7) * 18 + Math.random() * 15) * 10) / 10,
  actual: null,
}))

export const waterLevelData = [
  { time: '00:00', level: 5.2, threshold: 9.5 },
  { time: '04:00', level: 5.8, threshold: 9.5 },
  { time: '08:00', level: 6.7, threshold: 9.5 },
  { time: '12:00', level: 7.5, threshold: 9.5 },
  { time: '16:00', level: 8.1, threshold: 9.5 },
  { time: '20:00', level: 8.3, threshold: 9.5 },
  { time: '23:59', level: 8.3, threshold: 9.5 },
]

export const riskDistribution = [
  { name: 'Low', value: 42, color: '#22c55e' },
  { name: 'Moderate', value: 28, color: '#eab308' },
  { name: 'High', value: 18, color: '#f97316' },
  { name: 'Critical', value: 12, color: '#ef4444' },
]

export const weatherData = {
  temp: 28.5,
  humidity: 89,
  windSpeed: 22,
  windDirection: 'SW',
  pressure: 998,
  visibility: 4.5,
  condition: 'Heavy Rain',
  icon: 'rain',
  forecast: [
    { day: 'Today', temp: 28, condition: 'Heavy Rain', icon: 'rain' },
    { day: 'Tomorrow', temp: 26, condition: 'Thunderstorm', icon: 'cloud-lightning' },
    { day: 'Wed', temp: 27, condition: 'Light Rain', icon: 'cloud-rain' },
    { day: 'Thu', temp: 29, condition: 'Cloudy', icon: 'cloud' },
    { day: 'Fri', temp: 30, condition: 'Partly Cloudy', icon: 'cloud-sun' },
  ],
}

export const monitoringStations = [
  { id: 'ST-001', name: 'Riverside North', location: 'Lat 26.85°N, Lon 80.95°E', status: 'online', rainfall: 142.7, waterLevel: 8.3, lastUpdate: '2 min ago' },
  { id: 'ST-002', name: 'City Center Dam', location: 'Lat 26.78°N, Lon 80.92°E', status: 'online', rainfall: 138.2, waterLevel: 7.9, lastUpdate: '1 min ago' },
  { id: 'ST-003', name: 'Floodgate East', location: 'Lat 26.82°N, Lon 81.02°E', status: 'warning', rainfall: 165.3, waterLevel: 9.1, lastUpdate: '3 min ago' },
  { id: 'ST-004', name: 'Highland South', location: 'Lat 26.75°N, Lon 80.88°E', status: 'online', rainfall: 98.5, waterLevel: 5.4, lastUpdate: '1 min ago' },
  { id: 'ST-005', name: 'Valley Bridge', location: 'Lat 26.88°N, Lon 80.98°E', status: 'offline', rainfall: 0, waterLevel: 0, lastUpdate: '45 min ago' },
  { id: 'ST-006', name: 'Lakeside West', location: 'Lat 26.80°N, Lon 80.85°E', status: 'online', rainfall: 112.4, waterLevel: 6.8, lastUpdate: '2 min ago' },
]

export const riskZones = [
  { id: 1, name: 'Riverside North', lat: 26.85, lng: 80.95, risk: 'high', population: 45000, waterLevel: 8.3, rainfall: 142.7 },
  { id: 2, name: 'City Center', lat: 26.78, lng: 80.92, risk: 'moderate', population: 120000, waterLevel: 7.9, rainfall: 138.2 },
  { id: 3, name: 'Floodgate East', lat: 26.82, lng: 81.02, risk: 'critical', population: 32000, waterLevel: 9.1, rainfall: 165.3 },
  { id: 4, name: 'Highland South', lat: 26.75, lng: 80.88, risk: 'low', population: 28000, waterLevel: 5.4, rainfall: 98.5 },
  { id: 5, name: 'Valley Bridge', lat: 26.88, lng: 80.98, risk: 'high', population: 38000, waterLevel: 8.0, rainfall: 155.0 },
  { id: 6, name: 'Lakeside West', lat: 26.80, lng: 80.85, risk: 'moderate', population: 55000, waterLevel: 6.8, rainfall: 112.4 },
  { id: 7, name: 'Industrial Zone', lat: 26.83, lng: 80.90, risk: 'critical', population: 18000, waterLevel: 9.3, rainfall: 170.1 },
  { id: 8, name: 'Greenwood', lat: 26.77, lng: 80.99, risk: 'low', population: 22000, waterLevel: 4.9, rainfall: 85.2 },
]

export const alerts = [
  { id: 'AL-001', title: 'Critical flood warning — Floodgate East', severity: 'critical', zone: 'Floodgate East', time: '2026-09-01T10:30:00Z', message: 'Water level exceeding danger threshold. Immediate evacuation recommended.', read: false, type: 'flood' },
  { id: 'AL-002', title: 'Heavy rainfall alert — Industrial Zone', severity: 'high', zone: 'Industrial Zone', time: '2026-09-01T09:45:00Z', message: '170mm+ rainfall expected in next 6 hours. Risk of severe flooding.', read: false, type: 'rainfall' },
  { id: 'AL-003', title: 'Water level rising — Riverside North', severity: 'high', zone: 'Riverside North', time: '2026-09-01T08:15:00Z', message: 'Water level at 8.3m, approaching 9.5m danger threshold.', read: false, type: 'water' },
  { id: 'AL-004', title: 'Moderate flood risk — City Center', severity: 'moderate', zone: 'City Center', time: '2026-09-01T07:00:00Z', message: 'Moderate flooding risk detected. Stay alert for updates.', read: true, type: 'flood' },
  { id: 'AL-005', title: 'Station offline — Valley Bridge', severity: 'moderate', zone: 'Valley Bridge', time: '2026-08-31T22:30:00Z', message: 'Monitoring station ST-005 has gone offline. Maintenance dispatched.', read: true, type: 'system' },
  { id: 'AL-006', title: 'Low risk — Greenwood area', severity: 'low', zone: 'Greenwood', time: '2026-08-31T18:00:00Z', message: 'All clear. Water levels within normal range.', read: true, type: 'flood' },
  { id: 'AL-007', title: 'Thunderstorm warning — Lakeside West', severity: 'moderate', zone: 'Lakeside West', time: '2026-09-01T11:00:00Z', message: 'Thunderstorms expected. Potential for flash flooding in low-lying areas.', read: false, type: 'weather' },
]

export const historicalFloods = [
  { year: 2018, rainfall: 380, floodDays: 12, affected: 150000, severity: 'high' },
  { year: 2019, rainfall: 290, floodDays: 7, affected: 85000, severity: 'moderate' },
  { year: 2020, rainfall: 420, floodDays: 18, affected: 210000, severity: 'critical' },
  { year: 2021, rainfall: 250, floodDays: 5, affected: 45000, severity: 'moderate' },
  { year: 2022, rainfall: 350, floodDays: 10, affected: 120000, severity: 'high' },
  { year: 2023, rainfall: 410, floodDays: 15, affected: 180000, severity: 'critical' },
  { year: 2024, rainfall: 310, floodDays: 8, affected: 95000, severity: 'moderate' },
  { year: 2025, rainfall: 375, floodDays: 11, affected: 135000, severity: 'high' },
]

export const historicalMonthly = [
  { month: 'Jun', rainfall: 180, waterLevel: 6.5 },
  { month: 'Jul', rainfall: 320, waterLevel: 8.1 },
  { month: 'Aug', rainfall: 410, waterLevel: 9.2 },
  { month: 'Sep', rainfall: 285, waterLevel: 7.3 },
  { month: 'Oct', rainfall: 120, waterLevel: 5.8 },
]

export const emergencyContacts = [
  { name: 'Police', number: '100', icon: 'shield', color: '#3b82f6' },
  { name: 'Fire Brigade', number: '101', icon: 'flame', color: '#f97316' },
  { name: 'Ambulance', number: '108', icon: 'truck', color: '#ef4444' },
  { name: 'Flood Helpline', number: '1070', icon: 'phone', color: '#22c55e' },
]

export const shelters = [
  { id: 1, name: 'Central Community Hall', address: 'MG Road, City Center', capacity: 500, occupied: 312, lat: 26.79, lng: 80.93, distance: '2.1 km' },
  { id: 2, name: 'Government School — Riverside', address: 'Riverside North, Sector 7', capacity: 300, occupied: 180, lat: 26.86, lng: 80.96, distance: '3.5 km' },
  { id: 3, name: 'Highland Sports Complex', address: 'Highland South, Sector 12', capacity: 800, occupied: 245, lat: 26.76, lng: 80.89, distance: '5.2 km' },
  { id: 4, name: 'Lakeside Community Center', address: 'Lakeside West, Sector 3', capacity: 400, occupied: 95, lat: 26.81, lng: 80.86, distance: '4.1 km' },
]

export const hospitals = [
  { id: 1, name: 'City General Hospital', address: 'Civil Lines, City Center', beds: 250, available: 45, lat: 26.78, lng: 80.91, distance: '1.8 km' },
  { id: 2, name: 'Riverside Medical College', address: 'Riverside North, Sector 5', beds: 400, available: 78, lat: 26.85, lng: 80.94, distance: '3.2 km' },
  { id: 3, name: 'Highland Multi-Specialty', address: 'Highland South, Sector 10', beds: 180, available: 22, lat: 26.76, lng: 80.88, distance: '5.5 km' },
  { id: 4, name: 'Lakeside Emergency Care', address: 'Lakeside West, Sector 2', beds: 120, available: 38, lat: 26.81, lng: 80.85, distance: '4.3 km' },
]

export const predictionModelData = {
  riskScore: 78,
  confidence: 91.5,
  factors: [
    { name: 'Rainfall Intensity', weight: 35, value: 82 },
    { name: 'Water Level', weight: 28, value: 87 },
    { name: 'Soil Saturation', weight: 18, value: 65 },
    { name: 'Drainage Capacity', weight: 12, value: 70 },
    { name: 'Wind & Storm', weight: 7, value: 55 },
  ],
  timeline: Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}h`,
    waterLevel: Math.round((6 + i * 0.3 + Math.sin(i) * 0.5) * 10) / 10,
    rainfall: Math.round((15 + Math.sin(i / 2) * 10 + Math.random() * 5) * 10) / 10,
    risk: Math.round(60 + i * 2 + Math.sin(i) * 5),
  })),
}
