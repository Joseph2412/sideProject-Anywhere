# 📋 Struttura App Client - Riepilogo

## ✅ Componenti Creati

### 1. **Navbar** (`src/components/Navbar/`)
- Navigazione sticky responsive
- Links: Home, Esplora, Le mie prenotazioni
- Menu hamburger per mobile
- **File**: `Navbar.tsx`, `index.ts`

### 2. **SearchBar** (`src/components/SearchBar/`)
- Input ricerca città
- Navigazione a `/venues?city=`
- Supporto custom `onSearch` handler
- **File**: `SearchBar.tsx`, `index.ts`

### 3. **VenueCard** (`src/components/VenueCard/`)
- Card preview venue con immagine
- Mostra: nome, indirizzo, descrizione, servizi
- Link a dettaglio venue
- **File**: `VenueCard.tsx`, `index.ts`

### 4. **PackageCard** (`src/components/PackageCard/`)
- Card pacchetto con foto e badge tipo
- Mostra: capacità, metratura, piani tariffari
- Bottone prenota con callback
- **File**: `PackageCard.tsx`, `index.ts`

### 5. **BookingForm** (`src/components/BookingForm/`)
- Form completo prenotazione
- Sezioni: dettagli prenotazione + info cliente
- Validazione e gestione errori
- **File**: `BookingForm.tsx`, `index.ts`

### 6. **Footer** (`src/components/Footer/`)
- Sezioni: About, Links, Contatti
- Copyright dinamico
- Layout responsive a griglia
- **File**: `Footer.tsx`, `index.ts`

## 📄 Pagine Create

### 1. **Homepage** (`src/app/page.tsx`)
- Hero section
- SearchBar
- Featured venues (primi 6)
- Navbar + Footer

### 2. **Lista Venues** (`src/app/venues/page.tsx`)
- Ricerca per città (query param)
- Griglia venue cards
- Stati: loading, error, empty
- Navbar + Footer

### 3. **Dettaglio Venue** (`src/app/venues/[id]/page.tsx`)
- Informazioni complete venue
- Galleria foto
- Orari apertura
- Lista pacchetti
- Modal prenotazione
- Navbar + Footer

## 🎯 Tipi TypeScript (`src/types/`)

### `venue.ts`
- `Venue`: Dati completi venue
- `Package`: Pacchetto con piani
- `PackagePlan`: Piano tariffario
- `VenueOpeningDay`: Orari apertura
- `VenueSearchParams`: Parametri ricerca

### `booking.ts`
- `BookingFormData`: Dati form prenotazione
- `CustomerInfo`: Info cliente
- `Booking`: Prenotazione completa

### `index.ts`
- Barrel export di tutti i tipi

## 🔧 Utilities (`src/lib/`)

### `api.ts`
Client API centralizzato con metodi:
- `getVenues(city?)`: Lista venues
- `getVenueById(id)`: Dettaglio venue
- `createBooking(venueId, data)`: Crea prenotazione
- `getMyBookings(token)`: Le mie prenotazioni
- `deleteBooking(id, token)`: Cancella prenotazione

## 🎨 Stili (`src/app/globals.css`)

### Sezioni CSS:
1. **Base Styles**: Reset, colori, font
2. **Navbar Styles**: Navigazione responsive
3. **Footer Styles**: Footer grid layout
4. **Venue Card Styles**: Card preview hover
5. **Package Card Styles**: Card pacchetto con badge
6. **Booking Form Styles**: Form modal responsive
7. **Venue Detail Styles**: Pagina dettaglio completa
8. **Venues Page Styles**: Lista venues grid
9. **Responsive Design**: Breakpoint @768px

### CSS Variables:
```css
--background: #ffffff (light) / #0a0a0a (dark)
--foreground: #171717 (light) / #ededed (dark)
--primary: #0070f3
--primary-hover: #0051a2
```

