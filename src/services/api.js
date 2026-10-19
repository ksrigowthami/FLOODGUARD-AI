import { supabase } from './supabaseClient'

function mapRiskZone(z) {
  return {
    id: z.id,
    name: z.name,
    lat: parseFloat(z.lat),
    lng: parseFloat(z.lng),
    risk: z.risk,
    population: z.population,
    waterLevel: parseFloat(z.water_level),
    rainfall: parseFloat(z.rainfall),
  }
}

function mapStation(s) {
  return {
    id: s.id,
    name: s.name,
    location: s.location,
    status: s.status,
    rainfall: parseFloat(s.rainfall),
    waterLevel: parseFloat(s.water_level),
    lastUpdate: s.last_update,
  }
}

function mapWeather(w) {
  return {
    temp: parseFloat(w.temp),
    humidity: w.humidity,
    windSpeed: w.wind_speed,
    windDirection: w.wind_direction,
    pressure: w.pressure,
    visibility: parseFloat(w.visibility),
    condition: w.condition,
    icon: w.icon,
    forecast: w.forecast,
  }
}

function mapPrediction(p) {
  return {
    hour: p.hour_label,
    predicted: parseFloat(p.predicted),
    actual: p.actual !== null ? parseFloat(p.actual) : null,
  }
}

function mapAlert(a) {
  return {
    id: a.id,
    title: a.title,
    severity: a.severity,
    zone: a.zone,
    time: a.time,
    message: a.message,
    read: a.read ?? false,
    type: a.type,
  }
}

function mapHistoricalFlood(f) {
  return {
    year: f.year,
    rainfall: f.rainfall,
    floodDays: f.flood_days,
    affected: f.affected,
    severity: f.severity,
  }
}

function mapMonthly(m) {
  return {
    month: m.month,
    rainfall: m.rainfall,
    waterLevel: parseFloat(m.water_level),
  }
}

function mapShelter(s) {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    capacity: s.capacity,
    occupied: s.occupied,
    lat: parseFloat(s.lat),
    lng: parseFloat(s.lng),
    distance: s.distance,
  }
}

function mapHospital(h) {
  return {
    id: h.id,
    name: h.name,
    address: h.address,
    beds: h.beds,
    available: h.available,
    lat: parseFloat(h.lat),
    lng: parseFloat(h.lng),
    distance: h.distance,
  }
}

function mapPredictionModel(d) {
  return {
    riskScore: d.risk_score,
    confidence: parseFloat(d.confidence),
    factors: d.factors,
    timeline: d.timeline,
  }
}

export const rainfallService = {
  async getCurrent() {
    const { data, error } = await supabase
      .from('rainfall_readings')
      .select('*')
      .order('id', { ascending: true })
    if (error) throw error
    return data.map((r) => ({
      time: r.time_label,
      rainfall: parseFloat(r.rainfall),
      cumulative: parseFloat(r.cumulative),
    }))
  },
}

export const floodRiskService = {
  async getZones() {
    const { data, error } = await supabase.from('risk_zones').select('*').order('id')
    if (error) throw error
    return data.map(mapRiskZone)
  },
  async getDashboardStats() {
    const [zones, rainfall, waterLevels] = await Promise.all([
      supabase.from('risk_zones').select('*'),
      supabase.from('rainfall_readings').select('rainfall'),
      supabase.from('water_level_readings').select('level').order('id', { ascending: true }),
    ])
    if (zones.error) throw zones.error
    if (rainfall.error) throw rainfall.error
    if (waterLevels.error) throw waterLevels.error

    const totalRain = rainfall.data.reduce((s, d) => s + parseFloat(d.rainfall), 0)
    const latestWater = waterLevels.data.length > 0 ? parseFloat(waterLevels.data[waterLevels.data.length - 1].level) : 0
    const affectedCount = zones.data.filter((z) => z.risk === 'high' || z.risk === 'critical').length
    const criticalZones = zones.data.filter((z) => z.risk === 'critical').length
    const riskScore = criticalZones > 0 ? 78 : 45

    return {
      rainfall: { value: parseFloat(totalRain.toFixed(1)), unit: 'mm', change: 23.5, trend: 'up' },
      waterLevel: { value: latestWater, unit: 'm', change: 1.2, trend: 'up', threshold: 9.5 },
      riskLevel: { value: riskScore, level: riskScore > 70 ? 'high' : 'moderate', label: riskScore > 70 ? 'High Risk' : 'Moderate Risk' },
      affectedAreas: { value: affectedCount, unit: 'zones', change: 3, trend: 'up' },
    }
  },
}

