"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllProperties } from "@/lib/properties-data"
import { ArrowRight, MapPin, Users, Bed, Bath } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const properties = getAllProperties()
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const t = useTranslations('home')

  // Reset theme on homepage
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <main className="bg-white overflow-hidden">
      {/* Hero Section - Minimal with brand */}
      <section className="h-screen relative flex items-center justify-center">
        <div className="text-center z-10">
          <h6 className="text-sm uppercase tracking-[0.3em] mb-6 font-medium text-gray-600">
            {t('subtitle')}
          </h6>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            {t('description')}
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gray-300 mx-auto animate-pulse" />
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className="min-h-screen bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
          {properties.map((property, index) => (
            <Link
              key={property.slug}
              href={`/property/${property.slug}`}
              className="relative group overflow-hidden"
              onMouseEnter={() => setHoveredProperty(property.slug)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image 
                  src={property.images[0]}
                  alt={property.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index < 2}
                  className={`object-cover transition-all duration-700 ${
                    hoveredProperty === property.slug ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${
                  hoveredProperty === property.slug ? 'opacity-40' : 'opacity-20'
                }`} />
              </div>

              {/* Property Info */}
              <div className="relative h-full flex flex-col justify-end p-12 lg:p-16">
                {/* Bottom - Details */}
                <div className="text-white">
                  {/* Text with enhanced readability */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-6 min-h-[160px] flex flex-col justify-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                      {property.name}
                    </h2>
                    
                    <p className="text-base text-white/95 max-w-md leading-relaxed drop-shadow-md">
                      {property.shortDesc}
                    </p>
                  </div>

                  {/* Features with better contrast */}
                  <div className="flex items-center gap-6 mb-8 text-sm text-white/90 drop-shadow-md">
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

                  {/* CTA with better visibility */}
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
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h6 className="text-sm uppercase tracking-[0.3em] mb-6 font-medium text-gray-600">
            {t('aboutSectionLabel')}
          </h6>
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            {t('aboutTitle')}
          </h2>
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

      {/* Location Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h6 className="text-sm uppercase tracking-[0.3em] mb-6 font-medium text-gray-600">
                {t('locationSectionLabel')}
              </h6>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                {t('locationTitle')}
              </h2>
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
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-white/90 mb-12">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/property/fienaroli"
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              Casa Fienaroli
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/property/moro"
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
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