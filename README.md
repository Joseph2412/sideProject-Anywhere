# 📚 Anywhere – Monorepo

> **🏗️ Architettura Monorepo**: Progetto organizzato con PNPM workspaces e Turborepo per massima scalabilità e manutenibilità.

## 📁 Struttura delle Cartelle

```txt
anywhere/
├── apps/
│   ├── api/                           # Backend: Server Fastify con Prisma ORM
│   │   ├── handlers/                  # Handler per logica di business
│   │   │   ├── auth/                  # Gestione autenticazione utenti
│   │   │   ├── user/                  # Gestione profili utente
│   │   │   └── venues/                # Gestione locali/venue
│   │   ├── routes/                    # Definizione delle route API
│   │   │   ├── auth/
│   │   │   │   ├── index.ts           # Router principale autenticazione
│   │   │   │   ├── login.ts           # Endpoint login
│   │   │   │   ├── signup.ts          # Endpoint registrazione
│   │   │   │   ├── checkEmail.ts      # Verifica email
│   │   │   │   ├── resetPassword.ts   # Reset password
│   │   │   │   └── restorePassword.ts # Ripristino password
│   │   │   ├── user/
│   │   │   │   ├── index.ts           # Router principale utente
│   │   │   │   ├── profile.ts         # Gestione profilo
│   │   │   │   └── preferences.ts     # Preferenze notifiche
│   │   │   └── venues/
│   │   │       ├── index.ts           # Router principale venue
│   │   │       └── venues.ts          # CRUD venue
│   │   ├── schemas/                   # Schemi validazione JSON Schema
│   │   ├── plugins/                   # Plugin Fastify (auth, cors, etc.)
│   │   ├── libs/                      # Connessioni database e utility
│   │   ├── index.ts                   # Entry point del server
│   │   └── migrate.sh                 # Script per migrations Prisma
│   │
│   └── host/                          # Frontend: Applicazione Next.js
│       ├── app/                       # App Router Next.js
│       │   ├── (protected)/           # Route protette da autenticazione
│       │   │   └── homepage/          # Dashboard principale
│       │   ├── login/                 # Pagina di login
│       │   ├── signup/                # Pagina di registrazione
│       │   ├── layout.tsx             # Layout principale applicazione
│       │   ├── page.tsx               # Homepage pubblica
│       │   └── global.css             # Stili globali
│       ├── components/
│       │   └── providers/
│       │       └── UserAuthProvider.tsx # Provider autenticazione utente
│       ├── hooks/                     # Hook specifici dell'app host
│       │   ├── useLogout.ts           # Hook per logout
│       │   └── useUserProfile.ts      # Hook per profilo utente
│       ├── theme/                     # Configurazione tema Ant Design
│       │   └── theme.ts
│       ├── middleware.ts              # Middleware Next.js
│       └── next.config.js             # Configurazione Next.js
│
├── packages/                          # Moduli condivisi della monorepo
│   ├── components/                    # Componenti UI riutilizzabili
│   │   ├── account/                   # Componenti gestione account
│   │   │   └── ProfileForm.tsx        # Form modifica profilo
│   │   ├── bundle/                    # Componenti gestione pacchetti
│   │   │   ├── AddBundleForm.tsx      # Form aggiunta pacchetto
│   │   │   └── PackagesList.tsx       # Lista pacchetti
│   │   ├── buttons/                   # Pulsanti riutilizzabili
│   │   │   ├── index.ts               # Barrel export pulsanti
│   │   │   ├── PrimaryButton.tsx      # Pulsante primario
│   │   │   └── GoogleLoginButton.tsx  # Pulsante login Google
│   │   ├── calendar/                  # Componenti calendario
│   │   │   ├── calendar.tsx           # Calendario principale
│   │   │   └── index.ts               # Barrel export calendario
│   │   ├── header/                    # Componenti header layout
│   │   │   ├── Header.tsx             # Header principale
│   │   │   └── index.ts               # Barrel export header
│   │   ├── loginform/                 # Form di autenticazione
│   │   │   ├── LoginForm.tsx          # Form login
│   │   │   └── index.ts               # Barrel export login
│   │   ├── signupform/                # Form di registrazione
│   │   │   ├── SignUpForm.tsx         # Form registrazione
│   │   │   └── index.ts               # Barrel export signup
│   │   ├── sidebar/                   # Componenti sidebar navigazione
│   │   │   ├── Sidebar.tsx            # Sidebar principale
│   │   │   └── index.ts               # Barrel export sidebar
│   │   ├── venue/                     # Componenti gestione venue
│   │   │   ├── venue.tsx              # Componente venue principale
│   │   │   ├── index.ts               # Barrel export venue
│   │   │   └── components/
│   │   │       ├── VenueDetailsForm.tsx # Form dettagli venue
│   │   │       ├── index.ts           # Barrel export sub-components
│   │   │       ├── Payments/
│   │   │       │   └── PaymentsForm.tsx # Form gestione pagamenti
│   │   │       ├── VenueClosingDays/
│   │   │       │   └── VenueClosingDays.tsx # Gestione giorni chiusura
│   │   │       └── VenueHours/
│   │   │           ├── DayOpeningHours.tsx # Orari giornalieri
│   │   │           └── VenueHoursForm.tsx  # Form orari venue
│   │   ├── preferences/               # Componenti preferenze utente
│   │   │   ├── PreferencesForm.tsx    # Form preferenze notifiche
│   │   │   ├── NotificationGroups.tsx # Gruppi notifiche
│   │   │   ├── NotificationItems.tsx  # Elementi notifiche
│   │   │   ├── NotificationType.tsx   # Tipi notifiche
│   │   │   └── index.ts               # Barrel export preferenze
│   │   ├── inputs/                    # Componenti input form
│   │   │   ├── Input.tsx              # Input personalizzato
│   │   │   └── index.ts               # Barrel export inputs
│   │   ├── imageUpload/               # Componenti upload immagini
│   │   │   ├── imageUpload.tsx        # Upload immagini
│   │   │   └── index.ts               # Barrel export upload
│   │   ├── tabs/                      # Componenti navigazione tab
│   │   │   ├── tab.tsx                # Tab personalizzato
│   │   │   └── index.ts               # Barrel export tabs
│   │   ├── src/                       # Provider e configurazioni framework-specific
│   │   │   ├── providers/
│   │   │   │   ├── Message.provider.tsx # Provider toast messages
│   │   │   │   └── index.ts           # Barrel export providers
│   │   │   ├── global.d.ts            # Dichiarazioni TypeScript globali
│   │   │   └── index.ts               # Barrel export src
│   │   ├── index.ts                   # Barrel export principale componenti
│   │   └── package.json               # Configurazione package componenti
│   │
│   ├── ui/                            # Gestione stato applicazione
│   │   ├── src/
│   │   │   ├── store/                 # Store Jotai modulari
│   │   │   │   ├── index.ts           # Barrel export store
│   │   │   │   ├── LayoutStore.ts     # Stato layout principale
│   │   │   │   ├── AuthStore.ts       # Stato autenticazione utente
│   │   │   │   ├── ToastStore.ts      # Stato notifiche toast
│   │   │   │   ├── NavigationStore.ts # Stato navigazione
│   │   │   │   └── VenueDetails.ts    # Stato dettagli venue
│   │   │   └── global.d.ts            # Dichiarazioni TypeScript
│   │   └── package.json               # Configurazione package UI
│   │
│   ├── hooks/                         # Hook React riutilizzabili framework-agnostic
│   │   ├── src/
│   │   │   ├── useUserProfile.ts      # Hook gestione profilo utente
│   │   │   ├── types.ts               # Tipi specifici hook
│   │   │   └── index.ts               # Barrel export hooks
│   │   └── package.json               # Configurazione package hooks
│   │
│   ├── types/                         # Definizioni TypeScript centrali
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   └── auth.ts            # Tipi autenticazione
│   │   │   ├── user/
│   │   │   │   └── user.ts            # Tipi utente e profilo
│   │   │   ├── css.d.ts               # Dichiarazioni CSS modules
│   │   │   └── index.ts               # Barrel export tipi
│   │   └── package.json               # Configurazione package types
│   │
│   ├── database/                      # Layer database Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Schema database Prisma
│   │   │   └── migrations/            # Cartella migrations database
│   │   ├── src/
│   │   │   └── index.ts               # Export Prisma Client
│   │   └── package.json               # Configurazione package database
│   │
│   ├── eslint-config/                 # Configurazioni ESLint condivise
│   │   ├── base.js                    # Configurazione base
│   │   ├── next.js                    # Configurazione Next.js
│   │   ├── react-internal.js          # Configurazione React internal
│   │   └── package.json
│   │
│   └── typescript-config/             # Configurazioni TypeScript condivise
│       ├── base.json                  # Configurazione base TypeScript
│       ├── nextjs.json                # Configurazione Next.js
│       ├── react-library.json         # Configurazione librerie React
│       └── package.json
│
├── .env                               # Variabili d'ambiente
├── turbo.json                         # Configurazione Turborepo
├── pnpm-workspace.yaml                # Definizione workspace PNPM
├── tsconfig.base.json                 # Configurazione TypeScript base
└── README.md                          # Documentazione progetto
```

