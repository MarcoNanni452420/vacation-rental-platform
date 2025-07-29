"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

// Schema will be created dynamically with translations
function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('validation.nameMin')),
    email: z.string().email(t('validation.emailInvalid')),
    message: z.string().min(10, t('validation.messageMin'))
  })
}

type ContactFormData = {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations('contact')
  
  const contactSchema = createContactSchema(t)

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
        throw new Error(t('messages.submitError'))
      }

      toast.success(t('messages.success'))
      reset()
    } catch (error) {
      toast.error(t('messages.error'))
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('sendMessage')}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">{t('form.name')} {t('form.required')}</Label>
                  <Input
                    id="name"
                    placeholder={t('form.namePlaceholder')}
                    {...register('name')}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t('form.email')} {t('form.required')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('form.emailPlaceholder')}
                    {...register('email')}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">{t('form.message')} {t('form.required')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('form.messagePlaceholder')}
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
                      {t('form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('form.send')}
                    </>
                  )}
                </Button>
              </form>
              
              {/* FAQ Section */}
              <div className="mt-16 p-8 bg-muted rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">{t('faq.title')}</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{t('faq.checkInOut')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{t('faq.minimumStay')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{t('faq.pets')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{t('faq.wifi')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{t('faq.cleaningService')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}