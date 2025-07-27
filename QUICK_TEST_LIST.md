# ⚡ Quick Test List - Trastevere Luxury Homes

**🎯 Obiettivo:** Test rapidi da eseguire ad ogni modifica durante lo sviluppo  
**⏱️ Tempo stimato:** 3-5 minuti

---

## 🔧 Technical Tests (1-2 min)

### ✅ 1. TypeScript Compilation
```bash
npx tsc --noEmit
```
**✅ Expected:** No errors  
**❌ Se fallisce:** Fix TypeScript errors prima di continuare

### ✅ 2. Dev Server Startup
```bash
npm run dev
```
**✅ Expected:** Server starts on http://localhost:3001 (or 3000)  
**❌ Se fallisce:** Check dependencies e sintassi errori

### ✅ 3. Homepage Response
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/
```
**✅ Expected:** 200  
**❌ Se fallisce:** Check homepage rendering errors

---

## 🌐 Functional Tests (2-3 min)

### ✅ 4. Navbar Navigation
- [ ] Logo "Trastevere Luxury Homes" visibile
- [ ] Link "Casa Fienaroli" funziona → `/property/fienaroli`
- [ ] Link "Casa Moro" funziona → `/property/moro`
- [ ] Link "Contatti" presente
- [ ] "Prenota Ora" button presente

### ✅ 5. Language Switcher
- [ ] Globe icon in navbar visibile
- [ ] Hover mostra dropdown IT/EN
- [ ] Click su "English" cambia lingua
- [ ] Click su "Italiano" ripristina italiano
- [ ] Navbar texts cambiano correttamente

### ✅ 6. Property Pages Load
**Casa Fienaroli:** http://localhost:3001/property/fienaroli
- [ ] Page loads senza errori
- [ ] Theme terracotta/arancio applicato
- [ ] Mappa Google funziona (Via dei Fienaroli 11)

**Casa Moro:** http://localhost:3001/property/moro  
- [ ] Page loads senza errori
- [ ] Theme burgundy/rosso applicato
- [ ] Mappa Google funziona (Via del Moro 6)

### ✅ 7. Homepage Elements
- [ ] Hero section "Houses in Rome" / "Trastevere Luxury"
- [ ] Property grid con 2 case visibile
- [ ] Hover effects su property cards
- [ ] Google Maps con markers (F=arancio, M=rosso)
- [ ] Text overlay leggibile su immagini

### ✅ 8. Console Check
**Browser DevTools:**
- [ ] No errori JavaScript in console
- [ ] No errori 404 per immagini
- [ ] No warning critici React

---

## 🚨 Quick Troubleshooting

### Server non parte
```bash
# Kill processo sulla porta
lsof -ti:3001 | xargs kill -9
npm run dev
```

### TypeScript errori
```bash
# Restart TypeScript
rm -rf .next
npm run dev
```

### Cache issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## ✅ Checklist Completion

**🟢 ALL PASSED:** Procedi con lo sviluppo  
**🟡 SOME ISSUES:** Fix issues minori, continua  
**🔴 CRITICAL FAILS:** STOP - Fix before continuing

---

**💡 Tip:** Tieni questa checklist aperta durante lo sviluppo per quick validation!