## 🧰 Stack Tecnologico

| Area           | Tecnologia                          |
| -------------- | ----------------------------------- |
| 🧠 Linguaggio  | **TypeScript**                      |
| 🔙 Backend     | **Node.js** con **Fastify**         |
| 📦 ORM         | **Prisma**                          |
| 🗄️ Database    | **PostgreSQL**                      |
| 🎨 Frontend    | **React** (Next.js App Router)      |
| 🧩 UI Library  | **Ant Design**                      |
| 📚 Monorepo    | **PNPM workspaces** + **Turborepo** |
| ✅ Validazione | JSON Schema via Fastify             |

## 🏗️ **Architettura del Progetto**

### **Package `@repo/components`**

- **Centralizza tutti i componenti UI** (account, buttons, forms, layout, venue, etc.)
- **Struttura piatta**: Componenti direttamente accessibili nella root del package
- **Provider isolati**: Solo i provider framework-specific rimangono in `src/`

### **Package `@repo/ui`**

- **Gestione stato centralizzata**: Store Jotai modulari per state management
- **Store specializzati**: AuthStore, ToastStore, NavigationStore, VenueDetails
- **Separazione logica**: Solo logica di stato, zero componenti UI

### **Package `@repo/hooks`**

- **Hook riutilizzabili**: Logica condivisa framework-agnostic
- **Dependency injection**: Evita dipendenze circolari
- **Tipizzazione forte**: Type-safe hooks con TypeScript

