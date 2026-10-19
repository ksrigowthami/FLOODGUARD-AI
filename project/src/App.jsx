import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import Prediction from './pages/Prediction'
import RiskMap from './pages/RiskMap'
import Alerts from './pages/Alerts'
import Historical from './pages/Historical'
import Emergency from './pages/Emergency'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/risk-map" element={<RiskMap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/historical" element={<Historical />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
