# 🏗️ Architettura Client App - Diagramma

## 📊 Struttura Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT APP                               │
│                   (Next.js 13+ App Router)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│   PAGES      │    │  COMPONENTS  │     │    TYPES     │
│   (Routes)   │    │   (UI/Logic) │     │  (TypeScript)│
└──────────────┘    └──────────────┘     └──────────────┘
```

## 🗂️ Dettaglio Architettura

```
apps/client/
│
├── 📄 PAGES (App Router)
│   ├── app/page.tsx                 → Homepage
│   │   ├── Uses: Navbar, SearchBar, VenueCard, Footer
│   │   ├── API: GET /public/venues
│   │   └── Shows: Featured 6 venues
│   │
│   ├── app/venues/page.tsx          → Lista Venues
│   │   ├── Uses: Navbar, SearchBar, VenueCard, Footer
│   │   ├── API: GET /public/venues?city={city}
│   │   └── Shows: Grid di venue cards
│   │
│   ├── app/venues/[id]/page.tsx     → Dettaglio Venue
│   │   ├── Uses: Navbar, PackageCard, BookingForm, Footer
│   │   ├── API: GET /public/venues/:id
│   │   └── Shows: Venue details + packages + booking modal
│   │
│   └── app/bookings/page.tsx        → Le Mie Prenotazioni
│       ├── Uses: Navbar, Footer
│       ├── API: GET /venues/bookings (auth required)
│       └── Shows: User's bookings list
│
├── 🧩 COMPONENTS (Reusable UI)
│   ├── Navbar/
│   │   ├── Navbar.tsx               → Sticky navigation
│   │   └── Features: Desktop menu, mobile hamburger
│   │
│   ├── SearchBar/
│   │   ├── SearchBar.tsx            → City search input
│   │   └── Features: Form submit, navigation to /venues
│   │
│   ├── VenueCard/
│   │   ├── VenueCard.tsx            → Venue preview card
│   │   └── Shows: Image, name, address, services, CTA
│   │
│   ├── PackageCard/
│   │   ├── PackageCard.tsx          → Package detail card
│   │   └── Shows: Image, type badge, capacity, plans, price
│   │
│   ├── BookingForm/
│   │   ├── BookingForm.tsx          → Booking creation form
│   │   └── Features: Validation, date pickers, customer info
│   │
│   └── Footer/
│       ├── Footer.tsx               → Site footer
│       └── Shows: Links, contact info, copyright
│
├── 🎯 TYPES (TypeScript Definitions)
│   ├── venue.ts                     → Venue, Package, PackagePlan
│   ├── booking.ts                   → Booking, BookingFormData
│   └── index.ts                     → Barrel exports
│
├── 🔧 LIB (Utilities)
│   └── api.ts                       → API client methods
│
└── 🎨 STYLES
    └── app/globals.css              → Global CSS with all styles
```

## 🔄 Flusso di Dati

### 1. Homepage Flow
```
User visits /
    ↓
Page loads
    ↓
Fetch GET /public/venues
    ↓
Display first 6 as featured
    ↓
User can:
  - Search city → /venues?city=X
  - Click card → /venues/:id
```

### 2. Search Flow
```
User types city in SearchBar
    ↓
User submits form
    ↓
Navigate to /venues?city={city}
    ↓
Page fetches GET /public/venues?city={city}
    ↓
Display filtered results
```

### 3. Venue Detail Flow
```
User clicks VenueCard
    ↓
Navigate to /venues/:id
    ↓
Fetch GET /public/venues/:id
    ↓
Display:
  - Venue info
  - Gallery
  - Opening hours
  - Packages list
    ↓
User clicks "Prenota" on package
    ↓
Open BookingForm modal
```

### 4. Booking Flow
```
User fills BookingForm
    ↓
Validates fields
    ↓
Submit POST /booking/:venueId
Body: {
  venueId, packageId,
  start, end, people,
  userId, customerInfo
}
    ↓