### **Barrel Exports Gerarchici**

```
@repo/components/
├── account/index.ts          # Export componenti account
├── buttons/index.ts          # Export tutti i pulsanti
├── venue/index.ts            # Export venue + sub-componenti
├── src/providers/index.ts    # Export provider
└── index.ts                  # Export principale categorizzato

@repo/ui/
└── src/store/index.ts        # Export tutti gli store

@repo/hooks/
└── src/index.ts              # Export tutti gli hook

@repo/types/
└── src/index.ts              # Export tutte le definizioni di tipo
```

### **Naming Convention**

- **Componenti**: `PascalCase.tsx`
- **CSS Modules**: `PascalCase.module.css`
- **Provider**: `DescriptiveProvider.tsx`
- **Store**: `DescriptiveStore.ts`
- **Hook**: `useDescriptiveName.ts`
- **Route**: `descriptiveName.ts`

## 🎯 **Principi Architetturali**

### **Separazione delle Responsabilità**

```
📦 @repo/components  →  UI Components (Visual Layer)
📦 @repo/ui         →  State Management (Business Logic)
📦 @repo/hooks      →  Reusable Logic (Framework-Agnostic)
📦 @repo/types      →  Type Definitions (Shared Contracts)
```

### **Import Strategy**

- **Barrel Exports**: Un solo punto di accesso per package
- **Categorized Exports**: Import semanticamente raggruppati
- **Zero Import Relativi**: Evitati path lunghi e fragili

