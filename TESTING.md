# 🧪 Guida ai Test - VacationRental Pro

## 🚀 Come Avviare l'Applicazione

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il database (se non già fatto)
npx prisma db push

# 3. Popola il database con dati demo
npx tsx scripts/seed.ts

# 4. Avvia l'applicazione
npm run dev
```

L'applicazione sarà disponibile su: **http://localhost:3000**

## 👤 Account Demo

### Host (Proprietario)
- **Email:** host@demo.com
- **Password:** password123
- **Accesso:** Dashboard admin completa

### Ospite
- **Email:** guest@demo.com  
- **Password:** password123
- **Accesso:** Area clienti

## 🔍 Test delle Funzionalità Principali

### ✅ 1. Registrazione Nuovo Utente
1. Vai su http://localhost:3000/auth/signup
2. Compila il form con:
   - Nome: "Nuovo Utente"
   - Email: "nuovo@test.com"
   - Password: "password123"
   - Tipo: Host o Ospite
3. Clicca "Registrati"
4. Dovresti essere reindirizzato al login

### ✅ 2. Login con Account Demo
1. Vai su http://localhost:3000/auth/signin
2. Usa le credenziali demo:
   - **Host:** host@demo.com / password123
   - **Ospite:** guest@demo.com / password123
3. Clicca "Accedi"
4. Se Host → reindirizzamento a /admin
5. Se Ospite → reindirizzamento alla homepage

### ✅ 3. Dashboard Admin (Solo Host)
1. Login come Host
2. Vai su http://localhost:3000/admin
3. Verifica:
   - ✅ KPI e statistiche caricate
   - ✅ Grafici ricavi funzionanti
   - ✅ Sezione prenotazioni recenti
   - ✅ Panel consigli intelligenti
   - ✅ Sidebar navigation

### ✅ 4. Sito Pubblico
1. Vai su http://localhost:3000
2. Verifica:
   - ✅ Homepage con hero section
   - ✅ Barra di ricerca funzionante
   - ✅ Sezione proprietà in evidenza
   - ✅ Footer con informazioni

### ✅ 5. Proprietà
1. Vai su http://localhost:3000/properties
2. Verifica:
   - ✅ Lista proprietà caricate
   - ✅ Filtri di ricerca
   - ✅ Paginazione
3. Clicca su una proprietà
4. Verifica:
   - ✅ Pagina dettaglio completa
   - ✅ Galleria immagini
   - ✅ Sezione prenotazione
   - ✅ Recensioni mock

### ✅ 6. Protezione Routes
1. Senza login, prova ad accedere a:
   - http://localhost:3000/admin → ❌ Reindirizza a login
   - http://localhost:3000/account → ❌ Reindirizza a login
2. Con login Ospite, prova:
   - http://localhost:3000/admin → ❌ Reindirizza a login
3. Con login Host:
   - http://localhost:3000/admin → ✅ Accesso permesso

## 🗄️ Database

### Verifica Dati
```bash
npx prisma studio
```
Apre interfaccia web su http://localhost:5555 per vedere i dati

### Tabelle Principali
- **users** - Utenti registrati
- **properties** - Proprietà delle case vacanza
- **bookings** - Prenotazioni (vuoto per ora)
- **reviews** - Recensioni (vuoto per ora)

## 🚨 Risoluzione Problemi

### Database non si connette
```bash
rm prisma/dev.db
npx prisma db push
npx tsx scripts/seed.ts
```

### App non si avvia
```bash
npm install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Login non funziona
Verifica che NEXTAUTH_URL in .env punti alla porta corretta:
```
NEXTAUTH_URL="http://localhost:3000"
```

## 📊 Test API

### Registrazione
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@api.com","password":"password123","role":"GUEST"}'
```

### Test Endpoints
- GET /api/auth/providers → ✅ Dovrebbe restituire providers
- GET / → ✅ 307 (redirect)
- GET /auth/signin → ✅ 200
- GET /auth/signup → ✅ 200
- GET /properties → ✅ 200
- GET /properties/001 → ✅ 200
- GET /properties/999 → ✅ 404
- GET /admin (senza auth) → ✅ 307 (redirect)

## 🎯 Funzionalità Testate e Funzionanti

✅ **Autenticazione completa** (registro, login, logout)
✅ **Protezione routes** per admin/user
✅ **Database SQLite** con Prisma
✅ **Sito pubblico** responsive
✅ **Dashboard admin** con mock data
✅ **Gestione proprietà** (visualizzazione)
✅ **Sistema di routing** Next.js 14
✅ **TypeScript** configurato
✅ **Tailwind CSS** + UI components

## 🔄 Prossimi Sviluppi

⏳ **Sistema prenotazioni** completo
⏳ **Integrazione Stripe** per pagamenti  
⏳ **API Google Ads/Meta Ads** reali
⏳ **Upload immagini** proprietà
⏳ **Sistema recensioni** interattivo