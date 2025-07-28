export interface Property {
  id: string
  slug: string
  name: string
  location: string
  shortDesc: string
  description: string
  longDescription: string
  features: string[]
  price: number
  theme: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  rating: number
  reviews: number
  images: string[]
}

export const properties: Record<string, Property> = {
  fienaroli: {
    id: "casa-fienaroli",
    slug: "fienaroli",
    name: "Casa Fienaroli",
    location: "Via dei Fienaroli, Trastevere",
    shortDesc: "Design contemporaneo e travi a vista nel cuore di Roma",
    description: "Vivi l'atmosfera di Trastevere, cuore di Roma, e gli spazi comodi di questa bellissima proprietà! Dettagli di design e pareti di vetro che si sposano con travi a vista e porte antiche dal fascino impagabile.",
    longDescription: `Ampio appartamento in Via dei Fienaroli, nel centro di Trastevere!
    
Una società di design ha ristrutturato ed arredato questo ampio appartamento di 80 metri quadri, riuscendo a creare un ambiente caldo e confortevole con arredi e materiali particolari, in grado di catturare l'attenzione!

L'intero appartamento è a vostro esclusivo utilizzo ed è così composto:
- ampio salone con divano letto matrimoniale, tavolo da pranzo, tv ed aria condizionata
- Grande piano cucina completamente accessoriato per preparare i pasti, dotato di piastre ad induzione, macchina per il caffè NESPRESSO, forno e lavastoviglie
- ampia camera con parete a vetri con letto matrimoniale, aria condizionata e tv
- bagno con ampia cabina doccia, wc, bidet e lavandino con base in legno
- camera da letto con letto matrimoniale (da notare la testiera del letto) con aria condizionata, tv e bagno in camera. Il bagno privato è dotato di cabina doccia, wc, bidet e lavandino ed ha 2 pareti in vetro, una vera particolarità!

L'appartamento è in una posizione fantastica, a pochi metri dalla movida ma in un angolo tranquillo dai rumori, a 50 mt dalla casa ci sono negozi, market, bar e deliziosi ristorantini. La macchina non è necessaria e con una breve passeggiata potrete raggiungere Piazza Navona, Piazza Venezia ecc.!`,
    features: ["80 mq", "2 camere", "2 bagni", "Aria condizionata", "WiFi veloce", "Cucina attrezzata"],
    price: 250,
    theme: "fienaroli",
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "WiFi",
      "Aria Condizionata",
      "Cucina Attrezzata",
      "Lavastoviglie",
      "Lavatrice/Asciugatrice",
      "TV in ogni stanza",
      "Macchina caffè Nespresso",
      "Forno",
      "Design esclusivo",
      "Travi a vista",
      "Pareti in vetro"
    ],
    rating: 4.9,
    reviews: 127,
    images: [
      "/images/fienaroli/hero-main.avif",
      "/images/fienaroli/living-space.avif",
      "/images/fienaroli/modern-design.avif",
      "/images/fienaroli/detail-glass.avif",
      "/images/fienaroli/bedroom-new-1.jpg",
      "/images/fienaroli/bedroom-new-2.jpg",
      "/images/fienaroli/kitchen-1.jpg",
      "/images/fienaroli/bathroom-1.jpg",
      "/images/fienaroli/bedroom-elegant.jpg",
      "/images/fienaroli/bedroom-rustic.jpg"
    ]
  },
  moro: {
    id: "casa-moro",
    slug: "moro",
    name: "Casa Moro",
    location: "Cuore di Trastevere",
    shortDesc: "Soffitti del 1400 e lusso moderno tra Santa Maria e fontana Trilussa",
    description: "Nel cuore di Trastevere abbiamo ristrutturato questo appartamento con materiali pregiati, abbinando soluzioni moderne e lussuose, mantenendo i soffitti in legno del 1400.",
    longDescription: `Nel cuore di Trastevere tra Santa Maria e fontana Trilussa abbiamo ristrutturato questo appartamento con materiali pregiati, abbinando soluzioni moderne e lussuose, mantenendo i soffitti in legno del 1400 ed una parte dei pavimenti originali, dove respirare un atmosfera particolare della Roma papale.

L'appartamento presenta:
- Soffitti in legno originali del 1400 restaurati
- Pavimenti antichi parzialmente conservati
- Bagno di lusso con marmi pregiati e doccia walk-in in vetro
- Cucina moderna con piano in terracotta e elettrodomestici di ultima generazione
- Camera padronale con vista caratteristica
- Seconda camera elegante
- Finiture di pregio e opere d'arte originali

Passeggiare per i vicoli e gustare la vera cucina romana nelle tante trattorie tradizionali. Traversare il Tevere e raggiungere rapidamente Piazza Navona, il Pantheon e le meraviglie Romane.

La posizione strategica permette di vivere l'autentica atmosfera trasteverina rimanendo a pochi passi dalle principali attrazioni turistiche.`,
    features: ["Soffitti del 1400", "Materiali pregiati", "Vista caratteristica", "Posizione centrale"],
    price: 300,
    theme: "moro",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "Aria Condizionata",
      "Cucina di design",
      "Lavastoviglie",
      "Lavatrice",
      "TV",
      "Macchina caffè",
      "Forno moderno",
      "Soffitti storici",
      "Marmi pregiati",
      "Opere d'arte",
      "Doccia walk-in"
    ],
    rating: 5.0,
    reviews: 89,
    images: [
      "/images/moro/detail-ceiling.jpg",
      "/images/moro/bedroom-elegant-new.jpg",
      "/images/moro/bedroom-master.jpg",
      "/images/moro/living.jpg",
      "/images/moro/bathroom-luxury.jpg",
      "/images/moro/kitchen.jpg",
      "/images/moro/bedroom-2.jpg",
      "/images/moro/corridor.jpg",
      "/images/moro/detail-art.jpg",
      "/images/moro/overview.jpg"
    ]
  }
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties[slug]
}

export function getAllProperties(): Property[] {
  return Object.values(properties)
}