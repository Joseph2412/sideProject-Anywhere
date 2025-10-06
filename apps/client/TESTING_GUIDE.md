# 🧪 Guida al Testing - Client App

## 🚀 Quick Start

### 1. Avvia il Backend
```bash
# Dalla root del monorepo
cd apps/api
pnpm dev
# Il backend dovrebbe avviarsi su http://localhost:3001
```

### 2. Avvia il Client
```bash
# In un nuovo terminale, dalla root del monorepo
cd apps/client
pnpm dev
# Il client dovrebbe avviarsi su http://localhost:3000
```

### 3. Verifica la Connessione
Apri il browser su `http://localhost:3000` e verifica che:
- La homepage si carichi
- La navbar sia visibile
- Il footer sia visibile
- I featured venues vengano caricati (se ci sono dati nel DB)

## 🧪 Test delle Funzionalità

### Test 1: Homepage
✅ **Cosa testare:**
- [ ] Navbar appare correttamente
- [ ] Titolo "Anywhere" e sottotitolo visibili
- [ ] SearchBar è presente e funzionale
- [ ] Se ci sono venues nel DB, appaiono massimo 6 come featured
- [ ] Footer è presente con tutte le sezioni

🔍 **Come testare:**
1. Vai su `http://localhost:3000/`
2. Verifica gli elementi visivi
3. Controlla la console per eventuali errori

### Test 2: Ricerca Venues
✅ **Cosa testare:**
- [ ] Input città nella SearchBar
- [ ] Click su "Cerca" naviga a `/venues?city=...`
- [ ] Premere Enter esegue la ricerca
- [ ] Query parameter è corretto nell'URL

🔍 **Come testare:**
1. Nella homepage, scrivi "Milano" nella search bar
2. Clicca "Cerca" o premi Enter
3. Verifica che l'URL sia `/venues?city=Milano`
4. Verifica che la pagina carichi i risultati

### Test 3: Lista Venues
✅ **Cosa testare:**
- [ ] Pagina `/venues` mostra tutti i venues
- [ ] Pagina `/venues?city=Milano` filtra per città
- [ ] Stato loading appare durante caricamento
- [ ] Messaggio "Nessuno spazio disponibile" se lista vuota
- [ ] VenueCard mostra: foto, nome, indirizzo, descrizione, servizi
- [ ] Click su card naviga a dettaglio

🔍 **Come testare:**
1. Vai su `http://localhost:3000/venues`
2. Verifica grid di cards
3. Prova filtro: `http://localhost:3000/venues?city=Roma`
4. Clicca su una card e verifica navigazione

### Test 4: Dettaglio Venue
✅ **Cosa testare:**
- [ ] URL `/venues/1` carica dettagli del venue con id=1
- [ ] Logo venue (se presente)
- [ ] Nome e indirizzo
- [ ] Galleria foto (max 4 immagini)
- [ ] Descrizione
- [ ] Lista servizi con tags
- [ ] Orari di apertura per ogni giorno
- [ ] Lista pacchetti disponibili
- [ ] Ogni package mostra: foto, nome, tipo, capacità, piani, prezzi

🔍 **Come testare:**
1. Vai su `http://localhost:3000/venues/1` (o altro ID valido)
2. Verifica tutte le sezioni
3. Controlla che i dati siano formattati correttamente
4. Verifica responsive su mobile

### Test 5: Prenotazione
✅ **Cosa testare:**
- [ ] Click "Prenota" su un package apre modal
- [ ] Modal mostra BookingForm
- [ ] Form ha tutti i campi richiesti
- [ ] Click fuori dal modal lo chiude
- [ ] Click X chiude il modal
- [ ] Campi required sono validati
- [ ] Invio form invia richiesta POST a backend
- [ ] Successo: modal si chiude e appare alert
- [ ] Errore: messaggio errore nel form

🔍 **Come testare:**
1. In pagina dettaglio venue, clicca "Prenota" su un package
2. Verifica apertura modal
3. Compila form con dati validi:
   - Data inizio: oggi + 1 giorno
   - Data fine: oggi + 2 giorni
   - Persone: 2
   - Nome: Mario
   - Cognome: Rossi
   - Email: mario.rossi@example.com
   - Telefono: +39 123456789 (opzionale)
4. Clicca "Conferma Prenotazione"
5. Verifica chiamata API nella console Network
6. Verifica messaggio successo

### Test 6: Navbar
✅ **Cosa testare:**
- [ ] Link "Home" va a `/`
- [ ] Link "Esplora" va a `/venues`
- [ ] Link "Le mie prenotazioni" va a `/bookings`
- [ ] Navbar sticky quando si scrolla
- [ ] Responsive: su mobile appare hamburger menu
- [ ] Click hamburger apre/chiude menu mobile

🔍 **Come testare:**
1. Clicca ogni link e verifica navigazione
2. Scrolla pagina e verifica navbar sticky
3. Riduci finestra a < 768px
4. Verifica apparizione hamburger
5. Clicca hamburger e verifica menu mobile

### Test 7: Footer
✅ **Cosa testare:**
- [ ] 4 sezioni: Anywhere, Link Utili, Informazioni, Contatti
- [ ] Tutti i link sono presenti
- [ ] Anno copyright è dinamico (2025)
- [ ] Responsive: su mobile stack verticale

