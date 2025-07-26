import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockProperties, formatCurrency } from "@/lib/mock-data"
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
  CreditCard
} from "lucide-react"
import { notFound } from "next/navigation"

const amenityIcons = {
  "WiFi": Wifi,
  "Piscina": Waves,
  "Vista Mare": Waves,
  "Giardino": Trees,
  "Parcheggio": Car,
  "Aria Condizionata": Waves,
  "Centro Storico": MapPin,
  "Cucina Attrezzata": MapPin,
}

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  const property = mockProperties.find(p => p.id === `prop_${id.padStart(3, '0')}`)
  
  if (!property) {
    notFound()
  }

  const getAmenityIcon = (amenity: string) => {
    const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || MapPin
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="h-96 md:h-[500px] bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mb-8 relative">
          <div className="absolute top-6 left-6">
            <Badge className="bg-white text-gray-800 shadow-lg">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              4.8 (24 recensioni)
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.address}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-lg mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.maxGuests} ospiti</span>
                </div>
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.bedrooms} camere</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.bathrooms} bagni</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Servizi Inclusi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Posizione</CardTitle>
                <CardDescription>
                  {property.city}, {property.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Mappa interattiva</p>
                    <p className="text-sm">Google Maps integrazione</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Recensioni degli Ospiti</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.8</span>
                  <span className="text-gray-600">(24 recensioni)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                        {i === 1 ? "M" : i === 2 ? "S" : "A"}
                      </div>
                      <div>
                        <p className="font-medium">
                          {i === 1 ? "Marco R." : i === 2 ? "Sofia B." : "Alessandro T."}
                        </p>
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {i === 1 
                        ? "Posto fantastico! La vista è mozzafiato e la casa è esattamente come nelle foto. Torneremo sicuramente!" 
                        : i === 2 
                        ? "Perfetto per una fuga romantica. Host molto disponibile e casa pulitissima."
                        : "Location eccezionale, a due passi dal centro ma in zona tranquilla. Consigliatissimo!"}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(property.pricePerNight)}
                    </span>
                    <span className="text-gray-600 ml-1">/notte</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Disponibile
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="date"
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="date"
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Ospiti</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="number"
                      min="1"
                      max={property.maxGuests}
                      defaultValue="2"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>€150 x 3 notti</span>
                    <span>€450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tassa di pulizia</span>
                    <span>€50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tassa di soggiorno</span>
                    <span>€15</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Totale</span>
                    <span>€515</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Prenota Ora
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Non verrai addebitato subito
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}