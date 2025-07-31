"use client"

import { motion } from "framer-motion"
import { ClientOnly } from "@/components/ui/client-only"
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
import Image from "next/image"
import { useRef, useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { getPropertyBySlug } from "@/lib/properties-data"
import { notFound } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
// DateRange type is now handled internally by AirbnbCalendar
import { getBookingUrl } from "@/lib/booking-redirect"
import { fetchAvailability } from "@/lib/octorate-api"
import { OctorateCalendarResponse } from "@/types/octorate"
import { ReviewsResponse } from "@/types/reviews"
import { cn } from "@/lib/utils"
import { track } from '@vercel/analytics';

// Icons from react-icons
// Lucide icons for modern amenity display
import { 
  Star, 
  Users, 
  Bed, 
  Bath, 
  MapPin, 
  Wifi, 
  Car, 
  CheckCircle,
  Home,
  Utensils,
  Tv,
  Wind,
  Coffee,
  Eye,
  Shirt,
  Baby,
  Clock,
  Trash2,
  Sun,
  ShowerHead,
  Snowflake,
  Flame,
  Lock,
  ParkingCircle,
  Zap,
  Package
} from "lucide-react"

// Keep FA icons only where absolutely needed
import { FaArrowRight } from "react-icons/fa"

// Lucide replacements for MD icons
import {
  Bath as Bathtub,
  ChefHat as Kitchen,
  WashingMachine,
  Shield,
  Cross,
  UtensilsCrossed,
  Wine,
  Car as Parking,
  Microwave,
  Shirt as Iron
} from "lucide-react"

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  // Viste panoramiche
  "Vista sul panorama urbano": Eye,
  
  // Bagno
  "Asciugacapelli": Wind,
  "Prodotti per la pulizia": CheckCircle,
  "Shampoo": Bath,
  "Balsamo": Bath,
  "Sapone per il corpo": Bath,
  "Bidet": Bathtub,
  "Acqua calda": Bath,
  "Gel doccia": Bath,
  
  // Camera da letto e lavanderia
  "Lavatrice": WashingMachine,
  "Asciugatrice": WashingMachine,
  "Essenziali": CheckCircle,
  "Grucce": Shirt,
  "Biancheria da letto": Bed,
  "Cuscini e coperte extra": Bed,
  "Tende oscuranti": Sun,
  "Ferro da stiro": Iron,
  "Stendibiancheria per abiti": Shirt,
  "Spazio per conservare l'abbigliamento": Package,
  
  // Intrattenimento
  "TV via cavo standard": Tv,
  "HDTV da 55 pollici con Netflix": Tv,
  
  // Famiglia
  "Culla": Baby,
  "Box bebè portatile": Baby,
  "Seggiolone": Baby,
  
  // Riscaldamento e climatizzazione
  "Aria condizionata": Snowflake,
  "Climatizzatore centralizzato": Snowflake,
  "Riscaldamento": Flame,
  "Riscaldamento a pannelli radianti": Flame,
  
  // Sicurezza domestica
  "Allarme antincendio": Flame,
  "Rilevatore di monossido di carbonio": Shield,
  "Estintore": Flame,
  "Kit di pronto soccorso": Cross,
  
  // Internet e ufficio
  "Wi-fi": Wifi,
  "WiFi": Wifi,
  
  // Cucina e zona pranzo
  "Cucina": Kitchen,
  "Frigorifero": Package,
  "Servizi di base per cucinare": Utensils,
  "Piatti e posate": Utensils,
  "Freezer": Package,
  "Lavastoviglie": Utensils,
  "Piano cottura a induzione": Zap,
  "Forno": Microwave,
  "Bollitore": Coffee,
  "Macchina del caffè": Coffee,
  "Macchina del caffè Nespresso": Coffee,
  "Calici da vino": Wine,
  "Teglia da forno": Kitchen,
  "Compattatore di rifiuti": Trash2,
  "Tavolo da pranzo": UtensilsCrossed,
  "Caffè": Coffee,
  
  // Caratteristiche dell'alloggio
  "Lavanderia a gettoni nelle vicinanze": WashingMachine,
  
  // Parcheggi e strutture
  "Parcheggio gratuito in strada": ParkingCircle,
  "Parcheggio a pagamento in loco": Parking,
  "Garage a pagamento non in loco": Car,
  "Casa su un solo piano": Home,
  
  // Servizi
  "Sono permessi soggiorni a lungo termine": Clock,
  "Self check-in": Lock,
  "Smart Lock": Lock,
  
  // Legacy amenities (for backward compatibility)
  "Cucina Attrezzata": Kitchen,
  "Cucina di design": Kitchen,
  "TV in ogni stanza": Tv,
  "Macchina caffè Nespresso": Coffee,
  "Lavatrice/Asciugatrice": WashingMachine,
  "Design esclusivo": Star,
  "Travi a vista": Home,
  "Pareti in vetro": Home,
  "Soffitti storici": Star,
  "Marmi pregiati": Star,
  "Opere d'arte": Star,
  "Doccia walk-in": ShowerHead,
  "TV": Tv,
  "Forno moderno": Microwave
}

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
  const [guests, setGuests] = useState(1)
  const [preloadedAvailability, setPreloadedAvailability] = useState<OctorateCalendarResponse | null>(null)
  const [preloadedReviews, setPreloadedReviews] = useState<ReviewsResponse | null>(null)
  const [isPreloadingReviews, setIsPreloadingReviews] = useState(true)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)

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
  }, []); // Empty dependency array - runs only once on mount

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

  // Preload availability and reviews data on page load and locale change
  useEffect(() => {
    const preloadData = async () => {
      if (!slug) return;
      
      try {
        setIsPreloadingReviews(true);
        
        // Reset preloaded reviews when locale changes
        setPreloadedReviews(null);
        
        // Preload availability data (only on initial load)
        if (!preloadedAvailability) {
          const availabilityData = await fetchAvailability(slug as 'fienaroli' | 'moro');
          setPreloadedAvailability(availabilityData);
        }

        // Preload reviews data (always when locale changes)
        const reviewsResponse = await fetch(`/api/reviews/${slug}?limit=12&locale=${locale}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setPreloadedReviews(reviewsData);
        }
      } catch {
        // Silently handle preloading errors
      } finally {
        setIsPreloadingReviews(false);
      }
    };

    preloadData();
  }, [slug, locale, preloadedAvailability])

  if (!property) {
    notFound()
  }

  return (
    <main className="bg-background overflow-hidden transition-colors duration-700">{/* Navbar is in the main layout */}

      {/* Hero Section with Gallery */}
      <section className="relative h-screen">
        {/* Main Image */}
        <div className="absolute inset-0">
          <Image 
            src={slug === 'moro' ? property.images[1] : property.images[0]}
            alt={`${property.name} Interior`}
            fill
            priority
            sizes="100vw"
            className="object-cover image-bright"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>


        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              
              {/* Enhanced readability with backdrop blur */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-4xl">
                <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
                  {property.name}
                </h1>
                
                <div className="flex items-center text-lg text-white/95 mb-6 drop-shadow-md">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location}</span>
                </div>

                <p className="text-xl text-white/95 max-w-2xl drop-shadow-md">
                  {tHome.has(`propertyDescriptions.${slug}`) 
                    ? tHome(`propertyDescriptions.${slug}`) 
                    : property.shortDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details Grid */}
      <Section className="bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Key Features */}
              <RevealOnScroll>
                <div id="booking-section" className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                <div className="bg-card border border-border p-8 space-y-6 rounded-2xl">
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
                        preloadedAvailability={preloadedAvailability}
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
                    onPriceCalculated={setTotalPrice}
                  />

                  <button 
                    className={cn(
                      "w-full py-4 px-6 rounded-xl text-lg font-semibold",
                      "transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]",
                      "text-white shadow-md hover:shadow-lg",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                      !dateRange?.from || !dateRange?.to 
                        ? "bg-gray-400" 
                        : slug === 'fienaroli'
                          ? "bg-[hsl(20,50%,45%)] hover:bg-[hsl(20,50%,42%)]"
                          : "bg-[hsl(345,40%,40%)] hover:bg-[hsl(345,40%,37%)]"
                    )}
                    disabled={!dateRange?.from || !dateRange?.to}
                    onClick={() => {
                      if (dateRange?.from && dateRange?.to) {
                        // Track Vercel Analytics - Booking Confirmed (Main Conversion)
                        track('Booking Confirmed', {
                          property: slug,
                          guests: guests,
                          nights: Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)),
                          total_price: totalPrice || 0,
                          checkin_date: dateRange.from.toISOString().split('T')[0],
                          checkout_date: dateRange.to.toISOString().split('T')[0]
                        });

                        // Track Google Ads conversion
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                          (window as any).gtag('event', 'conversion', {
                            'send_to': 'AW-17411939860/p_kOCN-PmvwaEJS81O5A',
                            'value': totalPrice || 0,
                            'currency': 'EUR',
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
                      const Icon = amenityIcons[amenity] || CheckCircle
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
            preloadedReviews={preloadedReviews}
            isPreloadingReviews={isPreloadingReviews}
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
                <FaArrowRight className="w-5 h-5" />
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

// Reveal on Scroll Component  
function RevealOnScroll({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)

  return (
    <ClientOnly>
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className={className}
      >
        {children}
      </motion.div>
    </ClientOnly>
  )
}