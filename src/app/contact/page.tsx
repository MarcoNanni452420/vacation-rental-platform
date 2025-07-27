"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
// import { useTranslations } from 'next-intl'

const contactSchema = z.object({
  name: z.string().min(2, 'Il nome deve avere almeno 2 caratteri'),
  email: z.string().email('Email non valida'),
  message: z.string().min(10, 'Il messaggio deve avere almeno 10 caratteri')
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const t = useTranslations('contact')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Errore nell\'invio del messaggio')
      }

      toast.success('Messaggio inviato con successo! Ti risponderemo al più presto.')
      reset()
    } catch (error) {
      toast.error('Si è verificato un errore. Riprova più tardi.')
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contattaci</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hai domande sulle nostre proprietà o vuoi prenotare il tuo soggiorno? 
            Siamo qui per aiutarti.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Invia un messaggio</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    placeholder="Il tuo nome"
                    {...register('name')}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="La tua email"
                    {...register('email')}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea
                    id="message"
                    placeholder="Come possiamo aiutarti?"
                    rows={6}
                    {...register('message')}
                    className="mt-2"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Invia messaggio
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informazioni di contatto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@trastivereiluxury.com</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ti risponderemo entro 24 ore
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefono</h3>
                    <p className="text-muted-foreground">+39 06 123 4567</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lun-Ven 9:00-18:00
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Posizione</h3>
                    <p className="text-muted-foreground">Trastevere, Roma</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le nostre proprietà si trovano nel cuore di Trastevere
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-12 p-6 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">Domande frequenti</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Check-in dalle 15:00, check-out entro le 11:00</li>
                  <li>• Soggiorno minimo di 2 notti</li>
                  <li>• Accettiamo animali domestici di piccola taglia</li>
                  <li>• WiFi gratuito in entrambe le proprietà</li>
                  <li>• Servizio di pulizie giornaliero disponibile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}