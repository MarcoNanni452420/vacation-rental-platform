"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ClientOnly } from "@/components/ui/client-only"
import { ImageGalleryModal } from "@/components/ui/image-gallery-modal"
import { BookingCalendar } from "@/components/booking/BookingCalendar"
import { GuestSelector } from "@/components/booking/GuestSelector"
import { ImageCarousel } from "@/components/gallery/ImageCarousel"
import { ReviewsMapSection } from "@/components/reviews/ReviewsMapSection"
import Link from "next/link"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPropertyBySlug } from "@/lib/properties-data"
import { notFound } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
// DateRange type is now handled internally by AirbnbCalendar
import { getAirbnbBookingUrl } from "@/lib/airbnb-booking"
import { fetchAvailability } from "@/lib/octorate-api"
import { OctorateCalendarResponse } from "@/types/octorate"
import { ReviewsResponse } from "@/types/reviews"
import { cn } from "@/lib/utils"

// Simple markdown parser for bold text
function parseMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index}>{boldText}</strong>;
    }
    return part;
  });
}
// Icons from react-icons
import { 
  FaStar, 
  FaUsers, 
  FaBed, 
  FaBath, 
  FaMapMarkerAlt, 
  FaWifi, 
  FaCar, 
  FaCheckCircle,
  FaHome,
  FaUtensils,
  FaTv,
  FaWind,
  FaArrowRight,
  FaCoffee,
  FaEye,
  FaTshirt,
  FaBaby,
  FaClock,
  FaTrash,
  FaSun,
  FaShower,
  FaSnowflake,
  FaFire,
  FaLock,
  FaParking,
  FaBolt,
  FaBox
} from "react-icons/fa"

import {
  MdBathtub,
  MdKitchen,
  MdLocalLaundryService,
  MdSecurity,
  MdLocalHospital,
  MdTableRestaurant,
  MdWineBar,
  MdLocalParking,
  MdMicrowave,
  MdIron
} from "react-icons/md"

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  // Viste panoramiche
  "Vista sul panorama urbano": FaEye,
  
  // Bagno
  "Asciugacapelli": FaWind,
  "Prodotti per la pulizia": FaCheckCircle,
  "Shampoo": FaBath,
  "Balsamo": FaBath,
  "Sapone per il corpo": FaBath,
  "Bidet": MdBathtub,
  "Acqua calda": FaBath,
  "Gel doccia": FaBath,
  
  // Camera da letto e lavanderia
  "Lavatrice": MdLocalLaundryService,
  "Asciugatrice": MdLocalLaundryService,
  "Essenziali": FaCheckCircle,
  "Grucce": FaTshirt,
  "Biancheria da letto": FaBed,
  "Cuscini e coperte extra": FaBed,
  "Tende oscuranti": FaSun,
  "Ferro da stiro": MdIron,
  "Stendibiancheria per abiti": FaTshirt,
  "Spazio per conservare l'abbigliamento": FaBox,
  
  // Intrattenimento
  "TV via cavo standard": FaTv,
  "HDTV da 55 pollici con Netflix": FaTv,
  
  // Famiglia
  "Culla": FaBaby,
  "Box bebè portatile": FaBaby,
  "Seggiolone": FaBaby,
  
  // Riscaldamento e climatizzazione
  "Aria condizionata": FaSnowflake,
  "Climatizzatore centralizzato": FaSnowflake,
  "Riscaldamento": FaFire,
  "Riscaldamento a pannelli radianti": FaFire,
  
  // Sicurezza domestica
  "Allarme antincendio": FaFire,
  "Rilevatore di monossido di carbonio": MdSecurity,
  "Estintore": FaFire,
  "Kit di pronto soccorso": MdLocalHospital,
  
  // Internet e ufficio
  "Wi-fi": FaWifi,
  "WiFi": FaWifi,
  
  // Cucina e zona pranzo
  "Cucina": MdKitchen,
  "Frigorifero": FaBox,
  "Servizi di base per cucinare": FaUtensils,
  "Piatti e posate": FaUtensils,
  "Freezer": FaBox,
  "Lavastoviglie": FaUtensils,
  "Piano cottura a induzione": FaBolt,
  "Forno": MdMicrowave,
  "Bollitore": FaCoffee,
  "Macchina del caffè": FaCoffee,
  "Macchina del caffè Nespresso": FaCoffee,
  "Calici da vino": MdWineBar,
  "Teglia da forno": MdKitchen,
  "Compattatore di rifiuti": FaTrash,
  "Tavolo da pranzo": MdTableRestaurant,
  "Caffè": FaCoffee,
  
  // Caratteristiche dell'alloggio
  "Lavanderia a gettoni nelle vicinanze": MdLocalLaundryService,
  
  // Parcheggi e strutture
  "Parcheggio gratuito in strada": FaParking,
  "Parcheggio a pagamento in loco": MdLocalParking,
  "Garage a pagamento non in loco": FaCar,
  "Casa su un solo piano": FaHome,
  
  // Servizi
  "Sono permessi soggiorni a lungo termine": FaClock,
  "Self check-in": FaLock,
  "Smart Lock": FaLock,
  
  // Legacy amenities (for backward compatibility)
  "Cucina Attrezzata": MdKitchen,
  "Cucina di design": MdKitchen,
  "TV in ogni stanza": FaTv,
  "Macchina caffè Nespresso": FaCoffee,
  "Lavatrice/Asciugatrice": MdLocalLaundryService,
  "Design esclusivo": FaStar,
  "Travi a vista": FaHome,
  "Pareti in vetro": FaHome,
  "Soffitti storici": FaStar,
  "Marmi pregiati": FaStar,
  "Opere d'arte": FaStar,
  "Doccia walk-in": FaShower,
  "TV": FaTv,
  "Forno moderno": MdMicrowave
}

