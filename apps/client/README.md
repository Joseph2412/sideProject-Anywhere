# Client App - Anywhere

> 📖 **Per la documentazione completa, vedi [CLIENT_README.md](./CLIENT_README.md)**

## 🚀 Quick Start

```bash
# 1. Setup environment
cp .env.example .env.local

# 2. Start backend (terminal 1)
cd apps/api
pnpm dev  # → http://localhost:3001

# 3. Start client (terminal 2)
cd apps/client
pnpm dev  # → http://localhost:3000
```

## 📚 Documentazione

**Documentazione completa e aggiornata**: [CLIENT_README.md](./CLIENT_README.md)

Include:
- ✅ Quick Start dettagliato
- ✅ Struttura progetto completa
- ✅ Architettura e diagrammi
- ✅ Sistema autenticazione JWT
- ✅ Guida componenti
- ✅ Endpoint API
- ✅ TypeScript types
- ✅ Guida testing
- ✅ Troubleshooting
- ✅ Deploy guide

## 🎯 Main Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage con featured venues |
| `/login` | Login utente |
| `/register` | Registrazione utente |
| `/venues` | Lista venues |
| `/venues/[id]` | Dettaglio venue |
| `/bookings` | Prenotazioni (protetta) |

## 🔗 Links Utili

- **Documentazione Completa**: [CLIENT_README.md](./CLIENT_README.md)
- **Backend API**: [../../docs/BOOKING_API.md](../../docs/BOOKING_API.md)
- **Monorepo**: [../../README.md](../../README.md)
