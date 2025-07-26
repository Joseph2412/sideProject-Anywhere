# 📚 Anywhere – Monorepo

## 📁 Struttura delle cartelle (Schema Parlante)

```txt
anywhere/
├── apps/
│   ├── api/               # Backend: Fastify + Prisma
│   │   ├── handlers/      # Handler per login, signup, reset, restore
│   │   ├── schemas/       # Schemi JSON per la validazione input (no Zod)
│   │   ├── db/            # (vuota o deprecata)
│   │   ├── index.ts       # Entrypoint server Fastify
│   │   └── migrate.sh     # Script shell per generare migrations Prisma
│   │
│   └── host/              # Frontend: Next.js con App Router + Ant Design
│       ├── app/           # Entry layout + pagine principali
│       ├── theme/         # Customizzazione tema Ant Design (colori, border)
│       ├── next.config.js # Configurazione Next.js
│       ├── tsconfig.json  # Config TypeScript del frontend
│       └── package.json   # Script e dipendenze FE
│
├── packages/              # Moduli condivisi riusabili
│   ├── components/        # Componenti React condivisi (Button, Input, ecc.)
│   ├── database/          # Prisma schema e migrations (DB layer)
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Definizione del DB (PostgreSQL)
│   │   │   └── migrations/    # Cartelle auto-generate per ogni migration
│   │   └── src/               # (eventuali metodi helper, se presenti)
│   ├── types/             # Tipi condivisi TS (auth, user, ecc.)
│   ├── ui/                # (eventuali componenti generici, se presenti)
│   ├── eslint-config/     # Configurazione condivisa ESLint
│   └── typescript-config/ # Configurazione TS base riusata dai pacchetti
│
├── .env                   # Variabili d'ambiente (API_URL, DB_URL, ecc.)
├── turbo.json             # Configurazione build/dev con Turborepo
├── pnpm-workspace.yaml    # Definizione workspace usati da PNPM
├── tsconfig.base.json     # TSConfig base estesa nei pacchetti
└── README.md              # Documentazione progetto
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

## 🛠️ Comandi Utili

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