export default function PropertyPage() {
  const params = useParams()
  // const router = useRouter()
  const slug = params?.slug as string
  const locale = useLocale()
  const t = useTranslations('property')
  const tAmenities = useTranslations('amenities')
  const baseProperty = getPropertyBySlug(slug)
  
  // Get localized property data
  const property = baseProperty ? {
    ...baseProperty,
    name: t.has(`${slug}.name`) ? t(`${slug}.name`) : baseProperty.name,
    location: t.has(`${slug}.location`) ? t(`${slug}.location`) : baseProperty.location,
    shortDesc: t.has(`${slug}.shortDesc`) ? t(`${slug}.shortDesc`) : baseProperty.shortDesc,
    description: t.has(`${slug}.description`) ? t(`${slug}.description`) : baseProperty.description,
    longDescription: t.has(`${slug}.longDescription`) ? t(`${slug}.longDescription`) : baseProperty.longDescription,
  } : undefined
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>()
  const [guests, setGuests] = useState(1)
  const [preloadedAvailability, setPreloadedAvailability] = useState<OctorateCalendarResponse | null>(null)
  const [preloadedReviews, setPreloadedReviews] = useState<ReviewsResponse | null>(null)
  const [isPreloadingReviews, setIsPreloadingReviews] = useState(true)

  useEffect(() => {
    if (property) {
      document.documentElement.setAttribute('data-theme', property.theme)
    }
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [property])

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
        console.log(`🔄 Preloading reviews for ${slug} (${locale})`);
        const reviewsResponse = await fetch(`/api/airbnb-reviews/${slug}?limit=12&locale=${locale}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setPreloadedReviews(reviewsData);
          console.log(`✅ Preloaded ${reviewsData.reviews?.length || 0} reviews for ${locale}`);
        }
      } catch (error) {
        console.error('Error preloading data:', error);
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
                  <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                  <span>{property.location}</span>
                </div>

                <p className="text-xl text-white/95 max-w-2xl drop-shadow-md">
                  {property.shortDesc}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <FaUsers className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.maxGuests}</p>
                    <p className="text-sm text-muted-foreground">{t('guests')}</p>
                  </div>
                  <div className="text-center">
                    <FaBed className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">{t('bedrooms')}</p>
                  </div>
                  <div className="text-center">
                    <FaBath className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">{t('bathrooms')}</p>
                  </div>
                  <div className="text-center">
                    <FaHome className="w-8 h-8 mx-auto mb-3 text-primary" />
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
                  <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-line">
                    {parseMarkdown(property.longDescription)}
                  </div>
                </div>
              </RevealOnScroll>

            </div>

            {/* Booking Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <RevealOnScroll>
                <div className="bg-card border border-border p-8 space-y-6">
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
                        const url = getAirbnbBookingUrl(
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

                {/* Amenities - Sidebar Below Booking */}
                <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-semibold text-center">{t('servicesTitle')}</h3>
                  <div className="space-y-3">
                    {property.amenities.slice(0, 12).map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || FaCheckCircle
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{tAmenities.has(amenity) ? tAmenities(amenity) : amenity}</span>
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
      <Section className="bg-muted px-0">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <Button className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-lg font-semibold border-2 border-background h-14">
                  {t('contactUs')}
                </Button>
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-background border-2 border-background hover:bg-background hover:text-foreground transition-all duration-300 h-14"
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