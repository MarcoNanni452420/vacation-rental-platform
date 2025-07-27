# 🚀 Pre-Commit Test List - Trastevere Luxury Homes

**🎯 Obiettivo:** Test completi prima di ogni commit git  
**⏱️ Tempo stimato:** 10-15 minuti

---

## 🔧 Technical Tests Complete (3-4 min)

### ✅ 1. TypeScript Compilation
```bash
npx tsc --noEmit
```
**✅ Expected:** No errors, warnings acceptable  
**❌ Critical:** TypeScript errors bloccano commit

### ✅ 2. Next.js Build
```bash
npm run build
```
**✅ Expected:** Build successful, size warnings acceptable  
**❌ Critical:** Build failures bloccano commit

### ✅ 3. ESLint Check
```bash
npm run lint
```
**✅ Expected:** No critical errors  
**❌ Critical:** ESLint errors bloccano commit

### ✅ 4. Database Connectivity
```bash
# Test database connection
npx prisma db push --preview-feature
```
**✅ Expected:** Database schema in sync  
**❌ Critical:** Database issues bloccano deploy

---

## 🌐 Multi-Property Navigation (2-3 min)

### ✅ 5. Homepage Complete Test
**URL:** http://localhost:3001/

#### Brand & Content
- [ ] Title: "Trastevere Luxury"
- [ ] Subtitle: "Houses in Rome" 
- [ ] Description mentions "Two exclusive properties"
- [ ] Company branding consistent

#### Property Grid
- [ ] Casa Fienaroli card visibile (01)
- [ ] Casa Moro card visibile (02)
- [ ] Hover effects working (scale, overlay)
- [ ] Price display correct (€250, €300)
- [ ] CTA "Esplora" → "Explore" su EN

#### Sections
- [ ] About section translated
- [ ] Location section with working map
- [ ] Stats: "2 Exclusive properties", "10+ Years", "200+ Guests"
- [ ] CTA section con links funzionanti

### ✅ 6. Casa Fienaroli Complete Test
**URL:** http://localhost:3001/property/fienaroli

#### Theme & Design
- [ ] Terracotta/Orange color palette active
- [ ] CSS custom properties aplicati
- [ ] Back to properties link works

#### Content
- [ ] Property name: "Casa Fienaroli"
- [ ] Location: "Via dei Fienaroli, Trastevere"
- [ ] 6 guests, 2 bedrooms, 2 bathrooms, 80mq
- [ ] Rating 4.9, 127 reviews

#### Gallery & Features
- [ ] 6 images load correctly (no Via del Moro images)
- [ ] Amenities list complete (WiFi, AC, Kitchen, etc.)
- [ ] Long description shows Via dei Fienaroli details

#### Interactive Elements
- [ ] Google Map shows Via dei Fienaroli 11
- [ ] Booking form functional
- [ ] Check-in/out date fields
- [ ] Guest selector (1-6)

### ✅ 7. Casa Moro Complete Test  
**URL:** http://localhost:3001/property/moro

#### Theme & Design
- [ ] Burgundy/Red color palette active
- [ ] CSS custom properties different from Fienaroli
- [ ] Back to properties link works

#### Content
- [ ] Property name: "Casa Moro"
- [ ] Location: "Cuore di Trastevere"
- [ ] 4 guests, 2 bedrooms, 1 bathroom
- [ ] Rating 5.0, 89 reviews

#### Gallery & Features  
- [ ] 9 images load correctly
- [ ] Historic features highlighted (1400 ceilings)
- [ ] Luxury amenities (marble, walk-in shower)

#### Interactive Elements
- [ ] Google Map shows Via del Moro 6
- [ ] Booking form functional
- [ ] Guest selector (1-4)

---

## 🌍 Multi-Language Testing (2-3 min)

### ✅ 8. Italian (Default)
**Navbar:**
- [ ] "Casa Fienaroli", "Casa Moro", "Contatti", "Prenota Ora"

**Homepage:**
- [ ] "Houses in Rome" → "Trastevere Luxury"
- [ ] "Due proprietà esclusive nel cuore storico di Roma"
- [ ] "Esplora", "per notte", "ospiti", "camere", "bagni"
- [ ] "Vivi Roma come un local", "Il cuore di Trastevere"

### ✅ 9. English Switch
**Click language switcher to EN:**

**Navbar:**
- [ ] "Casa Fienaroli", "Casa Moro", "Contact", "Book Now"

**Homepage:**
- [ ] Same title/subtitle (Houses in Rome/Trastevere Luxury)
- [ ] "Two exclusive properties in the historic heart of Rome"
- [ ] "Explore", "per night", "guests", "bedrooms", "bathrooms"
- [ ] "Live Rome like a local", "The heart of Trastevere"

