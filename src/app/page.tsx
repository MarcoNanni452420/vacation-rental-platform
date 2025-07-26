"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Users, ChevronDown } from "lucide-react"
import { ClientOnly } from "@/components/ui/client-only"

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <main className="bg-white overflow-hidden">
      {/* Hero Section - Full Height with Video/Image Background */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/villa/bedroom-master.jpg"
            alt="Casa Fienaroli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-6">
          <div className="animate-fade-up">
            <h6 className="text-sm uppercase tracking-[0.3em] mb-6 font-medium">
              Trastevere, Roma
            </h6>
          </div>
          
          <h1 className="text-edge mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Casa Fienaroli
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light text-white/90 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            Un rifugio esclusivo dove il lusso incontra la tradizione italiana, 
            nel cuore di Roma, tra i vicoli storici di Trastevere
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <Link 
              href="/property" 
              className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
            >
              Scopri la Villa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="#availability" 
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              Verifica Disponibilità
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Introduction Section */}
      <Section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <RevealOnScroll>
              <div className="space-y-8">
                <h6 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Benvenuti
                </h6>
                <h2 className="text-edge">
                  Un'esperienza di lusso autentico sulla costa amalfitana
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Casa Fienaroli rappresenta l'essenza del vivere romano, 
                    dove ogni dettaglio è stato curato per offrire un'esperienza 
                    indimenticabile.
                  </p>
                  <p>
                    Quattro camere da letto elegantemente arredate, tre bagni in 
                    marmo di Carrara, e spazi living che si aprono su terrazze 
                    panoramiche con vista sui tetti di Roma.
                  </p>
                </div>
                <Link 
                  href="/property" 
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider underline-link"
                >
                  Esplora gli interni
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.2}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 bg-gray-200" />
                <div className="absolute bottom-0 right-0 bg-white p-8 w-48">
                  <p className="text-6xl font-light mb-2">450€</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">A notte</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </Section>

      {/* Features Grid - Modern Asymmetric Layout */}
      <Section className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <h6 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Caratteristiche
              </h6>
              <h2 className="text-edge max-w-4xl mx-auto">
                Tutto ciò che serve per una vacanza perfetta
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {[
              { title: "8 Ospiti", desc: "Spazio per tutta la famiglia" },
              { title: "4 Camere", desc: "Ognuna con vista sui tetti" },
              { title: "3 Bagni", desc: "In marmo di Carrara" },
              { title: "Piscina Privata", desc: "Riscaldata tutto l'anno" },
              { title: "Cucina Gourmet", desc: "Completamente attrezzata" },
              { title: "WiFi Veloce", desc: "In tutta la proprietà" }
            ].map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <div className="bg-white p-12 hover:bg-gray-50 transition-colors duration-300">
                  <h4 className="text-2xl mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Section>

      {/* Gallery Preview - Editorial Style */}
      <Section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <RevealOnScroll className="col-span-2 row-span-2">
              <div className="relative aspect-square overflow-hidden group">
                <img 
                  src="/images/villa/interior-overview.jpg"
                  alt="Villa Overview"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-700" />
              </div>
            </RevealOnScroll>
            
            {[
              "/images/villa/kitchen-1.jpg",
              "/images/villa/bathroom-1.jpg", 
              "/images/villa/bedroom-elegant.jpg",
              "/images/villa/bedroom-rustic.jpg",
              "/images/villa/bedroom-master.jpg"
            ].map((image, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div className="relative aspect-square overflow-hidden group">
                  <img 
                    src={image}
                    alt={`Villa Interior ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-700" />
                </div>
              </RevealOnScroll>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/property#gallery" 
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider underline-link"
            >
              Vedi tutte le foto
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Availability Section */}
      <Section id="availability" className="bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h6 className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-6">
              Prenota il tuo soggiorno
            </h6>
            <h2 className="text-edge mb-12">
              Verifica la disponibilità
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="space-y-3">
                <label className="text-sm uppercase tracking-wider text-gray-400">Check-in</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm uppercase tracking-wider text-gray-400">Check-out</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm uppercase tracking-wider text-gray-400">Ospiti</label>
                <div className="relative">
                  <select className="w-full bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:border-white transition-colors appearance-none">
                    <option value="1">1 Ospite</option>
                    <option value="2">2 Ospiti</option>
                    <option value="3">3 Ospiti</option>
                    <option value="4">4 Ospiti</option>
                    <option value="5">5 Ospiti</option>
                    <option value="6">6 Ospiti</option>
                    <option value="7">7 Ospiti</option>
                    <option value="8">8 Ospiti</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="bg-white text-black px-12 py-5 font-medium text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors duration-300">
              Verifica Disponibilità
            </button>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Testimonials - Modern Cards */}
      <Section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <h6 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Recensioni
              </h6>
              <h2 className="text-edge max-w-3xl mx-auto">
                Cosa dicono i nostri ospiti
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marco R.",
                date: "Luglio 2024",
                text: "Un'esperienza incredibile. La vista dalla terrazza è qualcosa che non dimenticherò mai. Servizio impeccabile."
              },
              {
                name: "Sofia B.",
                date: "Giugno 2024",
                text: "La villa supera ogni aspettativa. Gli interni sono stupendi e la posizione è perfetta per esplorare la costa."
              },
              {
                name: "Alessandro T.",
                date: "Maggio 2024",
                text: "Lusso e comfort in ogni dettaglio. La piscina privata e gli spazi esterni sono semplicemente magnifici."
              }
            ].map((review, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <div className="border-t pt-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-edge mb-8">
              Pronto per un'esperienza indimenticabile?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Prenota il tuo soggiorno a Casa Fienaroli e vivi la magia di Roma
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/property" 
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
              >
                Prenota Ora
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-3 border-2 border-black text-black px-8 py-4 font-medium text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
              >
                Contattaci
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </Section>
    </main>
  )
}

// Section Component with consistent padding
function Section({ children, className = "", ...props }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section className={`section-padding ${className}`} {...props}>
      <div className="container-padding">
        {children}
      </div>
    </section>
  )
}

// Reveal on Scroll Component  
function RevealOnScroll({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ 
        transitionDelay: isVisible ? `${delay * 100}ms` : '0ms'
      }}
    >
      {children}
    </div>
  )
}