Success: Close modal + alert
Error: Show error message
```

## 🔌 API Integration Map

```
┌────────────────────────────────────────────────────────┐
│                    BACKEND API                          │
│              (http://localhost:3001)                    │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Venues     │ │   Bookings   │ │    Media     │
│   Public     │ │   Protected  │ │    S3 Proxy  │
└──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        ├─ GET /public/venues              │
        ├─ GET /public/venues?city=X       │
        ├─ GET /public/venues/:id          │
        │                │                │
        │         ├─ POST /booking/:id    │
        │         ├─ GET /venues/bookings │
        │         └─ DELETE /booking/:id  │
        │                                  │
        └──────────────────────────────────┴─ Images via URL proxy
```

## 🎨 Component Hierarchy

### Homepage
```
<Navbar />
<main>
  <header>
    <h1>Anywhere</h1>
    <p>Subtitle</p>
  </header>
  <SearchBar />
  <section>
    <h2>Spazi in Evidenza</h2>
    <div className="card-grid">
      <VenueCard /> × 6
    </div>
  </section>
</main>
<Footer />
```

### Venues List Page
```
<Navbar />
<main>
  <header>
    <h1>Esplora gli Spazi</h1>
    <p>Risultati per "{city}"</p>
  </header>
  <SearchBar initialValue={city} />
  <div className="venues-page-grid">
    <VenueCard /> × N
  </div>
</main>
<Footer />
```

### Venue Detail Page
```
<Navbar />
<main>
  <section> {/* Hero */}
    <img logo />
    <h1>Venue Name</h1>
    <p>Address</p>
  </section>
  
  <section> {/* Gallery */}
    <img /> × 4
  </section>
  
  <section> {/* Description */}
    <p>Description text</p>
  </section>
  
  <section> {/* Services */}
    <span tag /> × N
  </section>
  
  <section> {/* Opening Hours */}
    <div day-row /> × 7
  </section>
  
  <section> {/* Packages */}
    <PackageCard onBook={handleBook} /> × N
  </section>
  
  {showBookingForm && (
    <div modal-overlay>
      <BookingForm
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </div>
  )}
</main>
<Footer />
```

## 📱 Responsive Breakpoints

```
Mobile            Tablet            Desktop
< 768px          768px - 1024px     > 1024px
┌──────┐         ┌────────────┐    ┌──────────────────┐
│      │         │            │    │                  │
│  1   │         │    1  2    │    │   1    2    3    │
│  2   │         │    3  4    │    │   4    5    6    │
│  3   │         │            │    │                  │
└──────┘         └────────────┘    └──────────────────┘
Stack            Grid 2 cols        Grid 3 cols
```

## 🔐 Stato Autenticazione (TODO)

```
┌─────────────────────────────────────────┐
│    Auth State (Da Implementare)        │
├─────────────────────────────────────────┤
│  - Login/Logout                         │
│  - Token storage (localStorage)         │
│  - Protected routes                     │
│  - User profile                         │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│   Possibili Soluzioni:                  │
├─────────────────────────────────────────┤
│  1. Next-Auth                           │
│  2. Custom JWT + Context                │
│  3. @repo/ui AuthStore (Jotai)          │
└─────────────────────────────────────────┘
```

## 🗄️ State Management

```
Current: useState + props drilling
    ↓
Suggested for scale:
    ↓
┌─────────────────────────────────────────┐
│   @repo/ui Stores (Jotai)              │
├─────────────────────────────────────────┤
│  - VenueSearchStore                     │
│  - BookingFormStore                     │
│  - AuthStore                            │
│  - ToastStore                           │
└─────────────────────────────────────────┘
```

## 📊 Metriche Performance

### Page Load Times (Target)
- Homepage: < 1s
- Venues List: < 1.5s
- Venue Detail: < 2s

### Bundle Size (Target)
- Initial: < 200KB
- Route chunks: < 100KB each

### API Response Times (Target)
- GET venues: < 300ms
- GET venue detail: < 500ms
- POST booking: < 1s

## 🚀 Deployment Architecture

```
Development                Production (Future)
──────────────           ──────────────────────
localhost:3000     →     Vercel / Netlify
localhost:3001     →     API on Cloud (AWS/Azure)
PostgreSQL Local   →     Managed PostgreSQL
```

## 📈 Scalability Considerations

### Code Splitting
- ✅ Next.js automatic route splitting
- ⬜ Dynamic imports for heavy components
- ⬜ Lazy loading images

### Caching
- ⬜ SWR / React Query for API caching
- ⬜ Service Worker for offline
- ⬜ CDN for static assets

### Performance
- ⬜ Image optimization (next/image)
- ⬜ Font optimization
- ⬜ Code minification

---

## 📚 Legenda

- ✅ Implementato
- ⬜ Da implementare
- 🔄 In progress
- ❌ Non necessario

---

**Versione**: 1.0.0
**Ultimo aggiornamento**: 2025-10-06
**Stato**: ✅ Struttura base completa
