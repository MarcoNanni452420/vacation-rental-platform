"use client"

import Link from "next/link"
import { Home, Mail, Phone, MapPin } from "lucide-react"
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">{t('brandName')}</span>
            </div>
            <p className="text-gray-300 mb-4">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-300 hover:text-primary">
                {t('privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-primary">
                {t('termsOfService')}
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-primary">
                  {t('allProperties')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-primary">
                  {t('hostDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('contacts')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-300">{t('email')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300">{t('phone')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-300">{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}