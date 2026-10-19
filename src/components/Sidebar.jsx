import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  Brain,
  Map,
  Bell,
  History,
  Siren,
  Settings,
  ChevronLeft,
} from 'lucide-react'
import Logo from './Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { t } = useLanguage()

  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/monitoring', label: t('monitoring'), icon: Activity },
    { to: '/prediction', label: t('prediction'), icon: Brain },
    { to: '/risk-map', label: t('riskMap'), icon: Map },
    { to: '/alerts', label: t('alerts'), icon: Bell },
    { to: '/historical', label: t('historical'), icon: History },
    { to: '/emergency', label: t('emergency'), icon: Siren },
    { to: '/settings', label: t('settings'), icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-bg-sidebar border-r border-white/5 flex flex-col transition-[width] duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/5">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          {!collapsed && (
            <div className="text-[10px] text-slate-600 text-center">
              <p>FloodGuard AI v1.0</p>
              <p className="mt-0.5">SIH 2026 · PS SIH26071</p>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
