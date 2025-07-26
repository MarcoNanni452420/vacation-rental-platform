"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Le password non corrispondono")
      return false
    }
    if (formData.password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      } else {
        setError(data.error || "Errore durante la registrazione")
      }
    } catch (error) {
      setError("Errore durante la registrazione")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Account creato con successo!</h1>
          <p className="text-muted-foreground mb-6">
            Ti stiamo reindirizzando alla pagina di login...
          </p>
          <Link href="/auth/signin">
            <Button>Vai al Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Hero Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img 
          src="/images/villa/kitchen-1.jpg"
          alt="Casa Fienaroli"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-end p-12">
          <div className="text-white animate-fade-up">
            <h2 className="text-4xl font-bold mb-4">
              Unisciti a Casa Fienaroli
            </h2>
            <p className="text-lg text-white/90 max-w-md">
              Crea il tuo account e scopri l'esperienza esclusiva di Roma. 
              Prenota il tuo soggiorno da sogno.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
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
                  Crea Account
                </h1>
                <p className="text-lg text-muted-foreground">
                  Registrati per accedere a Casa Fienaroli
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
                      Nome completo
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                      placeholder="Il tuo nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Conferma password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-12 pr-12"
                        placeholder="Ripeti la password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
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
                  {isLoading ? "Creazione account..." : "Crea Account"}
                </Button>
              </form>

              {/* Sign in link */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Hai già un account?{" "}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-foreground hover:underline"
                  >
                    Accedi qui
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  Creando un account accetti i nostri{" "}
                  <Link href="/terms" className="underline hover:no-underline">
                    Termini di Servizio
                  </Link>{" "}
                  e la{" "}
                  <Link href="/privacy" className="underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}