# BOOKING API Documentation

## 📋 Panoramica

L'API di Booking gestisce tutte le operazioni relative alle prenotazioni nel sistema **Anywhere**. Include funzionalità per creare, visualizzare, cancellare prenotazioni e ottenere aggiornamenti in tempo reale tramite Server-Sent Events (SSE).

## 🔐 Autenticazione

Tutti gli endpoint richiedono autenticazione tramite JWT Bearer Token, eccetto quelli specificatamente marcati come pubblici.

**Header richiesto:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Stati delle Prenotazioni

- `PENDING`: Prenotazione in attesa di conferma
- `CONFIRMED`: Prenotazione confermata
- `CANCELLED`: Prenotazione cancellata
- `COMPLETED`: Prenotazione completata

---

## 🚀 Endpoints API

### 1. Creare una Nuova Prenotazione

**Endpoint:** `POST /booking/:id`
**Descrizione:** Crea una nuova prenotazione per un venue/package specifico
**Autenticazione:** Richiesta

#### Parametri URL

- `id` (string): ID dell'utente che effettua la prenotazione

#### Body della Richiesta

```json
{
  "venueId": "string",
  "packageId": "string",
  "start": "2024-12-25T10:00:00Z",
  "end": "2024-12-25T18:00:00Z",
  "people": 4,
  "customerInfo": {
    "email": "customer@example.com",
    "firstName": "Mario",
    "lastName": "Rossi",
    "phone": "+39 123 456 7890"
  }
}
```

#### Validazioni

- Tutti i campi sono obbligatori
- `start` deve essere precedente a `end`
- Non è possibile prenotare nel passato
- Controllo disponibilità slot temporale
- Controllo capacità massima del package

#### Risposta di Successo (201)

```json
{
  "message": "Prenotazione creata con successo",
  "bookingId": 123,
  "booking": {
    "id": 123,
    "start": "2024-12-25T10:00:00Z",
    "end": "2024-12-25T18:00:00Z",
    "people": 4,
    "status": "PENDING",
    "customer": {
      "name": "Mario Rossi",
      "email": "customer@example.com"
    },
    "venue": 1,
    "package": 2
  }
}
```

#### Possibili Errori

- `400`: Dati mancanti o non validi
- `404`: Venue o package non trovato
- `409`: Slot temporale non disponibile
- `500`: Errore interno del server

---

### 2. Ottenere Dettagli Prenotazione

**Endpoint:** `GET /booking/:id`
**Descrizione:** Recupera i dettagli completi di una prenotazione specifica
**Autenticazione:** Richiesta

#### Parametri URL

- `id` (string): ID della prenotazione

#### Risposta di Successo (200)

```json
{
  "booking": {
    "id": 123,
    "start": "2024-12-25T10:00:00Z",
    "end": "2024-12-25T18:00:00Z",
    "people": 4,
    "status": "PENDING",
    "costumerName": "Mario Rossi",
    "costumerEmail": "customer@example.com",
    "createdAt": "2024-12-20T09:00:00Z",
    "updatedAt": "2024-12-20T09:00:00Z",
    "venue": {
      "id": 1,
      "name": "Sala Conferenze Centro",
      "address": "Via Roma 123, Milano"
    },
    "package": {
      "id": 2,
      "name": "Package Premium",
      "type": "MEETING_ROOM"
    }
  }
}
```

#### Possibili Errori

- `400`: ID prenotazione non valido
- `404`: Prenotazione non trovata
- `500`: Errore interno del server

---

### 3. Cancellare una Prenotazione

**Endpoint:** `DELETE /booking/:id`
**Descrizione:** Cancella una prenotazione esistente
**Autenticazione:** Richiesta

#### Parametri URL

- `id` (string): ID della prenotazione da cancellare

#### Regole di Cancellazione

- È possibile cancellare solo prenotazioni con almeno 24 ore di anticipo
- La prenotazione viene marcata come "Cancelled" invece di essere eliminata fisicamente

#### Risposta di Successo (200)

```json
{
  "message": "Prenotazione cancellata con successo",
  "booking": {
    "id": 123,
    "status": "Cancelled",
    "updatedAt": "2024-12-20T10:30:00Z",
    "venue": {
      "name": "Sala Conferenze Centro"
    },
    "package": {
      "name": "Package Premium"
    }
  }
}
```

#### Possibili Errori

- `400`: ID non valido o cancellazione non consentita (< 24h)
- `404`: Prenotazione non trovata
- `500`: Errore interno del server