export const predictionService = {
  async get24h() {
    const { data, error } = await supabase.from('ai_predictions').select('*').eq('horizon', '24h').order('id')
    if (error) throw error
    return data.map(mapPrediction)
  },
  async get48h() {
    const { data, error } = await supabase.from('ai_predictions').select('*').eq('horizon', '48h').order('id')
    if (error) throw error
    return data.map(mapPrediction)
  },
  async get72h() {
    const { data, error } = await supabase.from('ai_predictions').select('*').eq('horizon', '72h').order('id')
    if (error) throw error
    return data.map(mapPrediction)
  },
  async getModelData() {
    const { data, error } = await supabase.from('prediction_model_data').select('*').order('id', { ascending: false }).limit(1).maybeSingle()
    if (error) throw error
    if (!data) return null
    return mapPredictionModel(data)
  },
  async getWaterLevels() {
    const { data, error } = await supabase.from('water_level_readings').select('*').order('id')
    if (error) throw error
    return data.map((r) => ({
      time: r.time_label,
      level: parseFloat(r.level),
      threshold: parseFloat(r.threshold),
    }))
  },
  async getAIStatus() {
    const { data, error } = await supabase.from('ai_model_status').select('*').order('id', { ascending: false }).limit(1).maybeSingle()
    if (error) throw error
    if (!data) return null
    return {
      model: data.model,
      status: data.status,
      accuracy: parseFloat(data.accuracy),
      lastTraining: data.last_training,
      predictionsToday: data.predictions_today,
      confidence: parseFloat(data.confidence),
    }
  },
}

export const alertService = {
  async getAll() {
    const { data: alerts, error } = await supabase.from('alerts').select('*').order('time', { ascending: false })
    if (error) throw error

    const { data: readStates } = await supabase.from('alert_read_states').select('alert_id, is_read')

    const readMap = new Map()
    if (readStates) {
      readStates.forEach((r) => readMap.set(r.alert_id, r.is_read))
    }

    return alerts.map((a) => mapAlert({ ...a, read: readMap.get(a.id) ?? false }))
  },
  async markRead(id) {
    const { data: existing } = await supabase
      .from('alert_read_states')
      .select('id')
      .eq('alert_id', id)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('alert_read_states')
        .update({ is_read: true })
        .eq('alert_id', id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('alert_read_states')
        .insert({ alert_id: id, is_read: true })
      if (error) throw error
    }
    return { success: true, id }
  },
  async markAllRead(alertIds) {
    const inserts = alertIds.map((id) => ({ alert_id: id, is_read: true }))
    const { error: upsertError } = await supabase
      .from('alert_read_states')
      .upsert(inserts, { onConflict: 'alert_id,user_id' })
    if (upsertError) throw upsertError
    return { success: true }
  },
}

export const weatherService = {
  async getCurrent() {
    const { data, error } = await supabase.from('weather_data').select('*').order('id', { ascending: false }).limit(1).maybeSingle()
    if (error) throw error
    if (!data) return null
    return mapWeather(data)
  },
}

export const monitoringService = {
  async getStations() {
    const { data, error } = await supabase.from('monitoring_stations').select('*').order('id')
    if (error) throw error
    return data.map(mapStation)
  },
}

export const historicalService = {
  async getFloods() {
    const { data, error } = await supabase.from('historical_floods').select('*').order('year')
    if (error) throw error
    return data.map(mapHistoricalFlood)
  },
  async getMonthly() {
    const { data, error } = await supabase.from('historical_monthly').select('*').order('id')
    if (error) throw error
    return data.map(mapMonthly)
  },
}

export const emergencyService = {
  async getContacts() {
    const { data, error } = await supabase.from('emergency_contacts').select('*').order('sort_order')
    if (error) throw error
    return data.map((c) => ({ name: c.name, number: c.number, icon: c.icon, color: c.color }))
  },
  async getShelters() {
    const { data, error } = await supabase.from('shelters').select('*').order('id')
    if (error) throw error
    return data.map(mapShelter)
  },
  async getHospitals() {
    const { data, error } = await supabase.from('hospitals').select('*').order('id')
    if (error) throw error
    return data.map(mapHospital)
  },
  async sendSOS(sosData) {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (userId) {
      const { error } = await supabase.from('sos_requests').insert({
        user_id: userId,
        name: sosData.name || null,
        location: sosData.location || null,
        people: sosData.people || 1,
        urgency: sosData.urgency || 'critical',
        lat: sosData.lat || null,
        lng: sosData.lng || null,
      })
      if (error) throw error
    }

    return { success: true, message: 'SOS signal sent successfully', ...sosData }
  },
}

export const settingsService = {
  async get() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return null

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userData.user.id)
      .maybeSingle()
    if (error) throw error
    if (!data) return null

    return {
      alertSound: data.alert_sound,
      pushNotif: data.push_notif,
      emailNotif: data.email_notif,
      autoRefresh: data.auto_refresh,
      darkMode: data.dark_mode,
      riskThreshold: data.risk_threshold,
      aiPredictions: data.ai_predictions,
      dataSharing: data.data_sharing,
      language: data.language,
    }
  },
  async save(settings) {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userData.user.id,
        alert_sound: settings.alertSound,
        push_notif: settings.pushNotif,
        email_notif: settings.emailNotif,
        auto_refresh: settings.autoRefresh,
        dark_mode: settings.darkMode,
        risk_threshold: settings.riskThreshold,
        ai_predictions: settings.aiPredictions,
        data_sharing: settings.dataSharing,
        language: settings.language,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (error) throw error
    return { success: true }
  },
}

export const chatService = {
  async getHistory() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return []

    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, text')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },
  async saveMessage(role, text) {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { error } = await supabase
      .from('chat_messages')
      .insert({ user_id: userData.user.id, role, text })

    if (error) throw error
  },
  async clearHistory() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userData.user.id)

    if (error) throw error
  },
}

export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },
  async signUp(email, password, metadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) throw error
    return data
  },
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  async getUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  },
  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        callback(event, session)
      })()
    })
  },
}
