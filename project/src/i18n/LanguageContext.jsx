import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { t } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('floodguard-lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('floodguard-lang', lang)
  }, [lang])

  const changeLang = useCallback((code) => {
    setLang(code)
  }, [])

  const tr = useCallback((key) => {
    return (t[lang] && t[lang][key]) || t.en[key] || key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t: tr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return { lang: 'en', changeLang: () => {}, t: (k) => k }
  }
  return ctx
}
