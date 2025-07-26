import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo users
  const hashedPassword = await hash('password123', 12)

  const hostUser = await prisma.user.upsert({
    where: { email: 'host@demo.com' },
    update: {},
    create: {
      email: 'host@demo.com',
      password: hashedPassword,
      name: 'Demo Host',
      role: 'HOST',
    },
  })

  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@demo.com' },
    update: {},
    create: {
      email: 'guest@demo.com',
      password: hashedPassword,
      name: 'Demo Guest',
      role: 'GUEST',
    },
  })

  // Create demo properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Villa sul Mare - Amalfi',
      description: 'Splendida villa con vista mozzafiato sulla costiera amalfitana',
      address: 'Via Duomo 15, Amalfi',
      city: 'Amalfi',
      country: 'Italia',
      pricePerNight: 15000, // €150.00
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: JSON.stringify(['WiFi', 'Piscina', 'Vista Mare', 'Giardino', 'Parcheggio']),
      images: JSON.stringify(['/images/villa-amalfi-1.jpg', '/images/villa-amalfi-2.jpg']),
      isActive: true,
      ownerId: hostUser.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Appartamento Centro - Firenze',
      description: 'Elegante appartamento nel cuore storico di Firenze',
      address: 'Via dei Calzaiuoli 45, Firenze',
      city: 'Firenze',
      country: 'Italia',
      pricePerNight: 12000, // €120.00
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: JSON.stringify(['WiFi', 'Aria Condizionata', 'Centro Storico', 'Cucina Attrezzata']),
      images: JSON.stringify(['/images/apt-firenze-1.jpg', '/images/apt-firenze-2.jpg']),
      isActive: true,
      ownerId: hostUser.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Demo accounts:')
  console.log('Host: host@demo.com / password123')
  console.log('Guest: guest@demo.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })