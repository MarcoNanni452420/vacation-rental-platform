# 🚀 Deploy Casa Fienaroli su Vercel

## ⚠️ PUNTI CRITICI PRIMA DEL DEPLOY

### 1. **DATABASE - OBBLIGATORIO** 🔴
**PROBLEMA:** SQLite non funziona su Vercel (serverless)
**SOLUZIONE:** Configura database PostgreSQL

#### Opzioni database:
- **Vercel Postgres** (più semplice)
- **Supabase** (gratuito)  
- **PlanetScale** 
- **Neon** (gratuito)

#### Setup Vercel Postgres:
1. Vai su Vercel Dashboard → Storage → Create Database → Postgres
2. Copia la `DATABASE_URL` 
3. Aggiungi nelle environment variables di Vercel

### 2. **ENVIRONMENT VARIABLES** 🔑
Configura su Vercel Dashboard → Settings → Environment Variables:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="genera-una-chiave-sicura-32-caratteri"
NEXTAUTH_URL="https://tuo-dominio.vercel.app"
```

### 3. **NEXTAUTH_SECRET** 🔐
**Genera una chiave sicura:**
```bash
openssl rand -base64 32
```

### 4. **BUILD COMMANDS** ⚙️
Configurazione Prisma per Vercel:
- Build Command: `prisma generate && npm run build`
- Install Command: `npm install && prisma generate`
- Framework: Next.js
- ✅ Già configurato in package.json e vercel.json

### 5. **PRISMA MIGRATIONS** 📊
Dopo il deploy iniziale:
```bash
npx prisma db push
npx prisma db seed
```

## 📋 CHECKLIST PRE-DEPLOY

- [ ] ✅ Database PostgreSQL configurato
- [ ] ✅ Environment variables impostate
- [ ] ✅ NEXTAUTH_SECRET generato
- [ ] ✅ NEXTAUTH_URL aggiornato
- [ ] ✅ .env.example creato
- [ ] ✅ vercel.json configurato
- [ ] ⚠️  SQLite rimosso dal prisma schema
- [ ] ⚠️  Build test locale (`npm run build`)

## 🔄 PROCESS DEPLOY

1. **Push su GitHub** (già fatto ✅)
2. **Connetti repository a Vercel**
3. **Configura environment variables**
4. **Deploy**
5. **Setup database** (push + seed)
6. **Test funzionalità**

## 🐛 POSSIBILI PROBLEMI

- **Build Error:** Controlla TypeScript errors
- **Database Error:** Verifica CONNECTION_STRING
- **Auth Error:** Controlla NEXTAUTH_SECRET e URL
- **Images Error:** Verifica paths delle immagini

## 🛠️ POST-DEPLOY

- Test autenticazione admin
- Test responsive design  
- Test performance (Core Web Vitals)
- Setup custom domain (opzionale)

---

**📞 Need Help?** 
- Vercel Docs: https://vercel.com/docs
- Next.js Deploy: https://nextjs.org/docs/deployment