🔍 **Come testare:**
1. Scrolla fino al footer
2. Verifica tutte le sezioni
3. Verifica anno corrente
4. Riduci finestra e verifica layout mobile

### Test 8: Responsive Design
✅ **Cosa testare:**
- [ ] Mobile (< 768px): layout a colonna singola
- [ ] Tablet (768px - 1024px): layout intermedio
- [ ] Desktop (> 1024px): layout completo
- [ ] Tutte le pagine sono utilizzabili su mobile
- [ ] Form sono compilabili su mobile
- [ ] Modal non esce dallo schermo

🔍 **Come testare:**
1. Apri DevTools (F12)
2. Attiva "Toggle device toolbar"
3. Prova vari dispositivi:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)
4. Naviga tutte le pagine in ogni dimensione

### Test 9: Stati Error/Loading/Empty
✅ **Cosa testare:**
- [ ] Loading: spinner o messaggio "Caricamento..."
- [ ] Error: messaggio errore comprensibile
- [ ] Empty: messaggio "Nessun risultato" con call-to-action
- [ ] Network error: gestito gracefully

🔍 **Come testare:**
1. **Loading**: Throttle network in DevTools
2. **Error**: Ferma backend e ricarica pagina
3. **Empty**: Cerca città inesistente "XYZ123"
4. **Network**: Offline mode in DevTools

### Test 10: Integrazione API
✅ **Cosa testare:**
- [ ] GET `/public/venues` ritorna lista
- [ ] GET `/public/venues?city=Milano` filtra correttamente
- [ ] GET `/public/venues/:id` ritorna dettagli
- [ ] POST `/booking/:id` crea prenotazione
- [ ] Response API sono nel formato atteso
- [ ] Errori API sono gestiti

🔍 **Come testare:**
1. Apri Network tab in DevTools
2. Naviga le pagine e monitora chiamate API
3. Verifica URL, method, headers, body
4. Verifica response status e data
5. Simula errori (500, 404, timeout)

## 🐛 Debugging

### Console Errors
Apri DevTools > Console e controlla:
- ❌ Errori di compilazione TypeScript
- ⚠️ Warning di React (keys, hooks, etc.)
- 🔴 Errori di network
- 🟡 Console.log di debug

### Network Tab
Apri DevTools > Network e monitora:
- 🌐 Chiamate API
- 📊 Status codes (200, 404, 500)
- ⏱️ Tempi di risposta
- 📦 Request/Response payload

### React DevTools
Installa React DevTools extension:
- 🔍 Ispeziona component tree
- 📊 Monitora state e props
- ⚡ Profiling performance

## ✅ Checklist Finale

### Funzionalità
- [ ] Homepage carica e mostra featured venues
- [ ] Ricerca per città funziona
- [ ] Lista venues mostra tutte le cards
- [ ] Dettaglio venue mostra tutte le info
- [ ] Prenotazione: form si apre e invia dati
- [ ] Navbar naviga correttamente
- [ ] Footer ha tutti i link

### Design
- [ ] Layout responsive su tutti i dispositivi
- [ ] Colori e stili consistenti
- [ ] Hover effects funzionano
- [ ] Transizioni smooth
- [ ] Font e spacing corretti

### Performance
- [ ] Pagine si caricano velocemente
- [ ] Immagini sono ottimizzate
- [ ] Nessun layout shift
- [ ] Smooth scrolling

### Accessibilità
- [ ] Tutte le immagini hanno alt text
- [ ] Form hanno label corrette
- [ ] Pulsanti hanno aria-label se necessario
- [ ] Navigazione da tastiera funziona
- [ ] Contrasto colori accessibile

### Browser Support
Testa su:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🚨 Problemi Comuni

### 1. "Failed to fetch venues"
**Causa:** Backend non avviato o porta sbagliata
**Soluzione:** 
- Verifica backend su `http://localhost:3001`
- Controlla `.env.local` con `NEXT_PUBLIC_API_URL`

### 2. Immagini non si caricano
**Causa:** URL proxy S3 non configurato
**Soluzione:**
- Verifica configurazione S3 nel backend
- Controlla console per errori CORS

### 3. "userId is required"
**Causa:** Sistema auth non ancora implementato
**Soluzione:**
- Usa userId hardcoded (1) per testing
- TODO: Implementare auth completa

### 4. Modal non si chiude
**Causa:** Event propagation
**Soluzione:**
- Verifica `stopPropagation()` nel modal content
- Controlla z-index CSS

### 5. Responsive non funziona
**Causa:** Breakpoint CSS non corretto
**Soluzione:**
- Verifica `@media (max-width: 768px)` in globals.css
- Controlla viewport meta tag in layout

## 📝 Report Bug

Se trovi bug, annota:
1. **Cosa hai fatto:** Step by step
2. **Cosa ti aspettavi:** Comportamento atteso
3. **Cosa è successo:** Comportamento effettivo
4. **Browser e Device:** Chrome, iPhone, etc.
5. **Console errors:** Screenshot o testo
6. **Network tab:** Request fallite

## 🎉 Testing Completato!

Se tutti i test passano, la struttura è pronta per:
- ✅ Sviluppo features aggiuntive
- ✅ Implementazione autenticazione
- ✅ Migrazione componenti in monorepo
- ✅ Deploy in produzione
