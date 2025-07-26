import Link from "next/link"
import { Home, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">VacationRental Pro</span>
            </div>
            <p className="text-gray-300 mb-4">
              La piattaforma completa per gestire e pubblicizzare le tue case vacanza. 
              Unifica le prenotazioni da Airbnb, Booking.com e il tuo sito in un&apos;unica dashboard.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-300 hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-primary">
                Termini di Servizio
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Link Utili</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-primary">
                  Tutte le Proprietà
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary">
                  Contattaci
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-primary">
                  Dashboard Host
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contatti</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-300">info@vacationrental.pro</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300">+39 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-300">Milano, Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 VacationRental Pro. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}