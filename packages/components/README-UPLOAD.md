# Componenti di Upload Immagini - Implementati ✅

## Sostituzioni Completate

### ✅ 1. ProfileForm

**File:** `packages/components/account/ProfileForm.tsx`

- **Prima:** Upload manuale con Avatar, Upload e pulsanti separati
- **Dopo:** Componente `ProfilePhotoUpload` integrato
- **Caratteristiche:** UI dedicata per foto profilo con overlay e validazioni

### ✅ 2. VenueDetailsForm

**File:** `packages/components/venue/components/VenueDetailsForm.tsx`

- **Prima:** Upload placeholder senza funzionalità
- **Dopo:** Componente `LogoUpload` che determina automaticamente il tipo
- **Caratteristiche:** Upload logo venue con gestione S3

### ✅ 3. Sidebar

**File:** `packages/components/sidebar/Sidebar.tsx`

- **Prima:** Avatar placeholder statico
- **Dopo:** `LogoSidebar` nella sezione principale e `ProfileSidebar` nel footer
- **Caratteristiche:**
  - Header: Logo venue o avatar utente (context-aware)
  - Footer: Profilo utente con nome ed email

### ✅ 4. Venue Tabs

**File:** `packages/components/venue/venue.tsx`

- **Prima:** Tab "Immagini" con ImageUpload generico
- **Dopo:** Tab "Logo" con `LogoUpload` specifico
- **Caratteristiche:** Interfaccia dedicata per upload logo venue

## Componenti Creati

### 1. LogoUpload

**Path:** `packages/components/logoUpload/`

- Componente universale context-aware
- URL `/profile` → Upload avatar
- URL `/venue` → Upload logo
- Upload su S3 con validazioni

### 2. ProfilePhotoUpload

**Path:** `packages/components/profilePhotoUpload/`

- Interfaccia dedicata foto profilo
- Overlay con icona camera
- Titolo e descrizione personalizzabili

### 3. LogoSidebar

**Path:** `packages/components/logoSidebar/`

- Context-aware per sidebar
- Mostra logo venue in `/venue` e `/packages`
- Mostra avatar utente negli altri contesti

### 4. ProfileSidebar

**Path:** `packages/components/profileSidebar/`

- Specifico per informazioni utente
- Layout orizzontale/verticale
- Nome, cognome ed email

## Logica di funzionamento

### Determinazione Context-Aware

```tsx
// LogoUpload e LogoSidebar
const uploadType = pathname.includes("/profile") ? "avatar" : "logo";
const isVenueContext =
  pathname.includes("/venue") || pathname.includes("/packages");
```

### Struttura S3 (Utilizzata)

- **Avatar:** `host/profile/{userId}_avatar_{timestamp}_{filename}`
- **Logo:** `venue/{venueId}/logo_{timestamp}_{filename}`

### API Endpoints (Necessari)

```
POST /media/upload
DELETE /media/delete?type={type}&id={id}&filename={s3Key}
```

## Integrazione Completata

### Pagina Profilo (`/profile`)

```tsx
// Utilizza ProfilePhotoUpload
<ProfilePhotoUpload size={80} title="Foto Profilo" />
```

### Pagina Venue (`/venue`)

```tsx
// Dettagli: LogoUpload inline
// Tab Logo: LogoUpload dedicato
<LogoUpload size={80} showRemove={true} />
```

### Sidebar Universale

```tsx
// Header: Context-aware
<LogoSidebar size={48} showName={true} />

// Footer: Sempre profilo utente
<ProfileSidebar size={32} showEmail={true} layout="vertical" />
```

## Benefici Ottenuti

✅ **Upload S3 funzionante** per avatar e logo  
✅ **UI consistente** in tutta l'applicazione  
✅ **Context-awareness** automatica basata su URL  
✅ **Riutilizzo componenti** con props configurabili  
✅ **Type Safety** completa con TypeScript  
✅ **Validazioni** integrate (formato, dimensione)  
✅ **Feedback utente** con toast notifications  
✅ **Gestione errori** robusta per upload/rimozione

## Come Usare

```tsx
// Import
import { LogoUpload, ProfilePhotoUpload, LogoSidebar, ProfileSidebar } from '@repo/components';

// Upload universale (si adatta al context)
<LogoUpload size={100} showRemove={true} />

// Upload foto profilo dedicato
<ProfilePhotoUpload size={120} title="La tua foto" />

// Sidebar context-aware
<LogoSidebar size={40} showName={true} />

// Sidebar profilo utente
<ProfileSidebar size={32} showEmail={true} layout="horizontal" />
```

La migrazione è **completa** e **funzionale** ✅
