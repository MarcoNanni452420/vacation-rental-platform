"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations } from 'next-intl'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isBookingDropdownOpen, setIsBookingDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  // const router = useRouter() // Currently unused
  const isHomepage = pathname === '/'
  const isContactPage = pathname === '/contact'
  const isPropertyPage = pathname.startsWith('/property/')
  const needsDarkText = isHomepage || isContactPage || isPropertyPage || isScrolled
  const t = useTranslations('nav')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if we're navigating
      if (isNavigating) return;
      
      // Check if click is outside both desktop and mobile dropdowns
      const isOutsideDesktop = dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setIsBookingDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNavigating])

  // Close dropdown on route change
  useEffect(() => {
    setIsBookingDropdownOpen(false)
  }, [pathname])

  // Listen for custom event to close this dropdown when others open
  useEffect(() => {
    const handleCloseDropdown = () => {
      setIsBookingDropdownOpen(false)
    }

    window.addEventListener('closeBookingDropdown', handleCloseDropdown)
    return () => window.removeEventListener('closeBookingDropdown', handleCloseDropdown)
  }, [])

  const handleBookingToggle = () => {
    if (!isBookingDropdownOpen) {
      // Dispatch event to close other dropdowns
      window.dispatchEvent(new CustomEvent('closeLanguageDropdown'))
    }
    setIsBookingDropdownOpen(!isBookingDropdownOpen)
  }



  const navLinks = [
    { href: "/property/fienaroli", label: t('fienaroli') },
    { href: "/property/moro", label: t('moro') },
    { href: "/contact", label: t('contact') },
  ]

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-500",
        needsDarkText
          ? "bg-white/95" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 2xl:px-20 3xl:px-32">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group">
              <div className="flex items-center gap-3">
                {/* TL Logo */}
                <div className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-xl overflow-hidden bg-black">
                  <Image
                    src="/favicon.png"
                    alt="Trastevere Luxury Logo"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                
                {/* Brand Text */}
                <div 
                  className={cn(
                    "text-xs xl:text-sm 2xl:text-base font-medium tracking-[0.2em] uppercase transition-colors duration-300",
                    needsDarkText ? "text-black" : "text-white"
                  )}
                >
                  TRASTEVERE LUXURY HOMES
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-12 xl:space-x-16 2xl:space-x-20">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link 
                  href={link.href} 
                  className="relative group text-sm font-medium tracking-wide uppercase"
                >
                  <span
                    className={cn(
                      "relative z-10 group-hover:opacity-60 transition-all duration-300",
                      needsDarkText ? "text-black" : "text-white"
                    )}
                  >
                    {link.label}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              </div>
            ))}
            
            {/* CTA and Language Section */}
            <div className="flex items-center space-x-8 ml-12 xl:ml-16 2xl:ml-20">
              <LanguageSwitcher needsDarkText={needsDarkText} />
              
              {/* Book Now Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleBookingToggle}
                  className={cn(
                    "text-sm font-medium uppercase tracking-wide px-6 py-3 border transition-all duration-300 flex items-center gap-2",
                    needsDarkText
                      ? "border-black text-black hover:bg-black hover:text-white" 
                      : "border-white text-white hover:bg-white hover:text-black"
                  )}
                >
                  {t('bookNow')}
                  <svg 
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isBookingDropdownOpen && "rotate-180"
                    )}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu - Match Language Switcher Design */}
                {isBookingDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 bg-background border border-border w-full overflow-hidden rounded-lg shadow-lg z-50">
                    <Link
                      href="/property/fienaroli#booking"
                      className="block w-full px-4 py-3 text-left text-sm font-medium uppercase tracking-wider transition-colors text-[hsl(20,65%,35%)] hover:text-[hsl(20,65%,35%)]/80 hover:bg-[hsl(20,65%,35%)]/10"
                      onClick={(e) => {
                        // Close both dropdowns immediately
                        setIsBookingDropdownOpen(false)
                        setIsMenuOpen(false)
                        
                        if (pathname === '/property/fienaroli') {
                          e.preventDefault()
                          // Use requestAnimationFrame to avoid forced reflow during click handler
                          requestAnimationFrame(() => {
                            const element = document.getElementById('booking-section')
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
                            }
                          })
                        }
                      }}
                    >
                      Fienaroli
                    </Link>
                    <div className="border-t border-border" />
                    <Link
                      href="/property/moro#booking"
                      className="block w-full px-4 py-3 text-left text-sm font-medium uppercase tracking-wider transition-colors text-[hsl(345,55%,35%)] hover:text-[hsl(345,55%,35%)]/80 hover:bg-[hsl(345,55%,35%)]/10"
                      onClick={(e) => {
                        // Close both dropdowns immediately
                        setIsBookingDropdownOpen(false)
                        setIsMenuOpen(false)
                        
                        if (pathname === '/property/moro') {
                          e.preventDefault()
                          // Use requestAnimationFrame to avoid forced reflow during click handler
                          requestAnimationFrame(() => {
                            const element = document.getElementById('booking-section')
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
                            }
                          })
                        }
                      }}
                    >
                      Moro
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2 transition-colors duration-300",
                needsDarkText ? "text-black" : "text-white"
              )}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
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
                  <LanguageSwitcher needsDarkText={true} />
                </div>
                
                {/* Mobile Book Now Options - Match Desktop Style */}
                <div className="space-y-4" ref={mobileDropdownRef}>
                  <button
                    onClick={handleBookingToggle}
                    className="w-full text-sm font-medium uppercase tracking-wide px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {t('bookNow')}
                    <svg 
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isBookingDropdownOpen && "rotate-180"
                      )}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu - Native Links for Mobile */}
                  {isBookingDropdownOpen && (
                    <div className="mt-4 bg-background border border-border w-full overflow-hidden rounded-lg shadow-lg">
                      <Link
                        href="/property/fienaroli#booking"
                        className="block w-full px-4 py-3 text-left text-sm font-medium uppercase tracking-wider transition-colors text-[hsl(20,65%,35%)] hover:text-[hsl(20,65%,35%)]/80 hover:bg-[hsl(20,65%,35%)]/10"
                        onClick={() => {
                          // Set navigating flag to prevent dropdown close
                          setIsNavigating(true)
                          // Close after navigation completes
                          setTimeout(() => {
                            setIsBookingDropdownOpen(false)
                            setIsMenuOpen(false)
                            setIsNavigating(false)
                          }, 500)
                        }}
                      >
                        Fienaroli
                      </Link>
                      <div className="border-t border-border" />
                      <Link
                        href="/property/moro#booking"
                        className="block w-full px-4 py-3 text-left text-sm font-medium uppercase tracking-wider transition-colors text-[hsl(345,55%,35%)] hover:text-[hsl(345,55%,35%)]/80 hover:bg-[hsl(345,55%,35%)]/10"
                        onClick={() => {
                          // Set navigating flag to prevent dropdown close
                          setIsNavigating(true)
                          // Close after navigation completes
                          setTimeout(() => {
                            setIsBookingDropdownOpen(false)
                            setIsMenuOpen(false)
                            setIsNavigating(false)
                          }, 500)
                        }}
                      >
                        Moro
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}