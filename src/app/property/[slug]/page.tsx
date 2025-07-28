"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientOnly } from "@/components/ui/client-only"
import { ImageGalleryModal } from "@/components/ui/image-gallery-modal"
import { BookingCalendar } from "@/components/booking/BookingCalendar"
import { GuestSelector } from "@/components/booking/GuestSelector"
import Link from "next/link"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPropertyBySlug } from "@/lib/properties-data"
import { notFound } from "next/navigation"
// DateRange type is now handled internally by AirbnbCalendar
import { getBookingUrl } from "@/lib/octorate-api"
import { cn } from "@/lib/utils"
import { 
  Star, 
  Users, 
  Bed, 
  Bath, 
  MapPin, 
  Wifi, 
  Car, 
  Waves,
  Trees,
  Camera,
  CheckCircle,
  Home,
  ChefHat,
  Tv,
  Wind,
  ArrowRight,
  Coffee,
  Utensils
} from "lucide-react"

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "WiFi": Wifi,
  "Piscina": Waves,
  "Vista Mare": Waves,
  "Giardino": Trees,
  "Parcheggio": Car,
  "Aria Condizionata": Wind,
  "Cucina Attrezzata": ChefHat,
  "Cucina di design": ChefHat,
  "Terrazza Panoramica": Home,
  "BBQ": ChefHat,
  "Jacuzzi": Waves,
  "Spiaggia Privata": Waves,
  "Servizio Pulizie": Home,
  "TV Satellite": Tv,
  "TV": Tv,
  "TV in ogni stanza": Tv,
  "Macchina caffè": Coffee,
  "Macchina caffè Nespresso": Coffee,
  "Lavastoviglie": Utensils,
  "Lavatrice": Home,
  "Lavatrice/Asciugatrice": Home,
  "Forno": ChefHat,
  "Forno moderno": ChefHat,
  "Design esclusivo": Star,
  "Travi a vista": Home,
  "Pareti in vetro": Home,
  "Soffitti storici": Star,
  "Marmi pregiati": Star,
  "Opere d'arte": Star,
  "Doccia walk-in": Bath
}

export default function PropertyPage() {
  const params = useParams()
  // const router = useRouter()
  const slug = params?.slug as string
  const property = getPropertyBySlug(slug)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>()
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    if (property) {
      document.documentElement.setAttribute('data-theme', property.theme)
    }
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [property])

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
            src={property.images[0]}
            alt={`${property.name} Interior`}
            fill
            priority
            sizes="100vw"
            className="object-cover image-bright"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Image Gallery Grid Overlay */}
        <div className="absolute bottom-8 right-8 z-20">
          <button 
            onClick={() => {
              setSelectedImageIndex(0)
              setIsGalleryOpen(true)
            }}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Vedi tutte le foto ({property.images.length})
          </button>
        </div>

        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm">
                  <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
                  {property.rating} · {property.reviews} recensioni
                </Badge>
              </div>
              
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
                    <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.maxGuests}</p>
                    <p className="text-sm text-muted-foreground">Ospiti</p>
                  </div>
                  <div className="text-center">
                    <Bed className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Camere</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">Bagni</p>
                  </div>
                  <div className="text-center">
                    <Home className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold">{property.features[0]}</p>
                    <p className="text-sm text-muted-foreground">Superficie</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Description */}
              <RevealOnScroll>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">La Proprietà</h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-line">
                    {property.longDescription}
                  </div>
                </div>
              </RevealOnScroll>

              {/* Amenities */}
              <RevealOnScroll>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">Servizi</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {property.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || CheckCircle
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-foreground">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Booking Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <RevealOnScroll>
                <div className="bg-card border border-border p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">Verifica disponibilità</h3>
                    <p className="text-muted-foreground">Seleziona le date del tuo soggiorno</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <BookingCalendar
                        propertySlug={slug as 'fienaroli' | 'moro'}
                        onDateChange={setDateRange}
                        selectedRange={dateRange}
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
                    Prenota Ora
                  </button>

                  <p className="text-center text-sm text-muted-foreground">
                    Verrai reindirizzato al sistema di prenotazione sicuro
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </Section>

      {/* Image Gallery */}
      <Section className="bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-up">
            <h2 className="text-4xl font-bold mb-12 text-center">Galleria</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.images.map((image, index) => (
              <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <button
                  onClick={() => {
                    setSelectedImageIndex(index)
                    setIsGalleryOpen(true)
                  }}
                  className="relative aspect-[4/3] overflow-hidden group cursor-pointer w-full"
                >
                  <Image 
                    src={image}
                    alt={`${property.name} - Immagine ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                  
                  {/* Zoom indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Zoom
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Location Section */}
      <Section className="bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold mb-6">Posizione</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {property.location} - Nel cuore storico di Roma, a pochi passi dalle principali attrazioni
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll>
            <div className="bg-gray-100 aspect-video rounded-lg overflow-hidden">
              <iframe
                src={property.slug === 'fienaroli' 
                  ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8267848567495!2d12.467863515520!3d41.89139527922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6069db49b0d5%3A0xa7e3b79c6ee8e6e8!2sVia%20dei%20Fienaroli%2C%2011%2C%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2sus!4v1642000000000!5m2!1sen!2sus"
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8267848567495!2d12.467863515520!3d41.89139527922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6069db49b0d5%3A0xa7e3b79c6ee8e6e8!2sVia%20del%20Moro%2C%206%2C%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2sus!4v1642000000000!5m2!1sen!2sus"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mappa ${property.name}`}
              />
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold mb-6 text-background">Pronto per il tuo soggiorno a Roma?</h2>
            <p className="text-xl mb-12 text-background/90">
              Prenota {property.name} e vivi un&apos;esperienza unica nel cuore di Trastevere
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-lg font-semibold border-2 border-background h-14">
                Contattaci
              </Button>
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-background border-2 border-background hover:bg-background hover:text-foreground transition-all duration-300 h-14"
              >
                Vedi altre proprietà
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