**Property Pages:**
- [ ] "Back to properties", "Guests", "Bedrooms", "Bathrooms"
- [ ] "The Property", "Amenities", "Gallery", "Location"
- [ ] Form labels: "Check-in", "Check-out", "Guests", "Book Now"

---

## 📱 Responsive Design Testing (1-2 min)

### ✅ 10. Mobile Responsive
**Browser DevTools → Mobile view (375px):**

#### Homepage
- [ ] Hero section adapts correctly
- [ ] Property grid stacks vertically
- [ ] Mobile menu hamburger works
- [ ] Text remains readable

#### Property Pages
- [ ] Property hero responsive
- [ ] Gallery grid adapts
- [ ] Booking card stacks below content
- [ ] Maps responsive

#### Navigation
- [ ] Mobile menu slides in/out
- [ ] All links accessible
- [ ] Language switcher works in mobile menu

### ✅ 11. Desktop (1920px+)
- [ ] Layout uses full width appropriately
- [ ] No content cutoff
- [ ] Images scale properly
- [ ] Maps display at full size

---

## 🔐 Authentication System (1-2 min)

### ✅ 12. Auth Pages Access
```bash
# Test auth routes
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/auth/signin
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/auth/signup
```
**✅ Expected:** Both return 200

### ✅ 13. Admin Protection
```bash
# Test admin without auth
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/admin
```
**✅ Expected:** 307 (redirect) or 401/403

### ✅ 14. Demo Account Test
**Manual Login Test:**
- [ ] Navigate to `/auth/signin`
- [ ] Login with: host@demo.com / password123
- [ ] Should redirect to `/admin`
- [ ] Admin dashboard loads properly

---

## 🎨 Asset & Performance (1-2 min)

### ✅ 15. Image Loading
**Fienaroli Images (6 total):**
- [ ] kitchen-1.jpg
- [ ] bathroom-1.jpg  
- [ ] bedroom-elegant.jpg
- [ ] bedroom-rustic.jpg
- [ ] interior-overview.jpg
- [ ] bedroom-master.jpg

**Moro Images (9 total):**
- [ ] bedroom-master.jpg
- [ ] living.jpg
- [ ] bathroom-luxury.jpg
- [ ] kitchen.jpg
- [ ] bedroom-2.jpg
- [ ] detail-ceiling.jpg
- [ ] corridor.jpg
- [ ] detail-art.jpg
- [ ] overview.jpg

### ✅ 16. Maps Integration
**Homepage:**
- [ ] Iframe loads Trastevere area
- [ ] Orange marker for Fienaroli (F)
- [ ] Red marker for Moro (M)

**Property Pages:**
- [ ] Fienaroli: Via dei Fienaroli 11 marker
- [ ] Moro: Via del Moro 6 marker

### ✅ 17. Console Cleanliness
**Production Build Console:**
```bash
npm run build && npm start
```
- [ ] No JavaScript errors
- [ ] No 404s for assets
- [ ] No React warnings in production
- [ ] Maps load without errors

---

## 🔍 SEO & Accessibility (1 min)

### ✅ 18. Meta Tags
**View Page Source:**
- [ ] Title tags appropriate
- [ ] Meta descriptions present
- [ ] Open Graph tags (optional)

### ✅ 19. Basic Accessibility
- [ ] Images have alt attributes
- [ ] Links have descriptive text
- [ ] Form inputs have labels
- [ ] Color contrast sufficient

---

## 📊 Pre-Deploy Final Checks (1-2 min)

### ✅ 20. Environment Variables
```bash
# Check required env vars exist
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
```

### ✅ 21. Database Migration Status
```bash
npx prisma migrate status
```
**✅ Expected:** All migrations applied

### ✅ 22. Build Artifacts
```bash
ls -la .next/static/
```
**✅ Expected:** Static files generated properly

---

## 🚨 Pre-Commit Decision Matrix

### 🟢 GREEN LIGHT - Ready to Commit
- **All tests pass**
- **Build successful** 
- **No critical console errors**
- **Multi-language working**
- **Both properties functional**

### 🟡 YELLOW LIGHT - Commit with Caution
- **Minor styling issues**
- **Non-critical warnings**
- **Performance could be better**
- **Some translations missing**

### 🔴 RED LIGHT - DO NOT COMMIT
- **Build failures**
- **TypeScript errors**
- **Critical functionality broken**
- **Images not loading**
- **Maps not working**
- **Authentication broken**

---

## 📝 Commit Message Template

When all tests pass, use this template:

```bash
git add .
git commit -m "feat: [description]

✅ All pre-commit tests passed
✅ Multi-property navigation working
✅ IT/EN translations complete
✅ Responsive design verified
✅ Build successful

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

**🎯 Goal:** Zero critical issues in production  
**🔄 Process:** Run this checklist before every `git commit`  
**📈 Result:** Stable, high-quality releases