"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations } from 'next-intl'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  const t = useTranslations('nav')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: "/property/fienaroli", label: t('fienaroli') },
    { href: "/property/moro", label: t('moro') },
    { href: "/contact", label: t('contact') },
  ]

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-500",
        isScrolled || isHomepage
          ? "bg-white/95" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group">
              <div 
                className={cn(
                  "text-2xl font-bold tracking-tight transition-colors duration-300",
                  isScrolled || isHomepage ? "text-black" : "text-white"
                )}
              >
                Trastevere Luxury Homes
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link 
                  href={link.href} 
                  className="relative group text-sm font-medium tracking-wide uppercase"
                >
                  <span
                    className={cn(
                      "relative z-10 group-hover:opacity-60 transition-all duration-300",
                      isScrolled || isHomepage ? "text-black" : "text-white"
                    )}
                  >
                    {link.label}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              </div>
            ))}
            
            {/* CTA and Language Section */}
            <div className="flex items-center space-x-6 ml-12">
              <LanguageSwitcher />
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium uppercase tracking-wide px-6 py-3 border transition-all duration-300",
                  isScrolled || isHomepage
                    ? "border-black text-black hover:bg-black hover:text-white" 
                    : "border-white text-white hover:bg-white hover:text-black"
                )}
              >
                {t('bookNow')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2 transition-colors duration-300",
                isScrolled || isHomepage ? "text-black" : "text-white"
              )}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md transition-all duration-300 ease-out animate-fade-in">
            <div className="px-6 py-12 space-y-8">
              {navLinks.map((link, index) => (
                <div key={link.href} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Link
                    href={link.href}
                    className="block text-2xl font-medium uppercase tracking-wide text-black hover:opacity-60 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              
              <div className="pt-8 border-t space-y-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between">
                  <LanguageSwitcher />
                  <Link
                    href="/"
                    className="inline-block text-sm font-medium uppercase tracking-wide px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('bookNow')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}