import { Menu, Search, Bell, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar({ onMenuClick, alertCount = 0 }) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-64 bg-bg-input border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelector compact />
        <Link to="/alerts" className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-risk-critical text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </Link>
        <Link to="/settings" className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium hidden sm:block">{t('admin')}</span>
        </Link>
      </div>
    </header>
  )
}
