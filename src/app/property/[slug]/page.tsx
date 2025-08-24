"use client"

// Removed framer-motion for performance
import { ClientOnly } from "@/components/ui/client-only"
import { PropertyHero } from "@/components/ui/PropertyHero"
import dynamic from 'next/dynamic'

// Lazy load heavy components for better performance
const ImageGalleryModal = dynamic(() => import('@/components/ui/image-gallery-modal').then(mod => ({ default: mod.ImageGalleryModal })), {
  ssr: false // Modal not needed on SSR
})
import { BookingCalendar } from "@/components/booking/BookingCalendar"
import { GuestSelector } from "@/components/booking/GuestSelector"
import { ImageCarousel } from "@/components/gallery/ImageCarousel"
const ReviewsMapSection = dynamic(() => import('@/components/reviews/ReviewsMapSection').then(mod => ({ default: mod.ReviewsMapSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-2xl" />
})
import { TruncatedDescription } from "@/components/ui/truncated-description"
import { PriceCalculator } from "@/components/pricing/PriceCalculator"
import Link from "next/link"
import { HeadMetadata } from "@/components/HeadMetadata"
// import Image from "next/image" // Currently unused
import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { getPropertyBySlug } from "@/lib/properties-data"
import { notFound } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
// DateRange type is now handled internally by AirbnbCalendar
import { getBookingUrl } from "@/lib/booking-redirect"
// Removed unused imports for performance
import { cn } from "@/lib/utils"
import { track } from '@vercel/analytics';
import { isValidDateRangeInItaly, getTimezoneDebugInfo } from '@/lib/date-utils';
import { format } from 'date-fns';

// Icons - optimized imports
import { 
  Users, 
  Bed, 
  Bath, 
  Home,
  ArrowRight
} from "lucide-react"

// Optimized amenity icons
import { amenityIcons, defaultAmenityIcon } from "@/lib/amenity-icons"

// Icon mapping handled by amenity-icons.ts

export default function PropertyPage() {
  const params = useParams()
  // const router = useRouter()
  const slug = params?.slug as string
  const locale = useLocale()
  const t = useTranslations('property')
  const tHome = useTranslations('home')
  const tAmenities = useTranslations('amenities')
  const baseProperty = getPropertyBySlug(slug)
  
  // Get localized property data with useMemo to avoid recomputation
  const property = useMemo(() => {
    return baseProperty ? {
      ...baseProperty,
      name: t.has(`${slug}.name`) ? t(`${slug}.name`) : baseProperty.name,
      location: t.has(`${slug}.location`) ? t(`${slug}.location`) : baseProperty.location,
      shortDesc: t.has(`${slug}.shortDesc`) ? t(`${slug}.shortDesc`) : baseProperty.shortDesc,
      description: t.has(`${slug}.description`) ? t(`${slug}.description`) : baseProperty.description,
      longDescription: t.has(`${slug}.longDescription`) ? t(`${slug}.longDescription`) : baseProperty.longDescription,
    } : undefined
  }, [baseProperty, slug, t])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>()
  const [guests, setGuests] = useState(2)
  // Removed preloading states for performance - components handle their own data fetching
  const [totalPrice, setTotalPrice] = useState<number | null>(null)
  const [priceCurrency, setPriceCurrency] = useState<string>('EUR')
  const [isPricingError, setIsPricingError] = useState(false)

  useEffect(() => {
    if (property) {
      document.documentElement.setAttribute('data-theme', property.theme)
    }
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [property])

  // Track property page visit - performance optimized
  useEffect(() => {
    if (property) {
      // Track page visit once per session
      track('Property Page Visit', {
        property: slug,
        property_name: property.name,
        referrer: typeof window !== 'undefined' ? document.referrer || 'direct' : 'unknown',
        device: typeof window !== 'undefined' ? 
          (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop') : 'unknown'
      });
    }
  }, [slug, property]); // Include dependencies to satisfy React hooks rules

  // Handle hash routing for booking section
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#booking') {
      // Wait for component to mount and render
      const timer = setTimeout(() => {
        const bookingElement = document.getElementById('booking-section')
        if (bookingElement) {
          bookingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  // Also handle hash changes during navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#booking') {
        const bookingElement = document.getElementById('booking-section')
        if (bookingElement) {
          bookingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Data fetching moved to individual components for better performance

  if (!property) {
    notFound()
  }

  return (
    <>
      {/* Preload hero image for better LCP */}
      <HeadMetadata 
        heroImageUrl={property.images[0]} 
        propertyName={property.name} 
      />
      
      <main className="bg-background overflow-hidden transition-colors duration-700">{/* Navbar is in the main layout */}

        {/* Hero Section with PropertyHero Component */}
        <PropertyHero
        imageSrc={property.images[0]}
        title={property.name}
        location={property.location}
        description={tHome.has(`propertyDescriptions.${slug}`) 
          ? tHome(`propertyDescriptions.${slug}`) 
          : property.shortDesc}
        ctaText={t('checkAvailability')}
        onCtaClick={() => {
          const bookingElement = document.getElementById('booking-section');
          if (bookingElement) {
            bookingElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }}
      />

      {/* Property Details Grid */}
      <Section className="bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Key Features */}
              <RevealOnScroll>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.maxGuests}</p>
                    <p className="text-sm text-muted-foreground">{t('guests')}</p>
                  </div>
                  <div className="text-center">
                    <Bed className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">{t('bedrooms')}</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">{t('bathrooms')}</p>
                  </div>
                  <div className="text-center">
                    <Home className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">
                      {t(`features.${property.features[0]}`) || property.features[0]}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('surface')}</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Description */}
              <RevealOnScroll>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">{t('propertyTitle')}</h2>
                  <TruncatedDescription 
                    text={property.longDescription}
                    propertySlug={slug as 'fienaroli' | 'moro'}
                    mobileCharLimit={380}
                  />
                </div>
              </RevealOnScroll>

            </div>

            {/* Booking Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <RevealOnScroll>
                <div id="booking-section" className="bg-card border border-border p-8 space-y-6 rounded-2xl">
                  <div>
                    <h3 className="text-2xl font-bold">{t('checkAvailability')}</h3>
                    <p className="text-muted-foreground">{t('selectDates')}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <BookingCalendar
                        propertySlug={slug as 'fienaroli' | 'moro'}
                        onDateChange={setDateRange}
                        selectedRange={dateRange}
                        // Availability data loaded internally
                      />
                    </div>
                    
                    <GuestSelector
                      propertySlug={slug as 'fienaroli' | 'moro'}
                      value={guests}
                      onChange={setGuests}
                      maxGuests={property.maxGuests}
                    />
                  </div>

                  {/* Price Calculator - Shows after date selection */}
                  <PriceCalculator
                    propertySlug={slug as 'fienaroli' | 'moro'}
                    checkinDate={dateRange?.from}
                    checkoutDate={dateRange?.to}
                    guests={guests}
                    className="mt-6"
                    onPriceCalculated={(price, currency) => {
                      setTotalPrice(price);
                      if (currency) setPriceCurrency(currency);
                    }}
                    onPricingError={setIsPricingError}
                  />

                  <button 
                    className={cn(
                      "w-full py-4 px-6 rounded-xl text-lg font-semibold",
                      "transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]",
                      "text-white shadow-md hover:shadow-lg",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                      !dateRange?.from || !dateRange?.to || isPricingError
                        ? "bg-gray-400" 
                        : slug === 'fienaroli'
                          ? "bg-[hsl(20,50%,45%)] hover:bg-[hsl(20,50%,42%)]"
                          : "bg-[hsl(345,40%,40%)] hover:bg-[hsl(345,40%,37%)]"
                    )}
                    disabled={!dateRange?.from || !dateRange?.to || isPricingError}
                    onClick={() => {
                      if (dateRange?.from && dateRange?.to) {
                        // CRITICAL FIX: Validate dates with Italian timezone before tracking
                        const isValidRange = isValidDateRangeInItaly(dateRange.from, dateRange.to);
                        const debugInfo = getTimezoneDebugInfo();
                        
                        if (isValidRange) {
                          // Track Vercel Analytics - Booking Confirmed (Main Conversion)
                          const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
                          track('Booking Confirmed', {
                            property: slug,
                            details: `${format(dateRange.from, 'dd/MM/yyyy')}-${format(dateRange.to, 'dd/MM/yyyy')} (${nights} ${nights === 1 ? 'night' : 'nights'}) · ${guests} ${guests === 1 ? 'guest' : 'guests'}`,
                            price: totalPrice ? `${Math.round(totalPrice)} ${priceCurrency}` : 'Price not available'
                          });

                          // Track Google Ads conversion with dynamic currency
                          if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
                            (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'conversion', {
                              'send_to': 'AW-17411939860/p_kOCN-PmvwaEJS81O5A',
                              'value': totalPrice || 0,
                              'currency': priceCurrency,
                              'transaction_id': `${slug}-${Date.now()}`, // Unique transaction ID
                            });
                          }
                          
                          const url = getBookingUrl(
                            slug as 'fienaroli' | 'moro',
                            dateRange.from,
                            dateRange.to,
                            guests
                          );
                          window.open(url, '_blank');
                        } else {
                          // Track invalid booking attempt for debugging
                          track('Booking Attempted - Invalid Dates', {
                            property: slug,
                            guests: guests,
                            attempted_checkin: format(dateRange.from, 'yyyy-MM-dd'),
                            attempted_checkout: format(dateRange.to, 'yyyy-MM-dd'),
                            user_timezone: debugInfo.userTimezone,
                            user_time: debugInfo.userTime,
                            italian_time: debugInfo.italianTime,
                            validation_passed: false
                          });
                          
                          // Show error to user
                          // console.error('Invalid date range for Italian timezone:', {
                          //   dateRange,
                          //   debugInfo
                          // });
                        }
                      }
                    }}
                  >
                    {t('bookNow')}
                  </button>

                  <p className="text-center text-sm text-muted-foreground">
                    {t('redirectMessage')}
                  </p>
                </div>

                {/* Amenities - Enhanced Grid Layout */}
                <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-semibold text-center">{t('servicesTitle')}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {property.amenities.slice(0, 12).map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || defaultAmenityIcon
                      return (
                        <div 
                          key={index} 
                          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border !shadow-none hover:!shadow-none hover:!transform-none hover:!bg-card hover:!border-border"
                          style={{ transition: 'none' }}
                        >
                          <Icon className={cn(
                            "w-6 h-6 flex-shrink-0",
                            slug === 'fienaroli' 
                              ? "text-[hsl(20,65%,48%)]" 
                              : "text-[hsl(345,55%,42%)]"
                          )} />
                          <span className="text-foreground font-medium">
                            {tAmenities.has(amenity) ? tAmenities(amenity) : amenity}
                          </span>
                        </div>
                      )
                    })}
                    {property.amenities.length > 12 && (
                      <div className="text-sm text-muted-foreground pt-2 text-center">
                        +{property.amenities.length - 12} {t('moreServices')}
                      </div>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </Section>

      {/* Image Gallery - Full Width Carousel */}
      <Section className="bg-muted px-0 3xl:px-8">
        <div className="animate-fade-up mb-12 text-center px-8">
          <h2 className="text-4xl font-bold">{t('galleryTitle')}</h2>
        </div>
        
        <ImageCarousel
          images={property.images}
          propertyName={property.name}
          propertySlug={slug as 'fienaroli' | 'moro'}
          onImageClick={(index) => {
            setSelectedImageIndex(index)
            setIsGalleryOpen(true)
          }}
        />
      </Section>

      {/* Reviews and Map Section - Split Layout */}
      <Section className="bg-background">
        <div className="max-w-7xl mx-auto">
          <ReviewsMapSection 
            propertySlug={slug as 'fienaroli' | 'moro'}
            propertyName={property.name}
            location={property.location}
            // Reviews data loaded internally
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold mb-6 text-background">{t('ctaTitle')}</h2>
            <p className="text-xl mb-12 text-background/90">
              {t('ctaDescription', { propertyName: property.name })}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-4 text-lg font-semibold bg-background text-foreground border-2 border-background hover:bg-background/90 transition-all duration-300 h-14 w-full sm:w-auto max-w-xs"
              >
                {t('contactUs')}
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-4 text-lg font-semibold text-background border-2 border-background hover:bg-background hover:text-foreground transition-all duration-300 h-14 w-full sm:w-auto max-w-xs"
              >
                {t('seeOtherProperties')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={property.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedImageIndex}
        propertyName={property.name}
      />
      </main>
    </>
  )
}

// Section Component with consistent padding
function Section({ children, className = "", ...props }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section className={`section-padding ${className}`} {...props}>
      <div className="container-padding">
        {children}
      </div>
    </section>
  )
}

// Simple fade-in animation with CSS
function RevealOnScroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-fade-up ${className}`}>
      {children}
    </div>
  )
}