---

### 4. Ottenere Prenotazioni di un Venue

**Endpoint:** `GET /venues/bookings/:id`
**Descrizione:** Recupera tutte le prenotazioni per un venue specifico (solo per proprietari)
**Autenticazione:** Richiesta

#### Parametri URL

- `id` (string): ID del venue

#### Query Parameters

- `status` (optional): Filtra per stato (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)
- `limit` (optional): Numero massimo di risultati (default: 20, max: 100)
- `offset` (optional): Numero di risultati da saltare (default: 0)

#### Risposta di Successo (200)

```json
{
  "bookings": [
    {
      "id": 123,
      "start": "2024-12-25T10:00:00Z",
      "end": "2024-12-25T18:00:00Z",
      "people": 4,
      "status": "PENDING",
      "costumerName": "Mario Rossi",
      "costumerEmail": "customer@example.com",
      "package": {
        "id": 2,
        "name": "Package Premium",
        "type": "MEETING_ROOM"
      },
      "venue": {
        "id": 1,
        "name": "Sala Conferenze Centro"
      }
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### Possibili Errori

- `403`: Non autorizzato per questo venue
- `500`: Errore interno del server

---

### 5. Server-Sent Events per Aggiornamenti in Tempo Reale

**Endpoint:** `GET /venue/:venueId/events`
**Descrizione:** Connessione SSE per ricevere aggiornamenti in tempo reale sulle prenotazioni
**Autenticazione:** Richiesta (token via query parameter o header)

#### Parametri URL

- `venueId` (string): ID del venue da monitorare

#### Query Parameters

- `token` (optional): JWT token se non fornito nell'header Authorization

#### Esempio di Connessione

```javascript
const eventSource = new EventSource("/venue/1/events?token=YOUR_JWT_TOKEN");

eventSource.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("Aggiornamento prenotazione:", data);
};
```

#### Formato Eventi SSE

```json
{
  "type": "created|updated|deleted",
  "booking": {
    "id": 123,
    "status": "PENDING",
    "venue": "Sala Conferenze Centro",
    "customer": "Mario Rossi"
  }
}
```

---

## 📝 Testare le API con Postman

### Configurazione Iniziale

1. **Creare una Nuova Collection**
   - Apri Postman
   - Clicca su "New" → "Collection"
   - Nomina la collection "Anywhere - Booking API"

2. **Configurare Variabili di Environment**
   - Crea un nuovo Environment chiamato "Anywhere Dev"
   - Aggiungi le seguenti variabili:
     ```
     base_url: http://localhost:3000 (o il tuo URL API)
     auth_token: (da compilare dopo il login)
     user_id: (ID dell'utente di test)
     venue_id: (ID del venue di test)
     booking_id: (ID della prenotazione di test)
     ```

### Test di Autenticazione

Prima di testare gli endpoint di booking, devi ottenere un token JWT:

1. **Login Request**

   ```
   POST {{base_url}}/auth/login
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Estrai il Token**
   - Dalla risposta, copia il valore del campo `token`
   - Aggiornala variabile `auth_token` nel tuo environment

### Test degli Endpoints

#### 1. Test Creazione Prenotazione

**Request:**

```
POST {{base_url}}/booking/{{user_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "venueId": "1",
  "packageId": "2",
  "start": "2024-12-25T10:00:00.000Z",
  "end": "2024-12-25T18:00:00.000Z",
  "people": 4,
  "customerInfo": {
    "email": "mario.rossi@example.com",
    "firstName": "Mario",
    "lastName": "Rossi",
    "phone": "+39 123 456 7890"
  }
}
```

**Test Script da Aggiungere:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains booking ID", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("bookingId");
  pm.environment.set("booking_id", jsonData.bookingId);
});

pm.test("Response contains booking details", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.booking).to.have.property("status", "PENDING");
});
```

#### 2. Test Dettagli Prenotazione

**Request:**

```
GET {{base_url}}/booking/{{booking_id}}
Authorization: Bearer {{auth_token}}
```

**Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Booking details are complete", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.booking).to.have.property("id");
  pm.expect(jsonData.booking).to.have.property("venue");
  pm.expect(jsonData.booking).to.have.property("package");
});
```

#### 3. Test Lista Prenotazioni Venue

**Request:**

```
GET {{base_url}}/venues/bookings/{{venue_id}}?status=PENDING&limit=10
Authorization: Bearer {{auth_token}}
```

**Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response contains bookings array", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("bookings");
  pm.expect(jsonData.bookings).to.be.an("array");
});
```

#### 4. Test Cancellazione Prenotazione

**Request:**

```
DELETE {{base_url}}/booking/{{booking_id}}
Authorization: Bearer {{auth_token}}
```

**Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Booking is cancelled", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.booking.status).to.equal("Cancelled");
});
```

### Test degli Scenari di Errore

#### Test con Dati Invalidi

```
POST {{base_url}}/booking/{{user_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "venueId": "",
  "packageId": "2",
  "start": "invalid-date",
  "end": "2024-12-25T18:00:00.000Z",
  "people": -1
}
```

**Expected Response:** 400 Bad Request

#### Test Senza Autenticazione

```
GET {{base_url}}/booking/123
```

**Expected Response:** 401 Unauthorized

#### Test con ID Inesistente

```
GET {{base_url}}/booking/999999
Authorization: Bearer {{auth_token}}
```

**Expected Response:** 404 Not Found

### Test delle Server-Sent Events

Per testare gli SSE, puoi usare un client JavaScript o un tool specifico:

```javascript
// Test client per SSE
const eventSource = new EventSource(
  "http://localhost:3000/venue/1/events?token=YOUR_JWT_TOKEN",
);

eventSource.onopen = function (event) {
  console.log("Connessione SSE aperta");
};

eventSource.onmessage = function (event) {
  console.log("Nuovo evento ricevuto:", JSON.parse(event.data));
};

eventSource.onerror = function (event) {
  console.error("Errore SSE:", event);
};
```

### Collection Runner per Test Automatici

1. **Crea una Test Suite** ordinando le richieste in questo ordine:
   - Login
   - Crea Prenotazione
   - Leggi Dettagli Prenotazione
   - Lista Prenotazioni Venue
   - Cancella Prenotazione

2. **Esegui la Collection** usando il Collection Runner per testare tutti gli endpoint in sequenza

### Monitoraggio e Debug

- **Abilita i Log** nella console Postman per vedere i dettagli delle richieste
- **Usa Postman Interceptor** per catturare il traffico di rete
- **Implementa Wait Time** tra le richieste se necessario per evitare conflitti

### Variabili Dinamiche Utili

Aggiungi questi script per gestire dati dinamici:

```javascript
// Pre-request script per generare timestamp futuri
var now = new Date();
var futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 ore
var endDate = new Date(futureDate.getTime() + 8 * 60 * 60 * 1000); // +8 ore

pm.environment.set("booking_start", futureDate.toISOString());
pm.environment.set("booking_end", endDate.toISOString());
```

---

## 🔍 Note Tecniche

### Gestione Date e Timezone

- Tutte le date sono in formato ISO 8601 UTC
- Il sistema applica automaticamente validazioni temporali
- Considera sempre il fuso orario dell'applicazione

### Performance e Rate Limiting

- Le API implementano controlli per evitare prenotazioni duplicate
- È consigliato implementare debouncing lato client
- Monitora le performance delle query per venue con molte prenotazioni

### Sicurezza

- Tutti gli endpoint sono protetti da autenticazione JWT
- I proprietari di venue possono vedere solo le proprie prenotazioni
- I dati sensibili dei clienti sono protetti

### Monitoraggio

- Gli eventi SSE permettono aggiornamenti in tempo reale
- Implementare gestione degli errori di connessione
- Considera fallback per browser che non supportano SSE

---

## 🐛 Troubleshooting Comuni

### Errore 401 - Unauthorized

- Verificare che il token JWT sia valido e non scaduto
- Controllare che l'header Authorization sia correttamente formattato

### Errore 409 - Conflict

- Conflitto di prenotazione nello stesso slot temporale
- Verificare disponibilità prima di creare nuove prenotazioni

### Errore 400 - Bad Request

- Controllare formato delle date (deve essere ISO 8601)
- Validare tutti i campi obbligatori
- Verificare che il numero di persone non superi la capacità

### Problemi SSE

- Verificare supporto browser per Server-Sent Events
- Controllare che il token sia passato correttamente
- Implementare riconnessione automatica

---

## 📚 Risorse Aggiuntive

- [Documentazione JWT](https://jwt.io/)
- [Specifiche Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Postman Documentation](https://learning.postman.com/)
- [ISO 8601 Date Format](https://www.iso.org/iso-8601-date-and-time-format.html)
