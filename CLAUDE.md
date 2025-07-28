# Vacation Rental Platform - Quick Tests

## Updated Test Checklist (Latest Implementation - Luglio 2025)

### 1. Homepage Tests
- [ ] Google Maps shows correct coordinates for both properties
- [ ] Casa Fienaroli pin at: 41°53'18.6"N 12°28'18.8"E  
- [ ] Casa Moro pin at: 41.89107812403395, 12.470474472427387
- [ ] No prices displayed on property cards
- [ ] Hero section displays correctly
- [ ] Navigation links work

### 2. Property Pages Tests - Core Functionality
- [ ] Casa Fienaroli page loads with calendar trigger button
- [ ] Casa Moro page loads with calendar trigger button
- [ ] Calendar modal opens when clicking date selector
- [ ] Calendar shows two months side-by-side
- [ ] Month navigation (prev/next) works
- [ ] Date selection works (check-in/check-out)
- [ ] Gap management: dates between unavailable dates are blocked
- [ ] Confirm button appears after selecting checkout date
- [ ] Modal closes only after confirmation, not auto-close
- [ ] Minimum stay validation (dynamic from Octorate)
- [ ] Guest count selection works
- [ ] No prices shown on property details
- [ ] Booking button redirects to Octorate with selected dates

### 3. NEW Gallery Carousel Tests (Implementato Luglio 2025)
- [ ] Carousel mostra 3 immagini simultaneamente (desktop)
- [ ] Carousel mostra 2 immagini (tablet) e 1 (mobile)
- [ ] Frecce navigazione sinistra/destra funzionano
- [ ] Indicatori dots mostrano progresso corretto
- [ ] Auto-advance ogni 5 secondi (si ferma on hover)
- [ ] Counter immagini mostra "1-3 di X" correttamente
- [ ] Click su immagine apre modale zoom
- [ ] Modale galleria apre con immagine corretta
- [ ] Theme colors corretti (terracotta Fienaroli, burgundy Moro)

### 4. NEW Reviews System Tests (Implementato Luglio 2025)
- [ ] Casa Moro carica recensioni da nuovo API Airbnb
- [ ] Recensioni mostrate complete (no truncation)
- [ ] Lista sempre scrollabile senza bottone "mostra altre"
- [ ] Avatar recensioni perfettamente circolari (48x48px)
- [ ] Header recensioni mostra solo rating + stelle (no numero)
- [ ] Scroll smooth e indicatore "Scorri per vedere altre"
- [ ] Link "Leggi tutte le recensioni" va a Airbnb Casa Moro
- [ ] Traduzioni e disclaimer mostrati correttamente
- [ ] Risposte host incluse quando presenti

### 5. NEW Performance & UX Tests (Implementato Luglio 2025)
- [ ] Dati calendario e recensioni precaricati all'onLoad
- [ ] Apertura calendario istantanea (no loading)
- [ ] Apertura recensioni istantanea (no loading)
- [ ] CalendarModal blocca scroll pagina quando aperto
- [ ] CalendarModal rimane sopra navbar (z-index corretto)
- [ ] Next.js Image funziona per avatar Airbnb (a0.muscache.com)

### 6. NEW Location Info Tests (Implementato Luglio 2025)
- [ ] Box "Nelle vicinanze" usa theme colors proprietà
- [ ] Box "Trasporti" usa theme colors proprietà
- [ ] Icone appropriate per ogni location/transport
- [ ] Hover effects sui box location
- [ ] Design coerente con resto della pagina

### 7. Booking System Tests
- [ ] Select valid dates and test redirect URLs
- [ ] Fienaroli booking URL contains correct property ID (917300)
- [ ] Moro booking URL contains correct property ID (656889)
- [ ] Guest count and dates passed correctly in URL
- [ ] External Octorate site loads properly

### 8. Contact Page Tests
- [ ] Contact form loads at /contact
- [ ] Form validation works (name, email, message)
- [ ] Required field validation displays errors
- [ ] Email format validation works
- [ ] Form submission shows loading state
- [ ] Success/error messages display

### 9. Navigation Tests
- [ ] Navbar shows all links: Fienaroli, Moro, Contact
- [ ] Contact link in navbar works
- [ ] Logo returns to homepage
- [ ] Mobile menu works on small screens
- [ ] Language switcher functions

### 10. Mobile Responsiveness
- [ ] Homepage responsive on mobile
- [ ] Property pages work on mobile
- [ ] Carousel navigabile su touch devices
- [ ] Recensioni scrollabili su mobile
- [ ] Calendar usable on touch devices
- [ ] Contact form works on mobile
- [ ] Navigation hamburger menu works

## Test Commands
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking  
npm run typecheck

# Build for production
npm run build
```

## Environment Setup for Testing
Create `.env.local` with:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
```

## Recent Major Changes

### Core System (Precedenti)
- ✅ Integrated Octorate API for real-time availability (with server-side proxy)
- ✅ Implemented Airbnb-style modal calendar with horizontal layout
- ✅ Fixed gap management logic with Italian timezone (CEST)
- ✅ Added two-month side-by-side calendar view with navigation
- ✅ Implemented confirm button after checkout selection
- ✅ Added contact page with email functionality
- ✅ Removed all pricing from UI
- ✅ Fixed Google Maps coordinates
- ✅ Updated navigation structure
- ✅ Fixed React hydration error with suppressHydrationWarning
- ✅ Resolved Octorate API 406 CORS issue with internal API endpoint

### Latest Updates (Luglio 2025)
- ✅ **NEW Gallery Carousel**: Vero carousel con 3 immagini visibili, navigazione frecce, auto-advance, theme colors
- ✅ **API Airbnb Casa Moro**: Integrato nuovo endpoint con ID corretto (998346242016693375)
- ✅ **Reviews UX**: Recensioni complete senza truncation, sempre scrollabili, no "mostra altre"
- ✅ **Performance**: Precaricamento dati calendario/recensioni all'onLoad per navigazione istantanea
- ✅ **Avatar Fix**: Avatar recensioni perfettamente circolari + support Next.js Image per a0.muscache.com
- ✅ **Modal UX**: CalendarModal blocca scroll pagina, z-index corretto sopra navbar
- ✅ **Location Boxes**: Theme colors per box vicinanze/trasporti, icone, hover effects
- ✅ **Clean Header**: Rimosso numero recensioni da header, solo rating + stelle

## API Implementation Details

### Octorate API Integration
- **Problem**: Direct browser calls to Octorate API failed with 406 error due to CORS restrictions
- **Solution**: Created Next.js API endpoint `/api/availability/[slug]` as server-side proxy
- **Fallback**: Three-tier system: Internal API → Direct API → Mock data
- **Data Format**: Parses JavaScript response format from Octorate to structured JSON

### Real-time Availability
The calendar now shows actual availability data from Octorate for both properties:
- Casa Fienaroli (Property ID: 917300)  
- Casa Moro (Property ID: 656889)

### Booking URLs
Correctly formatted URLs redirect to Octorate booking system with:
- Property-specific booking pages
- Pre-filled dates and guest count
- Minimum stay validation