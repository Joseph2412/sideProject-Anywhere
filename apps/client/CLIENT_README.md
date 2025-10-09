# 📖 Client App - Anywhere - Documentazione Completa

> Applicazione client per la piattaforma Anywhere, costruita con **Next.js 15** (App Router) e **TypeScript**.

**Versione**: 2.0 | **Status**: ✅ Produzione Ready | **Ultimo Aggiornamento**: Gennaio 2025

---

## 📑 Indice

1. [Quick Start](#-quick-start)
2. [Struttura del Progetto](#-struttura-del-progetto)
3. [Architettura](#-architettura)
4. [Funzionalità](#-funzionalità)
5. [Sistema di Autenticazione](#-sistema-di-autenticazione)
6. [Componenti](#-componenti)
7. [Endpoint API](#-endpoint-api)
8. [TypeScript Types](#-typescript-types)
9. [Styling](#-styling)
10. [Testing](#-testing)
11. [Troubleshooting](#-troubleshooting)
12. [Deployment](#-deployment)

---

## 🚀 Quick Start

### Setup in 3 Passi

#### 1️⃣ Configura Environment

```bash
cd apps/client
cp .env.example .env.local
```

File `.env.local`:

```env
NEXT_PUBLIC_API_HOST=http://localhost:3001
```

#### 2️⃣ Avvia il Backend

```bash
cd apps/api
pnpm dev  # → http://localhost:3001
```

#### 3️⃣ Avvia il Client

```bash
cd apps/client
pnpm dev  # → http://localhost:3000
```

### ✅ Verifica Installazione

Apri `http://localhost:3000` e verifica:

- ✅ Homepage si carica
- ✅ Navbar appare con logo "Anywhere"
- ✅ Featured venues visibili (se ci sono dati nel DB)
- ✅ Footer con tutte le sezioni

---

## 📁 Struttura del Progetto

```
apps/client/
├── 📄 Documentazione
│   ├── CLIENT_README.md              # ← Questo file (completo)
│   ├── AUTH_IMPLEMENTATION.md        # Sistema autenticazione
│   ├── ARCHITECTURE.md               # Diagrammi architettura
│   ├── QUICKSTART.md                 # Setup rapido
│   ├── TESTING_GUIDE.md              # Guida testing
│   └── STRUCTURE_SUMMARY.md          # Summary dettagliato
│
├── 📂 src/
│   ├── 📂 app/                       # Next.js App Router
│   │   ├── layout.tsx                # Root layout con AuthProvider
│   │   ├── providers.tsx             # Client providers wrapper
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Stili globali + auth
│   │   │
│   │   ├── 📂 login/
│   │   │   └── page.tsx              # Pagina login ✅
│   │   │
│   │   ├── 📂 register/
│   │   │   └── page.tsx              # Pagina registrazione ✅
│   │   │
│   │   ├── 📂 venues/
│   │   │   ├── page.tsx              # Lista venues
│   │   │   └── 📂 [id]/
│   │   │       └── page.tsx          # Dettaglio venue
│   │   │
│   │   └── 📂 bookings/
│   │       ├── page.tsx              # Prenotazioni utente ✅ Protetta
│   │       └── bookings.module.css   # Stili CSS Module
│   │
│   ├── 📂 components/                # Componenti riutilizzabili
│   │   ├── Navbar/
│   │   │   └── Navbar.tsx            # Navbar con auth menu ✅
│   │   ├── Footer/
│   │   │   └── Footer.tsx            # Footer sito
│   │   ├── SearchBar/
│   │   │   └── SearchBar.tsx         # Ricerca città
│   │   ├── VenueCard/
│   │   │   └── VenueCard.tsx         # Card preview venue
│   │   ├── PackageCard/
│   │   │   └── PackageCard.tsx       # Card pacchetto
│   │   ├── BookingForm/
│   │   │   └── BookingForm.tsx       # Form prenotazione
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.tsx    # HOC route protette ✅
│   │
│   ├── 📂 contexts/
│   │   └── AuthContext.tsx           # Context autenticazione ✅
│   │
│   ├── 📂 hooks/
│   │   └── useAuthFetch.ts           # Hook API autenticate ✅
│   │
│   ├── 📂 types/
│   │   ├── venue.ts                  # Tipi Venue, Package
│   │   ├── booking.ts                # Tipi Booking
│   │   └── index.ts                  # Barrel exports
│   │
│   └── 📂 lib/
│       └── api.ts                    # Client API helper
│
├── 📂 public/                        # Asset statici
│   ├── next.svg
│   ├── vercel.svg
│   └── ...
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local                        # Config environment (git ignored)
```

---

## 🏗️ Architettura

### Stack Tecnologico


| Layer         | Tecnologia                | Versione |
| ------------- | ------------------------- | -------- |
| **Framework** | Next.js                   | 15.x     |
| **Language**  | TypeScript                | 5.x      |
| **Styling**   | CSS Modules + globals.css | -        |
| **State**     | React Context API         | 18.x     |
| **Auth**      | JWT (7 giorni)            | -        |
| **HTTP**      | Fetch API                 | Native   |
| **Backend**   | Fastify                   | 4.x      |
| **Database**  | PostgreSQL + Prisma       | -        |

### Diagramma Architettura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APP (Next.js 15)                  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  PAGES        │  │  COMPONENTS   │  │  CONTEXTS     │
│  (Routes)     │  │  (UI/Logic)   │  │  (State)      │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   BACKEND API         │
                │   (Fastify + Prisma)  │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   PostgreSQL DB       │
                └───────────────────────┘
```

### Component Hierarchy

```
<AuthProvider>                        ← Context globale auth
  <Navbar />                          ← Navigazione persistente
  
  <Routes>
    / → <Homepage />
        ├─ <SearchBar />
        ├─ <VenueCard /> × 6
        └─ <Footer />
  
    /login → <LoginPage />
  
    /register → <RegisterPage />
  
    /venues → <VenuesListPage />
        ├─ <SearchBar />
        ├─ <VenueCard /> × N
        └─ <Footer />
  
    /venues/[id] → <VenueDetailPage />
        ├─ <PackageCard /> × N
        ├─ <BookingForm /> (modal)
        └─ <Footer />
  
    /bookings → <ProtectedRoute>      ← Auth richiesta
        <BookingsPage />
        ├─ Booking cards
        └─ <Footer />
      </ProtectedRoute>
  </Routes>
</AuthProvider>
```

---

## 🚀 Funzionalità

### 1. **Homepage** (`/`)

**Descrizione**: Landing page con venues in evidenza

**Features**:

- 🏠 Hero section con titolo e sottotitolo
- 🔍 SearchBar per ricerca città
- 🎯 6 venues featured (primi nel DB)
- 📱 Responsive design
- 🦶 Footer con info e link

**API**: `GET /public/venues` (limit 6)

---

### 2. **Autenticazione** (`/login`, `/register`)

**Descrizione**: Sistema completo JWT authentication

**Features**:

- 🔐 Login con email + password
- ✍️ Registrazione con nome, email, password
- 🔄 Auto-redirect dopo login/register
- ❌ Gestione errori backend
- 💾 Token storage localStorage (7 giorni)
- 🔒 Verifica automatica token all'avvio

**Endpoints**:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`

**Vedere**: [Sistema di Autenticazione](#-sistema-di-autenticazione)

---

### 3. **Lista Venues** (`/venues`)

**Descrizione**: Griglia di tutti i venues, filtrabile per città

**Features**:

- 📋 Lista completa venues
- 🔍 Filtro per città: `?city=Milano`
- 🎴 VenueCard con preview
- ⏳ Stati loading/error/empty
- 🔄 SearchBar integrata
- 📱 Grid responsive (1/2/3 colonne)

**API**: `GET /public/venues?city={city}`

---

### 4. **Dettaglio Venue** (`/venues/[id]`)

**Descrizione**: Pagina completa informazioni venue

**Features**:

- 🖼️ Logo e galleria foto (max 4)
- 📍 Nome, indirizzo, descrizione
- 🏷️ Tags servizi disponibili
- 🕒 Orari apertura (7 giorni)
- 📦 Lista pacchetti disponibili
- 💰 Prezzi e piani tariffari
- 🎯 Button "Prenota" → Modal form

**API**: `GET /public/venues/:id`

---

### 5. **Sistema Prenotazioni** (`/bookings`)

**Descrizione**: Pagina privata con prenotazioni utente

**Features**:

- 🔒 **Protetta** con `ProtectedRoute`
- 📋 Lista bookings utente
- 📅 Date inizio/fine
- 👥 Numero persone
- 💵 Prezzo totale
- ✅ Status prenotazione
- ❌ Cancellazione prenotazione
- 🎨 CSS Module (no inline styles)

**API**: `GET /api/bookings/venues/bookings` (auth required)

---

### 6. **Form Prenotazione** (Modal)

**Descrizione**: Form completo per creare booking

**Features**:

- 📅 Date picker inizio/fine
- 👥 Numero persone
- 👤 Info cliente (nome, cognome, email, telefono)
- ✔️ Validazione campi required
- ⏳ Loading state submit
- ✅ Success feedback
- ❌ Error handling

**API**: `POST /booking/:venueId`

---

## 🔐 Sistema di Autenticazione

### Panoramica

Sistema JWT completo con token a **7 giorni** (no refresh token necessario).

### Componenti Auth

1. **AuthContext** (`src/contexts/AuthContext.tsx`)

   - State globale: `user`, `loading`, `error`, `isAuthenticated`
   - Funzioni: `login()`, `register()`, `logout()`, `clearError()`
   - Verifica token all'avvio con `GET /auth/me`
2. **useAuthFetch** (`src/hooks/useAuthFetch.ts`)

   - Hook per API calls autenticate
   - Aggiunge automaticamente `Authorization: Bearer <token>`
   - Metodi: `get()`, `post()`, `put()`, `delete()`
3. **ProtectedRoute** (`src/components/ProtectedRoute/ProtectedRoute.tsx`)

   - HOC per proteggere route private
   - Redirect a `/login` se non autenticato
   - Loading spinner durante verifica

### Flusso di Login

```
1. User compila form → email, password
2. Click "Accedi"
3. POST /auth/login { email, password }
4. Backend verifica credenziali
   ✅ Success: { token: "jwt...", user: {...} }
   ❌ Error: { error: "Credenziali non valide" }
5. Frontend:
   - Salva token in localStorage
   - Aggiorna AuthContext.user
   - Redirect automatico a "/"
```

### Flusso di Registrazione

```
1. User compila form → nome, email, password, conferma
2. Validazione frontend:
   - Email valida (regex)
   - Password >= 8 caratteri
   - Conferma password match
3. Click "Registrati"
4. POST /auth/signup { email, password, firstName, lastName, role: "USER" }
5. Backend:
   - Crea user nel DB (password hashed)
   - Genera JWT token (7 giorni)
   ✅ Success: { token: "jwt...", user: {...} }
6. Frontend:
   - Salva token localStorage
   - Aggiorna AuthContext
   - Redirect a "/"
```

### Verifica Token all'Avvio

```
App Start
  ↓
AuthProvider legge "token" da localStorage
  ↓
GET /auth/me (Header: Authorization: Bearer <token>)
  ↓
Backend verifica JWT:
  ✅ Valid → Return user data
  ❌ Invalid/Expired → Return 401
  ↓
Frontend:
  ✅ isAuthenticated = true + user data
  ❌ isAuthenticated = false + localStorage.clear()
```

### Chiamate API Autenticate

```typescript
// Nel componente
const { get, post } = useAuthFetch();

// GET request
const data = await get('/api/bookings/venues/bookings');

// POST request
const result = await post('/booking/1', { 
  venueId: 1,
  packageId: 2,
  start: "2025-01-15T10:00:00Z",
  end: "2025-01-15T18:00:00Z",
  people: 10
});

// useAuthFetch aggiunge automaticamente:
// Authorization: Bearer <token>
```

### Protezione Route

```tsx
// apps/client/src/app/bookings/page.tsx
export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}

// Se user NON autenticato → redirect a /login
// Se user autenticato → mostra contenuto
```

### Navbar con User Menu

**Utente NON autenticato**:

- Bottone "Accedi" → `/login`
- Bottone "Registrati" → `/register`

**Utente autenticato**:

- User button con nome utente + icona
- Dropdown menu:
  - Info: email e ruolo
  - Link: "Le mie prenotazioni"
  - Button: "Logout" (rosso)

**Mobile**:

- Hamburger menu con tutti i link
- Sezione user nel mobile menu
- Logout button evidenziato

### Token Storage

```typescript
// localStorage (browser only)
Key: "token"
Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // JWT string

// Durata: 7 giorni (backend config)
// Dopo 7 giorni: token scade → user deve rifare login
```

### Endpoint Backend Auth


| Method | Endpoint       | Auth | Body                                       | Response                                   |
| ------ | -------------- | ---- | ------------------------------------------ | ------------------------------------------ |
| POST   | `/auth/login`  | ❌   | `{ email, password }`                      | `{ token, user }`                          |
| POST   | `/auth/signup` | ❌   | `{ email, password, firstName, lastName }` | `{ token, user }`                          |
| GET    | `/auth/me`     | ✅   | -                                          | `{ id, email, firstName, lastName, role }` |

### Security Notes

- ✅ Token JWT firmato con `JWT_SECRET`
- ✅ Password hashate con bcrypt nel backend
- ✅ Token nel header `Authorization` (non query param)
- ✅ Validazione input lato client e server
- ⚠️ localStorage: vulnerabile a XSS
- 🔜 **Produzione**: Considera httpOnly cookies

---

## 🧩 Componenti

### Navbar

**Path**: `src/components/Navbar/Navbar.tsx`

**Descrizione**: Navigazione principale sticky con auth system

**Props**: Nessuna (usa `useAuth()` hook)

**Features**:

- Logo "Anywhere" → Link a `/`
- Links desktop: Home, Esplora, Le mie prenotazioni (se auth)
- User menu dropdown (se autenticato)
- Login/Register buttons (se non autenticato)
- Hamburger menu mobile (<768px)
- Sticky position on scroll

**Stati**:

```typescript
const { user, isAuthenticated, logout } = useAuth();
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [userMenuOpen, setUserMenuOpen] = useState(false);
```

**Stili**: Definiti in `app/globals.css` (`.navbar-*`)

---

### SearchBar

**Path**: `src/components/SearchBar/SearchBar.tsx`

**Descrizione**: Form ricerca venues per città

**Props**:

```typescript
interface SearchBarProps {
  initialValue?: string;      // Valore iniziale input
  onSearch?: (city: string) => void;  // Custom handler
}
```

**Features**:

- Input text con placeholder "Cerca per città"
- Button submit con icona 🔍
- Submit → `router.push(/venues?city=${city})`
- Gestione form onSubmit

**Esempio**:

```tsx
<SearchBar initialValue="Milano" />
<SearchBar onSearch={(city) => console.log(city)} />
```

---

### VenueCard

**Path**: `src/components/VenueCard/VenueCard.tsx`

**Descrizione**: Card preview venue per liste/grid

**Props**:

```typescript
interface VenueCardProps {
  venue: Venue;  // Oggetto venue completo
}
```

**Features**:

- Immagine (logo o prima foto array)
- Nome venue (h3)
- Indirizzo (con icona 📍)
- Descrizione truncata (100 caratteri)
- Tags servizi (primi 3 + count rimanenti)
- Link a `/venues/:id`
- Hover effect e transition

**Esempio**:

```tsx
<VenueCard venue={venueData} />
```

---

### PackageCard

**Path**: `src/components/PackageCard/PackageCard.tsx`

**Descrizione**: Card pacchetto con piani tariffari

**Props**:

```typescript
interface PackageCardProps {
  package: Package;
  onBook: (packageId: number) => void;  // Callback prenotazione
}
```

**Features**:

- Immagine package
- Badge tipo (Sala Riunioni, Postazione, etc.)
- Nome e descrizione
- Icone: 👥 capacità, 📐 metratura
- Lista piani con prezzi
- Button "Prenota" → trigger onBook
- Prezzo minimo evidenziato

---

### BookingForm

**Path**: `src/components/BookingForm/BookingForm.tsx`

**Descrizione**: Form modale per creare prenotazione

**Props**:

```typescript
interface BookingFormProps {
  venueId: number;
  packageId: number;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Features**:

- 2 sezioni: Dettagli Prenotazione + Info Cliente
- Campi: data inizio, data fine, persone, nome, cognome, email, telefono
- Validazione required fields
- Loading state durante submit
- Error display
- API call: `POST /booking/:venueId`
- Success → close + callback

**Esempio**:

```tsx
{showBookingForm && (
  <div className="modal-overlay" onClick={handleClose}>
    <BookingForm
      venueId={venueId}
      packageId={selectedPackage.id}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  </div>
)}
```

---

### Footer

**Path**: `src/components/Footer/Footer.tsx`

**Descrizione**: Footer sito con info e link

**Props**: Nessuna

**Features**:

- 4 colonne: Anywhere, Link Utili, Informazioni, Contatti
- Link navigazione
- Info contatto
- Copyright dinamico (anno corrente)
- Responsive (stack mobile)

---

### ProtectedRoute

**Path**: `src/components/ProtectedRoute/ProtectedRoute.tsx`

**Descrizione**: HOC per proteggere route che richiedono auth

**Props**:

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

**Logic**:

```typescript
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) router.push('/login');
return <>{children}</>;
```

**Uso**:

```tsx
export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <YourProtectedContent />
    </ProtectedRoute>
  );
}
```

---

## 🔌 Endpoint API

### Base URL

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
```

### Venues Pubblici (No Auth)

#### GET `/public/venues`

**Descrizione**: Lista tutti i venues o filtra per città

**Query Params**:

- `city` (optional): string - Filtra per città

**Response**:

```typescript
{
  venues: Venue[]
}
```

**Esempio**:

```typescript
// Tutti i venues
fetch(`${API_URL}/public/venues`)

// Filtra per città
fetch(`${API_URL}/public/venues?city=Milano`)
```

---

#### GET `/public/venues/:id`

**Descrizione**: Dettagli completi venue singolo

**Params**:

- `id`: number - ID venue

**Response**:

```typescript
{
  venue: Venue & {
    packages: Package[],
    openingDays: VenueOpeningDay[]
  }
}
```

---

### Autenticazione

#### POST `/auth/login`

**Descrizione**: Login utente

**Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "message": "Login Effettuato con Successo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Mario",
    "lastName": "Rossi",
    "role": "USER"
  }
}
```

---

#### POST `/auth/signup`

**Descrizione**: Registrazione nuovo utente

**Body**:

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Luigi",
  "lastName": "Verdi",
  "role": "USER"
}
```

**Response**: Stesso formato di `/auth/login`

---

#### GET `/auth/me`

**Descrizione**: Verifica token e ottiene dati utente corrente

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Mario",
  "lastName": "Rossi",
  "role": "USER"
}
```

---

### Prenotazioni (Auth Required)

#### GET `/api/bookings/venues/bookings`

**Descrizione**: Lista prenotazioni utente autenticato

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "bookings": [
    {
      "id": 1,
      "venueId": 1,
      "packageId": 2,
      "start": "2025-01-15T10:00:00Z",
      "end": "2025-01-15T18:00:00Z",
      "status": "CONFIRMED",
      "totalPrice": 150.00,
      "people": 10,
      "venue": { "name": "Venue Name", "address": "..." },
      "package": { "name": "Package Name", "type": "..." }
    }
  ]
}
```

---

#### POST `/booking/:venueId`

**Descrizione**: Crea nuova prenotazione

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "venueId": 1,
  "packageId": 2,
  "start": "2025-01-15T10:00:00Z",
  "end": "2025-01-15T18:00:00Z",
  "people": 10,
  "userId": 1,
  "customerInfo": {
    "firstName": "Mario",
    "lastName": "Rossi",
    "email": "mario.rossi@example.com",
    "phone": "+39 123456789"
  }
}
```

**Response**:

```json
{
  "booking": {
    "id": 1,
    "venueId": 1,
    "packageId": 2,
    "start": "2025-01-15T10:00:00Z",
    "end": "2025-01-15T18:00:00Z",
    "status": "CONFIRMED",
    "totalPrice": 150.00,
    "people": 10
  }
}
```

---

#### DELETE `/api/bookings/booking/:bookingId`

**Descrizione**: Cancella prenotazione

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "message": "Prenotazione cancellata con successo"
}
```

---

## 🎯 TypeScript Types

### Venue

**Path**: `src/types/venue.ts`

```typescript
interface Venue {
  id: number;
  name: string;
  address: string;
  description: string | null;
  services: string[];          // Array di servizi disponibili
  photos: string[];            // Array URL foto
  logoURL: string | null;      // URL logo venue
  latitude: number | null;
  longitude: number | null;
  openingDays?: VenueOpeningDay[];
  packages?: Package[];
}

interface VenueOpeningDay {
  day: string;                 // "MONDAY", "TUESDAY", etc.
  isOpen: boolean;
  openTime: string | null;     // "09:00"
  closeTime: string | null;    // "18:00"
}
```

---

### Package

**Path**: `src/types/venue.ts`

```typescript
interface Package {
  id: number;
  name: string;
  description: string | null;
  type: string;                // "SALA_RIUNIONI", "POSTAZIONE_FISSA", etc.
  squareMetres: number | null; // Metri quadrati
  capacity: number | null;     // Capacità persone
  photos: string[];            // Array URL foto
  plans: PackagePlan[];        // Piani tariffari
}

interface PackagePlan {
  id: number;
  name: string;                // "Giornaliero", "Mensile", etc.
  description: string | null;
  price: number;               // Prezzo in euro
  duration: string | null;     // "1 giorno", "1 mese", etc.
}
```

---

### Booking

**Path**: `src/types/booking.ts`

```typescript
interface Booking {
  id: number;
  venueId: number;
  packageId: number;
  start: string;               // ISO datetime
  end: string;                 // ISO datetime
  status: string;              // "CONFIRMED", "CANCELLED", "PENDING"
  totalPrice: number;
  people: number;
  venue?: {
    name: string;
    address: string;
  };
  package?: {
    name: string;
    type: string;
  };
}

interface BookingFormData {
  venueId: number;
  packageId: number;
  start: string;
  end: string;
  people: number;
  userId: number;
  customerInfo: CustomerInfo;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
```

---

### User (Auth)

**Path**: `src/contexts/AuthContext.tsx`

```typescript
interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;               // "USER", "HOST", "ADMIN"
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;          // Alias per compatibilità
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}
```

---

## 🎨 Styling

### Approccio CSS

**Due strategie**:

1. **globals.css** - Stili globali, layout, auth components
2. **CSS Modules** - Stili specifici per pagina/component

### globals.css

**Path**: `src/app/globals.css`

**Contiene**:

- Reset CSS e variabili globali
- Layout (navbar, footer)
- Stili auth (login, register, user menu)
- Utilities (buttons, forms, modals)
- Responsive breakpoint @768px

**Variabili CSS**:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #0070f3;
  --primary-hover: #0051cc;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  /* ... */
}
```

---

### CSS Modules

**Path**: `src/app/bookings/bookings.module.css`

**Esempio**:

```css
.bookingsPageContainer {
  min-height: 100vh;
  padding: 2rem;
}

.bookingCard {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**Uso**:

```tsx
import styles from './bookings.module.css';

<div className={styles.bookingsPageContainer}>
  <div className={styles.bookingCard}>
    {/* content */}
  </div>
</div>
```

**Vantaggi**:

- ✅ Scope locale (no conflitti)
- ✅ Separazione responsabilità
- ✅ Type-safe con TypeScript
- ✅ Riutilizzabili

---

### Responsive Breakpoints

```css
/* Mobile First */
.container {
  display: flex;
  flex-direction: column;
}

/* Tablet e Desktop */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    gap: 2rem;
  }
}

/* Large Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Grid System**:

```
Mobile (<768px)     → 1 colonna (stack)
Tablet (768-1024px) → 2 colonne
Desktop (>1024px)   → 3 colonne
```

---

### Classi Utility Comuni

```css
/* Buttons */
.btn-primary { /* Blu, gradiente */ }
.btn-secondary { /* Grigio */ }
.btn-danger { /* Rosso logout */ }

/* Loading */
.spinner { /* Animazione rotazione */ }

/* Modal */
.modal-overlay { /* Backdrop blur */ }
.modal-content { /* Card centrata */ }

/* Form */
.form-group { /* Label + input wrapper */ }
.form-error { /* Messaggio errore rosso */ }
```

---

## 🧪 Testing

### Testing Checklist

#### ✅ Homepage

- [ ]  Navbar appare
- [ ]  Hero section visibile
- [ ]  SearchBar funziona
- [ ]  Featured venues (max 6) caricano
- [ ]  Footer completo
- [ ]  Links navigano correttamente

#### ✅ Autenticazione

**Login**:

- [ ]  Form login visibile
- [ ]  Validazione email
- [ ]  Password required
- [ ]  Errore: credenziali invalide
- [ ]  Successo: redirect + token salvato
- [ ]  Link a /register funziona

**Register**:

- [ ]  Form register completo
- [ ]  Validazione: email valida
- [ ]  Validazione: password >= 8 caratteri
- [ ]  Validazione: conferma password match
- [ ]  Tutti campi required
- [ ]  Successo: redirect + token salvato
- [ ]  Link a /login funziona

**Auth Flow**:

- [ ]  Token salvato in localStorage come "token"
- [ ]  Navbar mostra user menu dopo login
- [ ]  Logout pulisce token e redirect
- [ ]  Refresh page mantiene auth (se token valido)
- [ ]  Token scaduto → auto-logout

#### ✅ Venues

**Lista**:

- [ ]  Pagina /venues mostra tutti i venues
- [ ]  Query ?city=Milano filtra correttamente
- [ ]  SearchBar filtra e aggiorna URL
- [ ]  Loading state durante fetch
- [ ]  Empty state se nessun risultato
- [ ]  VenueCard link a /venues/:id

**Dettaglio**:

- [ ]  Logo e nome venue
- [ ]  Galleria foto (max 4)
- [ ]  Descrizione completa
- [ ]  Tags servizi
- [ ]  Orari apertura (7 giorni)
- [ ]  Packages con piani
- [ ]  Button "Prenota" apre modal

#### ✅ Prenotazioni

**Pagina Bookings** (/bookings):

- [ ]  Redirect a /login se non autenticato
- [ ]  Lista bookings utente carica
- [ ]  Ogni card mostra: venue, package, date, persone, prezzo
- [ ]  Button cancella chiede conferma
- [ ]  Cancellazione aggiorna lista
- [ ]  CSS Module applicato (no inline styles)

**Form Booking**:

- [ ]  Modal si apre da PackageCard
- [ ]  Tutti campi visibili
- [ ]  Validazione required
- [ ]  Date inizio < data fine
- [ ]  Email valida
- [ ]  Submit invia POST
- [ ]  Success: modal chiude + alert
- [ ]  Error: messaggio visibile
- [ ]  Click overlay chiude modal

#### ✅ Responsive

- [ ]  Mobile (<768px): hamburger menu
- [ ]  Mobile: grid 1 colonna
- [ ]  Tablet (768px): grid 2 colonne
- [ ]  Desktop (>1024px): grid 3 colonne
- [ ]  Form usabili su mobile
- [ ]  Modal non esce da schermo mobile

#### ✅ Navbar

- [ ]  Logo → /
- [ ]  "Home" → /
- [ ]  "Esplora" → /venues
- [ ]  "Le mie prenotazioni" → /bookings (solo se auth)
- [ ]  Sticky on scroll
- [ ]  User menu dropdown funziona
- [ ]  Login/Register buttons (se non auth)
- [ ]  Hamburger mobile (<768px)

#### ✅ Footer

- [ ]  4 sezioni visibili
- [ ]  Copyright anno corrente
- [ ]  Links funzionanti
- [ ]  Responsive mobile (stack)

---

### Testing con DevTools

#### Network Tab

```
Monitora chiamate API:
- Status codes (200, 401, 404, 500)
- Headers (Authorization)
- Request/Response payload
- Timing
```

#### Console

```
Verifica:
- Nessun errore TypeScript
- Warning React (keys, etc.)
- Log debug auth ("🔍 Verifying token", "✅ Token valid")
```

#### React DevTools

```
Installa extension:
- Ispeziona component tree
- Monitora state/props
- Profile performance
```

#### Application Tab

```
localStorage:
- Key "token" presente dopo login
- Token rimosso dopo logout
```

---

### Test Manuali Critici

1. **Auth Flow Completo**:

   ```
   Register → Login → Browse venue → Book → View bookings → Logout
   ```
2. **Responsive Test**:

   ```
   DevTools → Device toolbar → Test:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
   ```
3. **Error Handling**:

   ```
   - Stop backend → Verifica error messages
   - Invalid credentials → Verifica form error
   - Network throttling → Verifica loading states
   ```
4. **Browser Compatibility**:

   ```
   Test su:
   - Chrome/Edge ✅
   - Firefox ✅
   - Safari ✅
   - Mobile Safari (iOS) ✅
   - Chrome Mobile (Android) ✅
   ```

---

## 🐛 Troubleshooting

### Problema: "Failed to fetch venues"

**Causa**: Backend non avviato o URL sbagliato

**Soluzione**:

```bash
# 1. Verifica backend running
cd apps/api
pnpm dev  # Deve essere su http://localhost:3001

# 2. Verifica .env.local
cat apps/client/.env.local
# NEXT_PUBLIC_API_HOST=http://localhost:3001

# 3. Restart client
cd apps/client
pnpm dev
```

---

### Problema: Token non viene salvato

**Causa**: localStorage non disponibile (SSR) o errore JS

**Soluzione**:

```typescript
// Verifica console browser
localStorage.getItem("token")  // Deve restituire token string

// AuthContext usa "use client" per localStorage
// Verifica file inizi con: "use client";
```

---

### Problema: 401 Unauthorized continui

**Causa**: Token malformato o header sbagliato

**Soluzione**:

```typescript
// Verifica formato header in useAuthFetch:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//              ^^^^^^ Spazio dopo "Bearer"!

// Verifica JWT_SECRET uguale tra backend e verifica
// apps/api/.env → JWT_SECRET=your-secret-key
```

---

### Problema: Redirect loop /login

**Causa**: `/auth/me` non ritorna user o token invalido

**Debug**:

```bash
# 1. Verifica console logs
# Deve mostrare: "✅ Token valid, user: {...}"
# Se mostra: "❌ Token invalid" → problema backend

# 2. Test manuale API
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:3001/auth/me

# Deve ritornare 200 + user data
```

**Soluzione**:

- Verifica endpoint `/auth/me` implementato backend
- Verifica `fastify.authenticate` middleware funziona
- Rigenera token con nuovo login

---

### Problema: CSS non applicato

**Causa**: Import sbagliato o classname errata

**Soluzione**:

```typescript
// ❌ Sbagliato
import './bookings.css';  // Non CSS Module
<div className="booking-card">  // Kebab-case

// ✅ Corretto
import styles from './bookings.module.css';  // .module.css!
<div className={styles.bookingCard}>  // camelCase + styles.
```

---

### Problema: Immagini non caricano

**Causa**: URL proxy S3 non configurato o CORS

**Soluzione**:

```bash
# Verifica configurazione S3 backend
# apps/api/plugins/s3.ts

# Verifica CORS permette origine client
# apps/api/index.ts → fastify.register(@fastify/cors)
```

---

### Problema: Modal non si chiude

**Causa**: Event propagation

**Soluzione**:

```tsx
// Assicurati stopPropagation sul content:
<div className="modal-overlay" onClick={handleClose}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    {/* Form */}
  </div>
</div>
```

---

### Problema: TypeScript errors

**Causa**: Types mancanti o disallineati

**Soluzione**:

```bash
# Rigenera types
cd apps/client
pnpm tsc --noEmit  # Verifica errori

# Controlla imports types:
import { Venue, Package, Booking } from '@/types';

# Se errori persistenti:
rm -rf .next
pnpm dev
```

---

### CORS Errors

**Sintomi**: "Access to fetch blocked by CORS policy"

**Soluzione Backend**:

```typescript
// apps/api/index.ts
await server.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:3002"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"]
});
```

---

## 🚀 Deployment

### Preparazione Pre-Deploy

#### 1. Environment Variables

```env
# Production .env
NEXT_PUBLIC_API_HOST=https://your-api.com
```

#### 2. Build Test

```bash
cd apps/client
pnpm build
pnpm start  # Test production build locally
```

#### 3. Type Check

```bash
pnpm tsc --noEmit
# Zero errors prima di deploy!
```

---

### Opzioni Deploy

#### Vercel (Raccomandato)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/client
vercel

# Aggiungi environment variables su Vercel dashboard:
# NEXT_PUBLIC_API_HOST=https://your-api.com
```

**Vantaggi**:

- ✅ Zero config per Next.js
- ✅ CDN globale
- ✅ Auto SSL
- ✅ Preview deploys per PR

---

#### Netlify

```bash
# netlify.toml
[build]
  command = "cd apps/client && pnpm build"
  publish = "apps/client/.next"

# Deploy
netlify deploy --prod
```

---

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t anywhere-client .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_HOST=https://api.com \
  anywhere-client
```

---

### Post-Deploy Checklist

- [ ]  Homepage carica correttamente
- [ ]  API calls funzionano (verifica Network tab)
- [ ]  Login/Register funzionanti
- [ ]  Token persiste dopo refresh
- [ ]  Immagini venues caricano
- [ ]  Responsive su mobile
- [ ]  SSL attivo (https)
- [ ]  Lighthouse score > 90
- [ ]  Console senza errori

---

## 📊 Performance

### Metriche Target


| Metrica                  | Target  | Note                    |
| ------------------------ | ------- | ----------------------- |
| First Contentful Paint   | < 1.5s  | Primo elemento visibile |
| Largest Contentful Paint | < 2.5s  | Contenuto principale    |
| Time to Interactive      | < 3.5s  | Pagina interattiva      |
| Cumulative Layout Shift  | < 0.1   | Layout stabile          |
| Bundle Size (Initial)    | < 200KB | Gzipped                 |

### Ottimizzazioni Implementate

✅ **Code Splitting**: Next.js route-based automatic
✅ **CSS Modules**: Scope isolato, no conflitti
✅ **TypeScript**: Type safety, meno runtime errors

### Ottimizzazioni Future

⬜ **Image Optimization**: Usa `next/image`
⬜ **Font Optimization**: `next/font`
⬜ **API Caching**: React Query / SWR
⬜ **Service Worker**: Offline support
⬜ **Lazy Loading**: Dynamic imports componenti pesanti

---

## 📚 Riferimenti

### Documentazione Esterna

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Modules](https://github.com/css-modules/css-modules)

### Documentazione Progetto

- **Backend API**: `../../docs/BOOKING_API.md`
- **Monorepo Setup**: `../../README.md`
- **Auth Details**: `./AUTH_IMPLEMENTATION.md`
- **Architecture**: `./ARCHITECTURE.md`
- **Testing**: `./TESTING_GUIDE.md`

---

## 🎯 Roadmap & TODO

### Features da Implementare

#### Alta Priorità

- [ ]  **Reviews System**: Rating e recensioni per venues
- [ ]  **Favorites**: Salva venues preferiti
- [ ]  **Notifications**: Sistema notifiche (email/push)
- [ ]  **Payment Integration**: Stripe/PayPal per pagamenti
- [ ]  **Advanced Filters**: Prezzo, servizi, capacità, disponibilità
- [ ]  **Calendar View**: Vista calendario per bookings

#### Media Priorità

- [ ]  **User Profile**: Pagina profilo editabile
- [ ]  **Password Reset**: Recovery password via email
- [ ]  **Email Verification**: Conferma email registrazione
- [ ]  **Map Integration**: Google Maps per venues
- [ ]  **Multi-language**: i18n (IT/EN)
- [ ]  **Dark Mode**: Toggle tema dark/light

#### Bassa Priorità

- [ ]  **Social Login**: Google/Facebook OAuth
- [ ]  **Chat Support**: Sistema messaggistica host-user
- [ ]  **Analytics Dashboard**: Stats per users
- [ ]  **PWA**: Progressive Web App support
- [ ]  **Mobile App**: React Native version

---

### Miglioramenti Tecnici

#### Code Quality

- [ ]  Unit tests (Jest + React Testing Library)
- [ ]  E2E tests (Playwright)
- [ ]  Storybook per componenti
- [ ]  ESLint strict rules
- [ ]  Prettier auto-format

#### Performance

- [ ]  Image optimization (`next/image`)
- [ ]  Font optimization (`next/font`)
- [ ]  API response caching (React Query)
- [ ]  Service Worker (offline mode)
- [ ]  Code splitting lazy components

#### Security

- [ ]  Migrate to httpOnly cookies (no localStorage)
- [ ]  Implement CSRF protection
- [ ]  Rate limiting frontend
- [ ]  Content Security Policy (CSP)
- [ ]  XSS sanitization

---

## ✅ Checklist Implementazione Completa

### Core Features

- [X]  Homepage con featured venues
- [X]  Lista venues con ricerca città
- [X]  Dettaglio venue completo
- [X]  Sistema autenticazione JWT (7 giorni)
- [X]  Login e registrazione
- [X]  Pagina prenotazioni protetta
- [X]  Form prenotazione con validazione
- [X]  Navbar con user menu
- [X]  Footer completo
- [X]  Responsive design mobile-first

### Components

- [X]  Navbar (con auth system)
- [X]  SearchBar
- [X]  VenueCard
- [X]  PackageCard
- [X]  BookingForm
- [X]  Footer
- [X]  ProtectedRoute HOC

### Auth System

- [X]  AuthContext con state globale
- [X]  useAuthFetch hook
- [X]  Token verification all'avvio
- [X]  Login/Logout/Register
- [X]  Protected routes
- [X]  User menu dropdown
- [X]  Error handling

### Styling

- [X]  globals.css completo
- [X]  CSS Modules (bookings.module.css)
- [X]  Responsive breakpoints
- [X]  Hover/focus states
- [X]  Loading spinners
- [X]  Modal overlays

### Documentation

- [X]  CLIENT_README.md (questo file)

### TypeScript

- [X]  Types per Venue, Package, Booking
- [X]  AuthContext types
- [X]  Component props interfaces
- [X]  API response types

---

## 🤝 Contribuire

### Setup Sviluppo

```bash
# Clone repo
git clone https://github.com/your-org/sideProject-Anywhere.git
cd sideProject-Anywhere

# Install dependencies
pnpm install

# Setup client
cd apps/client
cp .env.example .env.local
# Edit .env.local con le tue config

# Start dev
pnpm dev
```

### Coding Standards

**TypeScript**:

- Strict mode enabled
- No `any` types (usa `unknown` se necessario)
- Interfaces per props e data
- Export types da `@/types`

**React**:

- Functional components + hooks
- `"use client"` per client components
- Custom hooks in `src/hooks/`
- Componenti riutilizzabili in `src/components/`

**Styling**:

- CSS Modules per componenti specifici
- globals.css per stili condivisi
- camelCase per class names CSS Modules
- Mobile-first responsive

**Git**:

- Branch naming: `feature/nome-feature` o `fix/nome-bug`
- Commit messages: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- PR con descrizione chiara

---

## 📝 Changelog

### v2.0.0 (Gennaio 2025)

- ✨ Sistema autenticazione completo (JWT 7 giorni)
- ✨ Pagina login e registrazione
- ✨ Pagina bookings protetta
- ✨ Navbar con user menu dropdown
- ✨ CSS Modules per bookings
- ✨ AuthContext con gestione completa
- ✨ useAuthFetch hook
- ✨ ProtectedRoute component
- 📚 Documentazione completa unificata

### v1.0.0 (Ottobre 2024)

- 🎉 Release iniziale
- ✨ Homepage con featured venues
- ✨ Lista e dettaglio venues
- ✨ Sistema prenotazioni
- ✨ Componenti base (Navbar, Footer, Cards)
- 📱 Responsive design
- 📚 Documentazione iniziale

---

## 📄 Licenza

MIT License - Vedere [LICENSE](../../LICENSE) per dettagli.

---

## 👥 Team & Contatti

**Maintainers**: Team Anywhere
**Repository**: [GitHub](https://github.com/your-org/sideProject-Anywhere)
**Issues**: [GitHub Issues](https://github.com/your-org/sideProject-Anywhere/issues)

---

**🎉 Grazie per usare Anywhere Client App!**

Per domande o supporto, apri una issue su GitHub o contatta il team.
