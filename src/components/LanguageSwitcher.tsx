"use client"

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const [locale, setLocale] = useState('it') // Default to 'it' for SSR
  const [mounted, setMounted] = useState(false)

  // Fix hydration by only reading cookie after mount
  useEffect(() => {
    setMounted(true)
    const currentLocale = document.cookie.includes('locale=en') ? 'en' : 'it'
    setLocale(currentLocale)
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
    setLocale(newLocale)
    // Reload page to apply new locale
    window.location.reload()
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-4 h-4" />
          IT
        </button>
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
        <Globe className="w-4 h-4" />
        {locale.toUpperCase()}
      </button>
      
      <div className="absolute top-full right-0 mt-2 bg-background border border-border min-w-[120px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        <button
          onClick={() => handleLanguageChange('it')}
          className={`block w-full px-4 py-3 text-left text-sm uppercase tracking-wider transition-colors ${
            locale === 'it' 
              ? 'bg-foreground text-background font-medium' 
              : 'hover:bg-muted'
          }`}
        >
          IT
        </button>
        <div className="border-t border-border" />
        <button
          onClick={() => handleLanguageChange('en')}
          className={`block w-full px-4 py-3 text-left text-sm uppercase tracking-wider transition-colors ${
            locale === 'en' 
              ? 'bg-foreground text-background font-medium' 
              : 'hover:bg-muted'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  )
}