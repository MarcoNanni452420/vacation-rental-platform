import { PrismaClient, UserRole, Platform } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@vacationrental.com" },
    update: {},
    create: {
      email: "admin@vacationrental.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log("Created admin user:", admin)

  // Create test guest user
  const guestPassword = await hash("guest123", 12)
  const guest = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: {
      email: "guest@example.com",
      name: "Test Guest",
      password: guestPassword,
      role: UserRole.GUEST,
    },
  })

  console.log("Created guest user:", guest)

  // Create single property
  const property = await prisma.property.upsert({
    where: { id: "villa-paradiso" },
    update: {},
    create: {
      id: "villa-paradiso",
      title: "Casa Fienaroli - Vista Mare Mozzafiato",
      description: "Una villa esclusiva con vista panoramica sul mare, perfetta per una vacanza di lusso. Situata sulla costa amalfitana, questa proprietà offre privacy, comfort e accesso diretto alla spiaggia privata. Gli interni sono arredati con gusto, combinando eleganza moderna con il fascino tradizionale italiano.",
      address: "Via Marina Grande, 123",
      city: "Positano",
      country: "Italia",
      pricePerNight: 45000, // €450 per night
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: JSON.stringify([
        "WiFi",
        "Piscina",
        "Vista Mare",
        "Aria Condizionata",
        "Cucina Attrezzata",
        "Giardino",
        "Parcheggio",
        "Terrazza Panoramica",
        "BBQ",
        "Jacuzzi",
        "Spiaggia Privata",
        "Servizio Pulizie"
      ]),
      images: JSON.stringify([
        "/images/villa-1.jpg",
        "/images/villa-2.jpg",
        "/images/villa-3.jpg",
        "/images/villa-4.jpg",
        "/images/villa-5.jpg",
        "/images/villa-6.jpg",
        "/images/villa-7.jpg",
        "/images/villa-8.jpg",
      ]),
      ownerId: admin.id,
    },
  })

  console.log("Created property:", property)

  // Create some bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        checkIn: new Date("2024-07-15"),
        checkOut: new Date("2024-07-22"),
        guests: 6,
        totalAmount: 315000, // €3,150
        status: "COMPLETED",
        guestId: guest.id,
        propertyId: property.id,
      },
    }),
    prisma.booking.create({
      data: {
        checkIn: new Date("2024-08-01"),
        checkOut: new Date("2024-08-10"),
        guests: 4,
        totalAmount: 405000, // €4,050
        status: "CONFIRMED",
        guestId: guest.id,
        propertyId: property.id,
      },
    }),
  ])

  console.log("Created bookings:", bookings.length)

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Posto fantastico! La vista è mozzafiato e la casa è esattamente come nelle foto. Torneremo sicuramente!",
        guestId: guest.id,
        propertyId: property.id,
        bookingId: bookings[0].id,
      },
    }),
  ])

  console.log("Created reviews:", reviews.length)

  // Create platform metrics for dashboard
  const today = new Date()
  const metricsData = []
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    metricsData.push(
      {
        platform: Platform.AIRBNB,
        date,
        views: Math.floor(Math.random() * 100) + 50,
        clicks: Math.floor(Math.random() * 30) + 10,
        bookings: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 100000) + 50000,
        propertyId: property.id,
      },
      {
        platform: Platform.BOOKING,
        date,
        views: Math.floor(Math.random() * 80) + 40,
        clicks: Math.floor(Math.random() * 25) + 8,
        bookings: Math.floor(Math.random() * 4),
        revenue: Math.floor(Math.random() * 80000) + 40000,
        propertyId: property.id,
      },
      {
        platform: Platform.DIRECT,
        date,
        views: Math.floor(Math.random() * 50) + 20,
        clicks: Math.floor(Math.random() * 15) + 5,
        bookings: Math.floor(Math.random() * 3),
        revenue: Math.floor(Math.random() * 60000) + 30000,
        propertyId: property.id,
      }
    )
  }

  await prisma.platformMetrics.createMany({
    data: metricsData,
  })

  console.log("Created platform metrics")

  // Create ad campaigns
  await Promise.all([
    prisma.adCampaign.create({
      data: {
        platform: "GOOGLE_ADS",
        campaignId: "google-summer-2024",
        name: "Estate 2024 - Costa Amalfitana",
        status: "ACTIVE",
        budget: 200000, // €2,000
        spend: 120000, // €1,200
        impressions: 45000,
        clicks: 1200,
        conversions: 24,
      },
    }),
    prisma.adCampaign.create({
      data: {
        platform: "META_ADS",
        campaignId: "meta-luxury-villas",
        name: "Luxury Villas - Instagram",
        status: "ACTIVE",
        budget: 150000, // €1,500
        spend: 80000, // €800
        impressions: 38000,
        clicks: 950,
        conversions: 18,
      },
    }),
  ])

  console.log("Created ad campaigns")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })