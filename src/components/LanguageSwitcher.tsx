"use client"

import { useState, useEffect, useRef } from 'react'
import { Globe } from 'lucide-react'
import { ItalyFlag } from '@/components/ui/flags/ItalyFlag'
import { USFlag } from '@/components/ui/flags/USFlag'
import { FranceFlag } from '@/components/ui/flags/FranceFlag'
import { GermanyFlag } from '@/components/ui/flags/GermanyFlag'
import { SpainFlag } from '@/components/ui/flags/SpainFlag'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  needsDarkText?: boolean;
}

const languages = [
  { code: 'it', name: 'IT', flag: ItalyFlag },
  { code: 'en', name: 'EN', flag: USFlag },
  { code: 'fr', name: 'FR', flag: FranceFlag },
  { code: 'de', name: 'DE', flag: GermanyFlag },
  { code: 'es', name: 'ES', flag: SpainFlag },
];

export function LanguageSwitcher({ needsDarkText = false }: LanguageSwitcherProps) {
  const [locale, setLocale] = useState('en') // Default to 'en' for SSR
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fix hydration by only reading cookie after mount
  useEffect(() => {
    setMounted(true)
    // Check for any of the supported locales in cookies
    const cookieLocale = document.cookie.match(/locale=([^;]+)/)?.[1] || 'en'
    const supportedLocale = languages.find(lang => lang.code === cookieLocale)?.code || 'en'
    setLocale(supportedLocale)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for custom event to close this dropdown when others open
  useEffect(() => {
    const handleCloseDropdown = () => {
      setIsOpen(false)
    }

    window.addEventListener('closeLanguageDropdown', handleCloseDropdown)
    return () => window.removeEventListener('closeLanguageDropdown', handleCloseDropdown)
  }, [])

  const handleToggle = () => {
    if (!isOpen) {
      // Dispatch event to close other dropdowns
      window.dispatchEvent(new CustomEvent('closeBookingDropdown'))
    }
    setIsOpen(!isOpen)
  }

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false)
    
    // Set cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
    setLocale(newLocale)
    // Reload page to apply new locale
    window.location.reload()
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-4 h-4" />
          EN
        </button>
      </div>
    )
  }

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[1]; // fallback to EN
  const otherLanguages = languages.filter(lang => lang.code !== locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-colors",
          needsDarkText 
            ? "text-black hover:text-black/80" 
            : "text-white hover:text-white/80"
        )}
      >
        <currentLanguage.flag className="w-4 h-4" />
        {currentLanguage.name}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-[-10px] md:right-[-10px] md:left-auto left-0 mt-0 bg-background border border-border min-w-[80px] overflow-hidden transition-opacity duration-200 z-50 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {otherLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm uppercase tracking-wider transition-colors hover:bg-muted"
            >
              <language.flag className="w-4 h-4" />
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}