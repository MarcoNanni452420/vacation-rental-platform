"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Home, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-gray-900">
                VacationRental Pro
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-primary">
              Proprietà
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary">
              Chi Siamo
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary">
              Contatti
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/account" className="text-gray-700 hover:text-primary">
                  Account
                </Link>
                {(session.user.role === "HOST" || session.user.role === "ADMIN") && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary">
                    Dashboard
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                  className="text-sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Accedi</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Registrati</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/properties"
                className="block px-3 py-2 text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Proprietà
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Chi Siamo
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contatti
              </Link>
              
              {session ? (
                <div className="space-y-1">
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  {(session.user.role === "HOST" || session.user.role === "ADMIN") && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accedi
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrati
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}