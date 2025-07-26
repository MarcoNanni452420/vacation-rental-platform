import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Star, Users, Bed, Bath, MapPin, Filter } from "lucide-react"
import { mockProperties, formatCurrency } from "@/lib/mock-data"

export default function PropertiesPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tutte le Proprietà
          </h1>
          <p className="text-xl text-gray-600">
            Scopri la nostra selezione di case vacanza uniche
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Destinazione</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Cerca città o regione"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ospiti</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="number"
                  min="1"
                  max="12"
                  defaultValue="2"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prezzo massimo</label>
              <Input 
                type="number"
                placeholder="€ per notte"
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button className="flex-1">
                Cerca
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              {/* Image */}
              <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/10 relative">
                <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium shadow-lg">
                  <Star className="inline h-4 w-4 text-yellow-400 mr-1" />
                  4.8
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium shadow-lg">
                  {property.isActive ? "Disponibile" : "Non disponibile"}
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.city}, {property.country}
                    </div>
                  </div>
                </div>
                
                <CardDescription className="line-clamp-2">
                  {property.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Amenities */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {property.maxGuests} ospiti
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} camere
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} bagni
                  </div>
                </div>

                {/* Amenities tags */}
                <div className="flex flex-wrap gap-2">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{property.amenities.length - 3} altri
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(property.pricePerNight)}
                    </span>
                    <span className="text-gray-600 ml-1">/notte</span>
                  </div>
                  <Button asChild>
                    <Link href={`/properties/${property.id}`}>
                      Vedi Dettagli
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add more properties placeholder */}
          {[4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden opacity-60">
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    Prossimamente
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-gray-400">
                  Nuova Proprietà in Arrivo
                </CardTitle>
                <CardDescription>
                  Stiamo aggiungendo nuove fantastiche proprietà alla nostra collezione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  In Arrivo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-12 flex justify-center space-x-2">
          <Button variant="outline" disabled>
            Precedente
          </Button>
          <Button variant="outline" className="bg-primary text-white">
            1
          </Button>
          <Button variant="outline">
            2
          </Button>
          <Button variant="outline">
            3
          </Button>
          <Button variant="outline">
            Successivo
          </Button>
        </div>
      </div>
    </div>
  )
}