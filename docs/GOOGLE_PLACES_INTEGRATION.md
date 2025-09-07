# Google Places API Integration

## Descrizione

Integrazione dell'API di Google Places per l'autocomplete degli indirizzi nel VenueDetailsForm. Quando un utente inserisce un indirizzo, il sistema:

1. Mostra suggerimenti di indirizzi in tempo reale tramite Google Places Autocomplete
2. Ottiene automaticamente latitudine e longitudine quando viene selezionato un indirizzo
3. Salva le coordinate GPS nel database insieme ai dettagli del venue

## Variabili d'Ambiente Richieste

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Setup Google Maps API

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona un progetto esistente
3. Abilita le seguenti API:
   - Places API
   - Maps JavaScript API
4. Crea una API key
5. Configura le restrizioni per la tua API key (opzionale ma raccomandato per sicurezza)

## Componenti Modificati

### Frontend

- `packages/components/utils/googlePlaces.ts` - Servizio per gestire le chiamate all'API di Google Places
- `packages/components/inputs/AddressAutocomplete.tsx` - Componente di autocomplete per indirizzi
- `packages/components/venue/components/VenueDetailsForm.tsx` - Form aggiornato per usare l'autocomplete

### Backend

- `apps/api/handlers/venues/venueDetails.ts` - Handler aggiornato per gestire latitude/longitude
- `packages/database/prisma/schema.prisma` - Schema aggiornato con campi nullable per coordinate

## Database Schema

```prisma
model Venue {
  // ... altri campi
  latitude     Float?
  longitude    Float?
  // ... altri campi
}
```

## Utilizzo

Nel VenueDetailsForm, quando l'utente:

1. Digita nel campo "Indirizzo"
2. Appare un dropdown con suggerimenti di Google Places
3. Seleziona un indirizzo
4. Le coordinate vengono automaticamente salvate nel database

## Sicurezza

- La API key è esposta nel frontend (NEXT*PUBLIC*\*) ma è normale per Google Maps
- Si raccomanda di configurare restrizioni su domini/IP nella Google Cloud Console
- Il paese è limitato all'Italia (`componentRestrictions: { country: 'IT' }`)

## Debug

Nel form è presente un indicatore visivo che mostra le coordinate quando vengono ottenute:

```
📍 Coordinate: 45.464664, 9.188540
```

Questo indicatore dovrebbe essere rimosso in produzione.
