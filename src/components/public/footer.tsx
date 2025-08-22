"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Home className="h-6 w-6 text-white" />
            <span className="font-bold text-lg text-white">{t('brandName')}</span>
          </div>
          <Link 
            href="/contact" 
            className="text-gray-300 hover:text-white text-sm mb-4 inline-block transition-colors duration-200"
          >
            {t('contactUs')}
          </Link>
          
          {/* Legal Links */}
          <div className="border-t border-gray-800 mt-4 pt-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
              <a 
                href="https://www.iubenda.com/privacy-policy/35337688" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t('privacyPolicy')}
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="https://www.iubenda.com/privacy-policy/35337688/cookie-policy" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t('cookiePolicy')}
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="https://www.iubenda.com/terms-and-conditions/35337688" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t('termsConditions')}
              </a>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}