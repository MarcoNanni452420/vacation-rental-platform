"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  Users, 
  Bed, 
  Bath, 
  MapPin, 
  Wifi,
  Car,
  Waves,
  Heart
} from "lucide-react"
import { formatCurrency } from "@/lib/mock-data"
import { useState } from "react"
import { useIsClient } from "@/hooks/useIsClient"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    city: string
    country: string
    pricePerNight: number
    maxGuests: number
    bedrooms: number
    bathrooms: number
    amenities: string[]
    images: string[]
    isActive: boolean
  }
  index?: number
}

const amenityIcons = {
  "WiFi": Wifi,
  "Piscina": Waves,
  "Vista Mare": Waves,
  "Parcheggio": Car,
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const isClient = useIsClient()

  return (
    <motion.div
      initial={isClient ? { opacity: 0, y: 50 } : {}}
      animate={isClient ? { opacity: 1, y: 0 } : {}}
      transition={isClient ? { duration: 0.5, delay: index * 0.1 } : {}}
      whileHover={isClient ? { y: -8 } : {}}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          {!imageError ? (
            <motion.div
              className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center text-primary/60">
                <Waves className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm font-medium">Vista Panoramica</p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Immagine non disponibile</span>
            </div>
          )}
          
          {/* Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-800 shadow-lg border-0">
              <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
              4.9
            </Badge>
          </div>

          {/* Like Button */}
          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </motion.button>

          {/* Status Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className={`${
              property.isActive 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {property.isActive ? 'Disponibile' : 'Non disponibile'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.city}, {property.country}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          {/* Amenities */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {property.maxGuests}
            </div>
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms}
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </div>
          </div>

          {/* Featured Amenities */}
          <div className="flex gap-2 mb-6">
            {property.amenities.slice(0, 3).map((amenity, i) => {
              const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || Wifi
              return (
                <div key={i} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  <Icon className="h-3 w-3" />
                  <span>{amenity}</span>
                </div>
              )
            })}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(property.pricePerNight)}
              </span>
              <span className="text-gray-600 text-sm ml-1">/notte</span>
            </div>
            
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href={`/properties/${property.id.split('_')[1]}`}>
                Dettagli
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}