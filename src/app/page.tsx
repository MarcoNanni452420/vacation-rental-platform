"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllProperties } from "@/lib/properties-data"
import { ArrowRight, MapPin, Users, Bed, Bath } from "lucide-react"
import { useTranslations } from 'next-intl'
import { LazySection } from "@/components/ui/LazySection"
import { AnimatedScrollPrompt } from "@/components/ui/AnimatedScrollPrompt"
import { MobileBottomSheet } from "@/components/ui/MobileBottomSheet"

export default function HomePage() {
  const properties = getAllProperties()
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const t = useTranslations('home')

  // Reset theme on homepage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  return (
    <main className="bg-white overflow-hidden">
      {/* Hero Section - Minimal with brand */}
      <section className="h-screen relative flex items-center justify-center pt-12">
        <div className="text-center z-10">
          <div className="flex justify-center">
            <Image
              src="/homepage-title-logo.png"
              alt="Trastevere Luxury"
              width={500}
              height={167}
              className="max-w-[18rem] sm:max-w-sm md:max-w-lg lg:max-w-xl h-auto -mt-16 md:-mt-20 -mb-8"
              priority
              fetchPriority="high"
            />
          </div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-light mt-2 px-6 sm:px-4">
            {t('description')}
          </p>
        </div>
        
        {/* Enhanced Animated Scroll Prompt - Mobile Safari safe positioning */}
        <div className="absolute bottom-16 md:bottom-8 left-1/2 -translate-x-1/2">
          <AnimatedScrollPrompt />
        </div>
      </section>

      {/* Properties Grid Section */}
      <section id="properties-section" className="min-h-screen bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-screen" suppressHydrationWarning={true}>
          {properties.map((property, index) => (
            <Link
              key={property.slug}
              href={`/property/${property.slug}`}
              className="relative group overflow-hidden"
              onMouseEnter={() => setHoveredProperty(property.slug)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Background Image - Clean on Mobile */}
              <div className="absolute inset-0" style={{ aspectRatio: 'unset' }} suppressHydrationWarning={true}>
                <Image 
                  src={property.slug === 'moro' ? property.images[1] : property.images[0]}
                  alt={property.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index < 2}
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bz6rt3/Z"
                  className={`object-cover w-full h-full transition-all duration-300 md:duration-500 transform-gpu ${
                    hoveredProperty === property.slug ? 'scale-105 md:scale-110' : 'scale-100'
                  }`}
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center center'
                  }}
                />
                {/* Mobile: Minimal overlay, Desktop: Interactive overlay */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${
                  hoveredProperty === property.slug ? 'opacity-40 md:opacity-40' : 'opacity-10 md:opacity-20'
                }`} />
              </div>

              {/* Desktop Property Info - Hidden on Mobile */}
              <div className="relative h-full hidden md:flex flex-col justify-end p-12 lg:p-16">
                <div className="text-white h-[350px] flex flex-col justify-between">
                  {/* Text with enhanced readability */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 h-[200px] flex flex-col justify-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                      {property.name}
                    </h2>
                    
                    <p className="text-base text-white/95 max-w-md leading-relaxed drop-shadow-md">
                      {t.has(`propertyDescriptions.${property.slug}`) 
                        ? t(`propertyDescriptions.${property.slug}`) 
                        : property.shortDesc}
                    </p>
                  </div>

                  {/* Features with better contrast */}
                  <div className="flex items-center gap-6 text-sm text-white/90 drop-shadow-md">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{property.maxGuests} {t('guests')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms} {t('bedrooms')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} {t('bathrooms')}</span>
                    </div>
                  </div>

                  {/* Desktop CTA */}
                  <div className="flex items-center justify-end">
                    <div className={`inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 text-white drop-shadow-lg ${
                      hoveredProperty === property.slug ? 'translate-x-2' : ''
                    }`}>
                      {t('explore')}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Bottom Sheet */}
              <MobileBottomSheet
                title={property.name}
                description={t.has(`propertyDescriptions.${property.slug}`) 
                  ? t(`propertyDescriptions.${property.slug}`) 
                  : property.shortDesc}
                features={{
                  guests: property.maxGuests,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms
                }}
                ctaText={t('explore')}
                onCtaClick={() => {
                  // Navigation will be handled by the parent Link component
                }}
              />

              {/* Theme Preview Line */}
              <div 
                className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-700 ${
                  hoveredProperty === property.slug ? 'h-2' : 'h-1'
                }`}
                style={{
                  backgroundColor: property.theme === 'fienaroli' 
                    ? '#C17A5B' // Soft Terracotta for Fienaroli
                    : '#A65B5B' // Muted Burgundy for Moro
                }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <LazySection
        fallback={<div className="py-32 bg-gray-50 animate-pulse"><div className="h-64 bg-gray-200 rounded-lg mx-auto max-w-4xl" /></div>}
        rootMargin="100px"
      >
        <section className="py-32 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-sm uppercase tracking-[0.3em] mb-6 font-medium text-gray-600">
              {t('aboutSectionLabel')}
            </h2>
            <h3 className="text-5xl md:text-6xl font-bold mb-8">
              {t('aboutTitle')}
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              {t('aboutDescription')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">2</div>
                <p className="text-gray-600">{t('stats.properties')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10+</div>
                <p className="text-gray-600">{t('stats.experience')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">200+</div>
                <p className="text-gray-600">{t('stats.guests')}</p>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Location Section */}
      <LazySection
        fallback={<div className="py-32 bg-white animate-pulse"><div className="h-96 bg-gray-200 rounded-lg mx-auto max-w-6xl" /></div>}
        rootMargin="150px"
      >
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm uppercase tracking-[0.3em] mb-6 font-medium text-gray-600">
                  {t('locationSectionLabel')}
                </h2>
                <h3 className="text-5xl md:text-6xl font-bold mb-8">
                  {t('locationTitle')}
                </h3>
                <p className="text-xl text-gray-600 mb-6">
                  {t('locationDescription')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{t('walkingDistances.santaMaria')}</p>
                      <p className="text-gray-600">{t('walkingDistances.santaMariaLocation')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{t('walkingDistances.piazzaNavona')}</p>
                      <p className="text-gray-600">{t('walkingDistances.piazzaNavonaLocation')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{t('walkingDistances.fontanaTrevi')}</p>
                      <p className="text-gray-600">{t('walkingDistances.fontanaTreviLocation')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=41.8898,12.4712&zoom=17&size=1200x600&markers=color:orange%7Clabel:F%7C41.8885,12.4719&markers=color:red%7Clabel:M%7C41.8911,12.4705&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                  alt="Mappa Trastevere - Casa Fienaroli (F) e Casa Moro (M)"
                  fill
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 50vw"
                  quality={90}
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            {t('ctaTitle')}
          </h3>
          <p className="text-xl text-white/90 mb-12">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/property/fienaroli"
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-4 sm:px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto max-w-xs"
            >
              Casa Fienaroli
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/property/moro"
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-4 sm:px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto max-w-xs"
            >
              Casa Moro
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}