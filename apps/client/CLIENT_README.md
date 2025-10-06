# Client App - Anywhere

Applicazione client per la piattaforma Anywhere, costruita con Next.js 13+ App Router.

## 📁 Struttura del Progetto

```
apps/client/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Homepage con featured venues
│   │   ├── layout.tsx            # Layout principale
│   │   ├── globals.css           # Stili globali
│   │   ├── venues/               # Route venues
│   │   │   ├── page.tsx          # Lista venues con ricerca
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Dettaglio venue singolo
│   │   └── bookings/             # Route prenotazioni
│   │
│   ├── components/               # Componenti riutilizzabili
│   │   ├── Navbar/               # Navigazione principale
│   │   ├── Footer/               # Footer con links
│   │   ├── SearchBar/            # Ricerca per città
│   │   ├── VenueCard/            # Card preview venue
│   │   ├── PackageCard/          # Card pacchetto
│   │   └── BookingForm/          # Form prenotazione
│   │
│   └── types/                    # Definizioni TypeScript
│       ├── venue.ts              # Tipi Venue e Package
│       ├── booking.ts            # Tipi Booking
│       └── index.ts              # Export barrel
```

## 🚀 Funzionalità Implementate

### 1. **Homepage** (`/`)
- Navbar con navigazione
- Hero section con titolo e sottotitolo
- SearchBar per cercare venues per città
- Sezione featured venues (primi 6)
- Footer con informazioni

### 2. **Lista Venues** (`/venues`)
- Ricerca venues per città (query parameter: `?city=Milano`)
- Griglia di VenueCard con preview
- SearchBar integrata
- Gestione stati loading/error/empty

### 3. **Dettaglio Venue** (`/venues/[id]`)
- Informazioni complete del venue
- Galleria foto
- Descrizione e servizi
- Orari di apertura
- Lista pacchetti disponibili
- Modal per prenotazione

### 4. **Sistema di Prenotazione**
- BookingForm con validazione
- Campi per data/ora inizio e fine
- Informazioni cliente (nome, cognome, email, telefono)
- Numero di persone
- Integrazione con API backend POST `/booking/:id`

## 🔌 Endpoint API Utilizzati

### Venues Pubblici
```typescript
// Lista tutti i venues o filtra per città
GET /public/venues?city={city}

// Dettagli venue specifico
GET /public/venues/:id
```

### Prenotazioni
```typescript
// Crea nuova prenotazione
POST /booking/:id
Body: {
  venueId: number,
  packageId: number,
  start: string (ISO datetime),
  end: string (ISO datetime),
  people: number,
  userId: number,
  customerInfo: {
    firstName: string,
    lastName: string,
    email: string,
    phone?: string
  }
}
```

## 🎨 Componenti

### Navbar
Navigazione sticky con:
- Logo "Anywhere"
- Links: Home, Esplora, Le mie prenotazioni
- Menu mobile responsive

### SearchBar
Form di ricerca con:
- Input text per città
- Bottone submit
- Navigazione automatica a `/venues?city=`
- Prop `onSearch` per custom handler

### VenueCard
Card preview con:
- Immagine (logo o prima foto)
- Nome e indirizzo
- Descrizione (troncata a 100 caratteri)
- Tags servizi (max 3 visibili)
- Link a pagina dettaglio

### PackageCard
Card pacchetto con:
- Immagine e badge tipo
- Nome e descrizione
- Icone capacità e metratura
- Lista piani tariffari
- Prezzo minimo
- Bottone prenota

### BookingForm
Form completo con:
- Sezione dettagli prenotazione (date, persone)
- Sezione info cliente
- Validazione campi required
- Gestione errori
- Stati loading

### Footer
Footer informativo con:
- Descrizione progetto
- Links utili
- Informazioni contatto
- Copyright

## 🎯 TypeScript Types

### Venue
```typescript
interface Venue {
  id: number;
  name: string;
  address: string;
  description: string | null;
  services: string[];
  photos: string[];
  logoURL: string | null;
  latitude: number | null;
  longitude: number | null;
  openingDays?: VenueOpeningDay[];
  packages?: Package[];
}
```

### Package
```typescript
interface Package {
  id: number;
  name: string;
  description: string | null;
  type: string;
  squareMetres: number | null;
  capacity: number | null;
  photos: string[];
  plans: PackagePlan[];
}
```

### BookingFormData
```typescript
interface BookingFormData {
  venueId: number;
  packageId: number;
  start: string;
  end: string;
  people: number;
  userId: number;
  customerInfo: CustomerInfo;
}
```

## 🔧 Configurazione

### Environment Variables
Crea un file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Avvio Sviluppo
```bash
# Dalla root del monorepo
pnpm dev

# O solo il client
cd apps/client
pnpm dev
```

## 📱 Responsive Design

Tutti i componenti sono responsive con breakpoint a 768px:
- Menu mobile per navbar
- Grid a colonna singola per cards
- Form ottimizzato per mobile
- Footer adattivo

## 🎨 Temi

Il CSS supporta dark/light mode tramite CSS variables:
- `--background`: Colore sfondo
- `--foreground`: Colore testo
- `--primary`: Colore primario (#0070f3)
- `--primary-hover`: Colore primario hover

## 🚧 TODO / Miglioramenti Futuri

- [ ] Implementare autenticazione utente
- [ ] Pagina "Le mie prenotazioni" con lista bookings
- [ ] Sistema di recensioni
- [ ] Filtri avanzati (prezzo, servizi, capacità)
- [ ] Mappa interattiva per venues
- [ ] Sistema di pagamento
- [ ] Notifiche real-time
- [ ] Gestione preferiti
- [ ] Multi-lingua (i18n)
- [ ] PWA support

## 🔗 Links Correlati

- [Backend API Documentation](../../docs/BOOKING_API.md)
- [Monorepo README](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