## 🔌 Endpoint API Utilizzati

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/public/venues` | Lista tutti venues |
| GET | `/public/venues?city={city}` | Filtra per città |
| GET | `/public/venues/:id` | Dettaglio venue |
| POST | `/booking/:id` | Crea prenotazione |
| GET | `/venues/bookings` | Le mie prenotazioni (auth) |
| DELETE | `/booking/:id` | Cancella prenotazione (auth) |

## 📱 Features Responsive

### Mobile (< 768px):
- Menu hamburger navbar
- Grid a colonna singola
- Form a colonna singola
- Footer stack verticale
- Font size ridotto

### Desktop (≥ 768px):
- Menu orizzontale navbar
- Grid multi-colonna
- Form a 2 colonne
- Footer a 4 colonne

## 🗂️ Struttura File Finale

```
apps/client/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ✅ Homepage
│   │   ├── globals.css                 ✅ Stili globali
│   │   ├── venues/
│   │   │   ├── page.tsx                ✅ Lista venues
│   │   │   └── [id]/page.tsx           ✅ Dettaglio venue
│   │
│   ├── components/
│   │   ├── Navbar/                     ✅ Componente
│   │   ├── SearchBar/                  ✅ Componente
│   │   ├── VenueCard/                  ✅ Componente
│   │   ├── PackageCard/                ✅ Componente
│   │   ├── BookingForm/                ✅ Componente
│   │   └── Footer/                     ✅ Componente
│   │
│   ├── types/
│   │   ├── venue.ts                    ✅ Tipi
│   │   ├── booking.ts                  ✅ Tipi
│   │   └── index.ts                    ✅ Export
│   │
│   └── lib/
│       └── api.ts                      ✅ API Client
│
├── .env.example                        ✅ Template env vars
└── CLIENT_README.md                    ✅ Documentazione
```

## 🚀 Come Usare

### 1. Configurazione
```bash
# Copia .env.example in .env.local
cp .env.example .env.local

# Modifica API_URL se necessario
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Avvio
```bash
# Dalla root del monorepo
pnpm dev

# O solo il client
cd apps/client
pnpm dev
```

### 3. Navigazione
- **Homepage**: `http://localhost:3000/`
- **Esplora**: `http://localhost:3000/venues`
- **Ricerca**: `http://localhost:3000/venues?city=Milano`
- **Dettaglio**: `http://localhost:3000/venues/1`

## 🎯 Flusso Utente

1. **Homepage** → Vede featured venues + SearchBar
2. **Cerca città** → Va a `/venues?city=Milano`
3. **Vede risultati** → Grid di VenueCard
4. **Clicca venue** → Va a `/venues/[id]`
5. **Vede dettagli** → Info + Pacchetti
6. **Clicca "Prenota"** → Si apre BookingForm modal
7. **Compila form** → Conferma prenotazione
8. **Successo** → Messaggio di conferma

## 🔐 Note Autenticazione

⚠️ **TODO**: Il sistema attualmente usa `userId: 1` hardcoded nel BookingForm.

Per implementare autenticazione:
1. Aggiungere context/provider per auth (es. usando `@repo/ui` store)
2. Modificare BookingForm per prendere userId da context
3. Aggiungere protezione route per `/bookings`
4. Implementare login/logout nella Navbar

## 📚 Best Practices Seguite

✅ **Separazione dei componenti**: Ogni componente in cartella propria
✅ **Barrel exports**: `index.ts` per export puliti
✅ **TypeScript**: Tipizzazione forte per API e props
✅ **CSS Modulare**: Stili organizzati per sezione
✅ **Responsive**: Mobile-first design
✅ **API Client**: Centralizzato in `lib/api.ts`
✅ **Error Handling**: Stati loading/error/empty
✅ **Accessibilità**: Label, ARIA attributes
✅ **SEO**: Meta tags e semantic HTML

## 🔄 Compatibilità con Monorepo

La struttura è compatibile con:
- **`@repo/components`**: Possibile migrare componenti generici
- **`@repo/ui`**: Possibile usare stores Jotai per stato
- **`@repo/types`**: Possibile condividere tipi tra app
- **`@repo/hooks`**: Possibile creare hook riutilizzabili

## 📈 Prossimi Step Suggeriti

1. ✅ **Testare integrazione con backend**
2. 📝 Implementare pagina `/bookings` (le mie prenotazioni)
3. 🔐 Aggiungere sistema autenticazione
4. 🎨 Migrare componenti generici in `@repo/components`
5. 🧪 Aggiungere test (Jest + React Testing Library)
6. 📊 Aggiungere analytics
7. 🌍 Implementare i18n (multi-lingua)
8. 🗺️ Aggiungere mappa interattiva (Google Maps)

---

**Creato il**: 2025-10-06
**Versione**: 1.0.0
**Status**: ✅ Pronto per test e sviluppo