### **File Organization**

- **Flat Structure**: Componenti direttamente accessibili (no `src/components/`)
- **Providers in `src/`**: Framework-specific code isolato
- **Index Files**: Barrel exports per ogni categoria

### 📊 **Caratteristiche del Progetto**

- **Import organizzati**: Barrel exports per accesso semplificato ai moduli
- **Separazione responsabilità**: Packages dedicati per UI, state, hooks e tipi
- **Architettura scalabile**: Struttura modulare per crescita del progetto
- **Zero file duplicati**: Struttura pulita senza ridondanze
- **Store modulari**: State management organizzato per domain
- **Hook riutilizzabili**: Logica condivisa framework-agnostic
- **Tipizzazione completa**: TypeScript su tutta la codebase
- **Build ottimizzato**: Turborepo per compilation parallelizzata

## �🛠️ Comandi Utili

### 📦 Frontend (`apps/host`)

| Script  | Comando      | Descrizione                           |
| ------- | ------------ | ------------------------------------- |
| `dev`   | `next dev`   | Avvia Next.js in sviluppo             |
| `build` | `next build` | Compila il frontend per la produzione |
| `start` | `next start` | Avvia l'app in modalità production    |
| `lint`  | `next lint`  | Lint del progetto frontend            |

```bash
pnpm --filter host dev
```

### 🔙 Backend (`apps/api`)

| Script    | Comando                                           | Descrizione                             |
| --------- | ------------------------------------------------- | --------------------------------------- |
| `dev`     | `ts-node-dev --respawn --transpile-only index.ts` | Avvia il backend Fastify con hot-reload |
| `build`   | `tsup index.ts --format esm,cjs --dts`            | Compila per la produzione               |
| `start`   | `node dist/index.js`                              | Avvia il backend buildato               |
| `migrate` | `bash ./migrate.sh`                               | Esegue `prisma migrate dev` con nome    |

```bash
pnpm --filter api dev
```

### 🧬 Database (`packages/database`)

| Script     | Comando              | Descrizione                               |
| ---------- | -------------------- | ----------------------------------------- |
| `generate` | `prisma generate`    | Genera il client Prisma                   |
| `migrate`  | `prisma migrate dev` | Crea una nuova migration e la applica     |
| `studio`   | `prisma studio`      | Avvia la GUI di Prisma per gestire i dati |

```bash
pnpm --filter @repo/database studio
```

## 🧼 Convenzioni e Pulizia del Codice

| Script              | Comando                  | Descrizione                                                 |
| ------------------- | ------------------------ | ----------------------------------------------------------- |
| `format`            | `pnpm format`            | Applica Prettier a tutti i file `.ts`, `.tsx`, `.md`        |
| `lint`              | `pnpm lint`              | Esegue linting su tutta la monorepo con le regole condivise |
| `check-types`       | `pnpm check-types`       | Verifica i tipi TypeScript su tutti i pacchetti (via Turbo) |
| `commit`            | `pnpm commit`            | Lint, format, git add e commit guidato con Commitizen       |
| `database:generate` | `pnpm database:generate` | Entra in `packages/database` e genera il Prisma Client      |

### 🧪 Verifica e Lint

```bash
pnpm lint         # Lint di tutti i pacchetti
pnpm check-types  # Verifica tipi TypeScript
```

## 🚀 Come Iniziare (Setup Completo)

1. **Clona la repository**

```bash
git clone <repo-url>
cd anywhere
```

2. **Installa le dipendenze**

```bash
pnpm install
```

3. **Configura le variabili d’ambiente**

```bash
cp .env.example .env
```

4. **Genera il client Prisma**

```bash
pnpm --filter @repo/database generate
```

5. **Applica le migrations**

```bash
pnpm --filter api migrate --name init
```

6. **Avvia in modalità sviluppo**

```bash
pnpm dev
```
