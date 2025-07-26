"use client"

import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientOnly } from "@/components/ui/client-only"
import Link from "next/link"
import { useRef } from "react"
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
  Calendar,
  ArrowLeft,
  Share,
  Heart,
  Camera,
  CheckCircle,
  Home,
  ChefHat,
  Tv,
  Wind,
  ArrowRight
} from "lucide-react"

const amenityIcons = {
  "WiFi": Wifi,
  "Piscina": Waves,
  "Vista Mare": Waves,
  "Giardino": Trees,
  "Parcheggio": Car,
  "Aria Condizionata": Wind,
  "Cucina Attrezzata": ChefHat,
  "Terrazza Panoramica": Home,
  "BBQ": ChefHat,
  "Jacuzzi": Waves,
  "Spiaggia Privata": Waves,
  "Servizio Pulizie": Home,
  "TV Satellite": Tv
}

// Single property data
const property = {
  id: "villa-paradiso",
  title: "Casa Fienaroli",
  subtitle: "Vista Mare Mozzafiato",
  description: "Un rifugio esclusivo dove il lusso incontra la tradizione italiana, affacciato sul mare cristallino della costa amalfitana",
  longDescription: `Casa Fienaroli rappresenta l'essenza del vivere mediterraneo, dove ogni dettaglio è stato curato per offrire un'esperienza indimenticabile.

Quattro camere da letto elegantemente arredate, tre bagni in marmo di Carrara, e spazi living che si aprono su terrazze panoramiche con vista mozzafiato sul mare.

Gli interni sono stati progettati con attenzione meticolosa ai dettagli, combinando mobili di design italiano con elementi tradizionali locali.`,
  address: "Via Marina Grande, 123",
  city: "Positano",
  country: "Costa Amalfitana",
  pricePerNight: 450,
  maxGuests: 8,
  bedrooms: 4,
  bathrooms: 3,
  amenities: [
    "WiFi",
    "Piscina", 
    "Vista Mare",
    "Aria Condizionata",
    "Cucina Attrezzata",
    "Giardino",
    "Parcheggio",
    "Terrazza Panoramica",
    "BBQ",
    "Jacuzzi",
    "Spiaggia Privata",
    "Servizio Pulizie",
    "TV Satellite"
  ],
  rating: 4.9,
  reviews: 127,
  images: [
    "/images/villa/interior-overview.jpg",
    "/images/villa/bedroom-master.jpg", 
    "/images/villa/kitchen-1.jpg",
    "/images/villa/bathroom-1.jpg",
    "/images/villa/bedroom-elegant.jpg",
    "/images/villa/bedroom-rustic.jpg"
  ]
}

export default function PropertyPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* Header Navigation */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla Home
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Gallery */}
      <section className="relative h-screen">
        {/* Main Image */}
        <div className="absolute inset-0">
          <img 
            src={property.images[0]}
            alt="Casa Fienaroli Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Image Gallery Grid Overlay */}
        <div className="absolute bottom-8 right-8 z-20">
          <button className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors">
            <Camera className="w-4 h-4" />
            Vedi tutte le foto ({property.images.length})
          </button>
        </div>

        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-white/20 text-white border-white/20">
                  <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
                  {property.rating} · {property.reviews} recensioni
                </Badge>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-4 text-edge">
                {property.title}
              </h1>
              
              <div className="flex items-center text-lg text-white/90 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.city}, {property.country}</span>
              </div>

              <p className="text-xl text-white/90 max-w-2xl">
                {property.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <Section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Quick Stats */}
              <RevealOnScroll>
                <div className="flex items-center gap-8 text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{property.maxGuests} ospiti</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <span>{property.bedrooms} camere</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span>{property.bathrooms} bagni</span>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Description */}
              <RevealOnScroll delay={0.1}>
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-semibold">
                    Un'esperienza di lusso autentico
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    {property.longDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>

              {/* Amenities */}
              <RevealOnScroll delay={0.2}>
                <div className="space-y-8">
                  <h3 className="text-2xl md:text-3xl font-semibold">
                    Servizi inclusi
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || CheckCircle
                      return (
                        <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <RevealOnScroll delay={0.3}>
                <div className="sticky top-24">
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                    <div className="space-y-6">
                      {/* Price */}
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          €{property.pricePerNight}
                        </div>
                        <p className="text-muted-foreground">per notte</p>
                      </div>

                      {/* Booking Form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                              Check-in
                            </label>
                            <input 
                              type="date" 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                              Check-out
                            </label>
                            <input 
                              type="date" 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            Ospiti
                          </label>
                          <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            {Array.from({length: property.maxGuests}, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} {i === 0 ? 'ospite' : 'ospiti'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Booking Button */}
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold">
                        Prenota Ora
                      </Button>

                      {/* Contact Options */}
                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-muted-foreground mb-4">
                          Hai domande? Contattaci
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="py-3">
                            <Home className="w-4 h-4 mr-2" />
                            Chiama
                          </Button>
                          <Button variant="outline" className="py-3">
                            <Calendar className="w-4 h-4 mr-2" />
                            Messaggio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </Section>

      {/* Location */}
      <Section className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h6 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Posizione
              </h6>
              <h2 className="text-4xl md:text-5xl font-semibold text-edge">
                Nel cuore della Costa Amalfitana
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span className="font-medium">{property.address}, {property.city}</span>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Casa Fienaroli si trova in una posizione privilegiata, a soli 5 minuti a piedi 
                  dal centro di Positano e dalle sue spiagge più belle. La location perfetta per 
                  esplorare tutta la costa amalfitana.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div>
                    <p className="font-semibold mb-2">Centro di Positano</p>
                    <p className="text-muted-foreground">5 min a piedi</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Spiaggia Grande</p>
                    <p className="text-muted-foreground">3 min a piedi</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Amalfi</p>
                    <p className="text-muted-foreground">20 min in auto</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Ravello</p>
                    <p className="text-muted-foreground">35 min in auto</p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gray-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-600 font-medium">Mappa Interattiva</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-edge">
              Pronto per il tuo soggiorno da sogno?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Casa Fienaroli ti aspetta per un'esperienza indimenticabile sulla costa amalfitana
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Prenota Ora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold">
                Contattaci
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </Section>
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
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <ClientOnly fallback={<div className={className}>{children}</div>}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </ClientOnly>
  )
}