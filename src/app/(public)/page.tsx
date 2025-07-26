import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Calendar, Users, Star, TrendingUp, Shield, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Le Migliori Case Vacanza
              <span className="block text-primary">in Italia</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scopri alloggi unici e indimenticabili per le tue vacanze. 
              Dalle città d&apos;arte alle spiagge più belle, trova la casa perfetta per te.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destinazione</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Dove vuoi andare?"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="date"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="date"
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
                      max="10"
                      defaultValue="2"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button size="lg" className="w-full md:w-auto px-8" asChild>
                  <Link href="/properties">
                    Cerca Proprietà
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proprietà in Evidenza
            </h2>
            <p className="text-xl text-gray-600">
              Scopri le nostre case vacanza più apprezzate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 relative">
                  <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium">
                    <Star className="inline h-4 w-4 text-yellow-400 mr-1" />
                    4.9
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Villa sul Mare - Amalfi</CardTitle>
                  <CardDescription>
                    Splendida villa con vista mozzafiato sulla costiera amalfitana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span>4 ospiti • 2 camere • 2 bagni</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">€150</span>
                      <span className="text-gray-600">/notte</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href={`/properties/${i}`}>
                      Vedi Dettagli
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/properties">
                Vedi Tutte le Proprietà
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perché Scegliere VacationRental Pro
            </h2>
            <p className="text-xl text-gray-600">
              La tua esperienza di viaggio inizia con noi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Sicurezza Garantita</h3>
              <p className="text-gray-600">
                Tutte le nostre proprietà sono verificate e assicurate per la tua tranquillità
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Supporto 24/7</h3>
              <p className="text-gray-600">
                Il nostro team è sempre disponibile per aiutarti durante il tuo soggiorno
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Prezzi Competitivi</h3>
              <p className="text-gray-600">
                Offriamo sempre il miglior rapporto qualità-prezzo per le tue vacanze
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sei un Proprietario?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Unisciti alla nostra piattaforma e gestisci tutte le tue prenotazioni 
            da Airbnb, Booking.com e sito diretto in un&apos;unica dashboard
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">
                Registrati Come Host
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/admin">
                Accedi alla Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}