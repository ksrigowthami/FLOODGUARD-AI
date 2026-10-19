import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { languages } from '../i18n/translations'
import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageSelector({ compact = false }) {
  const { lang, changeLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = languages[lang] || languages.en

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{compact ? current.code.toUpperCase() : current.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-bg-card border border-white/10 rounded-lg shadow-xl py-1 z-50">
          {Object.values(languages).map((l) => (
            <button
              key={l.code}
              onClick={() => {
                changeLang(l.code)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                lang === l.code ? 'bg-accent/15 text-accent' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
