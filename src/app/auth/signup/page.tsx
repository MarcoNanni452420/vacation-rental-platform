"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Eye, EyeOff } from "lucide-react"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "GUEST" as "GUEST" | "HOST",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Le password non coincidono")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri")
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
          role: formData.role,
        }),
      })

      if (response.ok) {
        router.push("/auth/signin?message=Registrazione completata! Ora puoi accedere.")
      } else {
        const data = await response.json()
        setError(data.error || "Errore durante la registrazione")
      }
    } catch (error) {
      setError("Errore durante la registrazione")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Home className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-gray-900">
              VacationRental Pro
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crea il tuo account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hai già un account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary/80"
            >
              Accedi qui
            </Link>
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Registrazione</CardTitle>
            <CardDescription>
              Compila i campi per creare il tuo account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="tua@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Almeno 6 caratteri"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Conferma Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Ripeti la password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo di Account
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="guest"
                      name="role"
                      type="radio"
                      value="GUEST"
                      checked={formData.role === "GUEST"}
                      onChange={handleInputChange}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label htmlFor="guest" className="ml-3 block text-sm font-medium text-gray-700">
                      Ospite - Voglio prenotare case vacanza
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="host"
                      name="role"
                      type="radio"
                      value="HOST"
                      checked={formData.role === "HOST"}
                      onChange={handleInputChange}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label htmlFor="host" className="ml-3 block text-sm font-medium text-gray-700">
                      Host - Voglio gestire le mie proprietà
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrati"}
              </Button>
            </form>

            <div className="mt-6 text-xs text-gray-500 text-center">
              Registrandoti accetti i nostri{" "}
              <Link href="/terms" className="text-primary hover:text-primary/80">
                Termini di Servizio
              </Link>{" "}
              e la{" "}
              <Link href="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}