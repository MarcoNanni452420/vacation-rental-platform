// Mock API data for dashboard demo

export const mockPlatformMetrics = [
  {
    platform: "AIRBNB",
    date: "2025-01-20",
    views: 245,
    clicks: 32,
    bookings: 4,
    revenue: 85000, // €850.00
  },
  {
    platform: "BOOKING",
    date: "2025-01-20",
    views: 189,
    clicks: 28,
    bookings: 3,
    revenue: 67500, // €675.00
  },
  {
    platform: "DIRECT",
    date: "2025-01-20",
    views: 156,
    clicks: 24,
    bookings: 2,
    revenue: 45000, // €450.00
  },
  {
    platform: "AIRBNB",
    date: "2025-01-19",
    views: 267,
    clicks: 35,
    bookings: 5,
    revenue: 92500,
  },
  {
    platform: "BOOKING",
    date: "2025-01-19",
    views: 201,
    clicks: 31,
    bookings: 4,
    revenue: 78000,
  },
  {
    platform: "DIRECT",
    date: "2025-01-19",
    views: 143,
    clicks: 19,
    bookings: 1,
    revenue: 22500,
  },
]

export const mockAdCampaigns = [
  {
    platform: "GOOGLE_ADS",
    campaignId: "gads_001",
    name: "Casa Vacanza Estate 2025",
    status: "ACTIVE",
    budget: 50000, // €500.00
    spend: 32400, // €324.00
    impressions: 15430,
    clicks: 547,
    conversions: 23,
  },
  {
    platform: "META_ADS",
    campaignId: "meta_001",
    name: "Villa Toscana - Awareness",
    status: "ACTIVE",
    budget: 40000, // €400.00
    spend: 28750, // €287.50
    impressions: 12890,
    clicks: 432,
    conversions: 18,
  },
  {
    platform: "GOOGLE_ADS",
    campaignId: "gads_002",
    name: "Appartamento Milano Centro",
    status: "PAUSED",
    budget: 30000, // €300.00
    spend: 15600, // €156.00
    impressions: 8920,
    clicks: 234,
    conversions: 12,
  },
]

export const mockRecentBookings = [
  {
    id: "booking_001",
    guestName: "Marco Rossi",
    propertyTitle: "Villa sul Mare - Amalfi",
    checkIn: "2025-02-15",
    checkOut: "2025-02-22",
    guests: 4,
    totalAmount: 105000, // €1,050.00
    status: "CONFIRMED",
    platform: "AIRBNB",
  },
  {
    id: "booking_002",
    guestName: "Sofia Bianchi",
    propertyTitle: "Appartamento Centro - Firenze",
    checkIn: "2025-02-08",
    checkOut: "2025-02-12",
    guests: 2,
    totalAmount: 48000, // €480.00
    status: "PENDING",
    platform: "DIRECT",
  },
  {
    id: "booking_003",
    guestName: "Alex Johnson",
    propertyTitle: "Casa Rustica - Chianti",
    checkIn: "2025-02-20",
    checkOut: "2025-02-27",
    guests: 6,
    totalAmount: 84000, // €840.00
    status: "CONFIRMED",
    platform: "BOOKING",
  },
]

export const mockProperties = [
  {
    id: "prop_001",
    title: "Villa sul Mare - Amalfi",
    description: "Splendida villa con vista mozzafiato sulla costiera amalfitana",
    address: "Via Duomo 15, Amalfi",
    city: "Amalfi",
    country: "Italia",
    pricePerNight: 15000, // €150.00
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["WiFi", "Piscina", "Vista Mare", "Giardino", "Parcheggio"],
    images: ["/images/villa-amalfi-1.jpg", "/images/villa-amalfi-2.jpg"],
    isActive: true,
  },
  {
    id: "prop_002",
    title: "Appartamento Centro - Firenze",
    description: "Elegante appartamento nel cuore storico di Firenze",
    address: "Via dei Calzaiuoli 45, Firenze",
    city: "Firenze",
    country: "Italia",
    pricePerNight: 12000, // €120.00
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Aria Condizionata", "Centro Storico", "Cucina Attrezzata"],
    images: ["/images/apt-firenze-1.jpg", "/images/apt-firenze-2.jpg"],
    isActive: true,
  },
]

// Helper function to parse JSON amenities and images from database
export function parsePropertyFromDB(property: any) {
  return {
    ...property,
    amenities: typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities,
    images: typeof property.images === 'string' ? JSON.parse(property.images) : property.images,
  }
}

export const mockInsights = [
  {
    type: "success",
    title: "Campagna Google Ads in Performance",
    message: "La campagna 'Casa Vacanza Estate 2025' ha un CTR del 3.5%, superiore alla media del settore",
    action: "Considera di aumentare il budget per massimizzare i risultati",
  },
  {
    type: "warning", 
    title: "Prenotazioni in Calo su Booking.com",
    message: "Le prenotazioni da Booking.com sono diminuite del 15% questa settimana",
    action: "Verifica i prezzi competitivi e aggiorna le foto della proprietà",
  },
  {
    type: "info",
    title: "Nuove Recensioni Ricevute",
    message: "Hai ricevuto 3 nuove recensioni positive (4.8/5 stelle di media)",
    action: "Ringrazia gli ospiti e condividi sui social media",
  },
]

export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}