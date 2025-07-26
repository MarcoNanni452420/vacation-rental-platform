# 🏠 VacationRental Pro

**Piattaforma completa per la gestione e pubblicità di case vacanza con dashboard unificata**

Una moderna applicazione web che integra prenotazioni da Airbnb, Booking.com e sito proprietario, con analytics centralizzate e gestione campagne pubblicitarie Google Ads e Meta Ads.

## ✨ Funzionalità Principali

### 🌐 **Sito Pubblico**
- Homepage moderna con ricerca avanzata
- Catalogo proprietà con filtri intelligenti  
- Pagine dettaglio con gallery e prenotazioni
- Sistema di autenticazione sicuro
- Design responsive mobile-first

### ⚙️ **Dashboard Admin**
- Analytics centralizzata multi-piattaforma
- Grafici performance in tempo reale
- Gestione prenotazioni unificate  
- Consigli intelligenti basati su AI
- Monitoraggio campagne pubblicitarie

### 🔧 **Tecnologie**
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma ORM
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Auth:** NextAuth.js multilivello
- **UI:** Shadcn/ui + Lucide React
- **Charts:** Recharts

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Installazione

```bash
# 1. Clona il repository
git clone https://github.com/tuousername/vacation-rental-platform
cd vacation-rental-platform

# 2. Installa dipendenze
npm install

# 3. Setup database
npx prisma db push

# 4. Popola con dati demo
npx tsx scripts/seed.ts

# 5. Avvia l'applicazione
npm run dev
```

L'app sarà disponibile su: **http://localhost:3000**

## 👤 Account Demo

### Host (Dashboard Admin)
- **Email:** host@demo.com
- **Password:** password123

### Ospite  
- **Email:** guest@demo.com
- **Password:** password123

## 📁 Struttura Progetto

```
vacation-rental-platform/
├── src/
│   ├── app/
│   │   ├── (public)/          # Sito pubblico
│   │   ├── admin/             # Dashboard admin
│   │   ├── auth/              # Autenticazione
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── public/            # Componenti pubblici
│   │   ├── admin/             # Componenti admin
│   │   └── ui/                # UI riutilizzabili
│   └── lib/                   # Utilities e config
├── prisma/                    # Database schema
├── scripts/                   # Script setup
└── docs/                      # Documentazione
```

## 🔌 Integrazioni

### ✅ Disponibili
- **Google Ads API** - Gestione campagne pubblicitarie
- **Meta Ads API** - Analytics Facebook/Instagram  
- **Stripe API** - Pagamenti (ready)
- **NextAuth.js** - Autenticazione completa

### 🔄 Mock API (Pronte per sostituzione)
- **Airbnb API** - Prenotazioni e analytics
- **Booking.com API** - Performance metriche

## 🧪 Testing

Consulta la [Guida ai Test](./TESTING.md) per istruzioni complete su:
- Test delle funzionalità principali
- Account demo disponibili  
- Risoluzione problemi comuni
- Test API e endpoints

## 📊 Scripts Disponibili

```bash
npm run dev          # Sviluppo
npm run build        # Build produzione  
npm run start        # Avvia produzione
npm run lint         # Linting
npx prisma studio    # Database UI
npx tsx scripts/seed.ts  # Popola database
```

## 🔒 Variabili Ambiente

Crea un file `.env` con:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js  
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (opzionale)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Google Ads API (opzionale)
GOOGLE_ADS_CLIENT_ID="your_client_id"
GOOGLE_ADS_CLIENT_SECRET="your_client_secret"  
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"

# Meta Ads API (opzionale)
META_APP_ID="your_app_id"
META_APP_SECRET="your_app_secret"
META_ACCESS_TOKEN="your_access_token"
```

## 🚀 Deploy

### Vercel (Raccomandato)
```bash
npm i -g vercel
vercel --prod
```

### Docker
```bash
docker build -t vacation-rental-platform .
docker run -p 3000:3000 vacation-rental-platform
```

### Database Produzione
Per produzione, aggiorna `DATABASE_URL` con PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## 📝 Roadmap

### ✅ Completato
- [x] Autenticazione multilivello
- [x] Dashboard admin con analytics
- [x] Sito pubblico responsive  
- [x] Sistema proprietà
- [x] Mock API Airbnb/Booking
- [x] Database con Prisma

### 🔄 In Sviluppo  
- [ ] Sistema prenotazioni completo
- [ ] Integrazione Stripe pagamenti
- [ ] Upload immagini proprietà
- [ ] Sistema recensioni interattivo
- [ ] API Google/Meta Ads reali
- [ ] Notifiche real-time

### 🎯 Future Features
- [ ] App mobile React Native
- [ ] AI per pricing dinamico
- [ ] Integrazione Google Maps
- [ ] Sistema messaggi in-app
- [ ] Multi-lingua i18n

## 🤝 Contribuire

1. Fork il progetto
2. Crea branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)  
5. Apri Pull Request

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## 📞 Supporto

- 📧 Email: support@vacationrental.pro
- 📱 GitHub Issues: [Crea Issue](https://github.com/tuousername/vacation-rental-platform/issues)
- 📖 Docs: [Documentazione Completa](./docs/)

---

**Sviluppato con ❤️ utilizzando Next.js 14 e moderne tecnologie web**
