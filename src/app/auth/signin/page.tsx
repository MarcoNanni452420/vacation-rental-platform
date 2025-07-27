"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenziali non valide")
      } else {
        // Get the updated session to check user role
        const session = await getSession()
        
        if (session?.user?.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }
    } catch {
      setError("Errore durante il login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-12">
        <div className="max-w-md w-full">
          <div className="animate-fade-up">
              {/* Header */}
              <div className="mb-12">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Torna alla Home
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Bentornato
                </h1>
                <p className="text-lg text-muted-foreground">
                  Accedi al tuo account Casa Fienaroli
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-up">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                      placeholder="inserisci@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pr-12"
                        placeholder="La tua password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                >
                  {isLoading ? "Accesso in corso..." : "Accedi"}
                </Button>
              </form>

              {/* Sign up link */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Non hai ancora un account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-foreground hover:underline"
                  >
                    Registrati qui
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  Account Demo
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Admin:</strong> admin@vacationrental.com / admin123</p>
                  <p><strong>Guest:</strong> guest@demo.com / password123</p>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img 
          src="/images/villa/bedroom-elegant.jpg"
          alt="Casa Fienaroli"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-end p-12">
          <div className="text-white animate-fade-up">
            <h2 className="text-4xl font-bold mb-4">
              Casa Fienaroli
            </h2>
            <p className="text-lg text-white/90 max-w-md">
              Il tuo rifugio esclusivo nel cuore di Roma. 
              Gestisci le tue prenotazioni e scopri l&apos;esperienza del lusso autentico.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}