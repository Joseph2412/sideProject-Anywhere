export const availabilityBookingSchema = {
  // ... (schema non modificato)
  schema: {
    params: {
      type: "object",
      required: ["venueId", "packageId"],
      properties: {
        venueId: { type: "number" },
        packageId: { type: "number" },
      },
    },
    querystring: {
      type: "object",
      required: ["date"],
      properties: {
        date: { type: "string", format: "date" },
      },
    },
  },
};

export const deleteBookingSchema = {
  // ... (schema non modificato)
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" }, // L'ID nell'URL è una stringa
    },
  },
};

export const createBookingSchema = {
  body: {
    type: "object",
    required: [
      "venueId",
      "packageId",
      "start",
      "end",
      "people",
      "customerInfo",
      // "userId", // RIMOSSO dai campi obbligatori
    ],
    properties: {
      venueId: { type: "number" }, // Mantenuto come numero
      packageId: { type: "number" }, // Mantenuto come numero
      start: { type: "string", format: "date-time" },
      end: { type: "string", format: "date-time" },
      people: { type: "number", minimum: 1 }, // Aggiunto minimum
      // userId: { type: "number" }, // RIMOSSO - non serve più inviarlo
      customerInfo: {
        type: "object",
        required: ["email", "firstName", "lastName"],
        properties: {
          email: { type: "string", format: "email" },
          firstName: { type: "string", minLength: 1 }, // Aggiunto minLength
          lastName: { type: "string", minLength: 1 }, // Aggiunto minLength
          phone: { type: "string", nullable: true }, // Reso esplicitamente nullable
        },
        additionalProperties: false // Impedisce campi extra
      },
    },
    additionalProperties: false // Impedisce campi extra nel body principale
  },
};

export const getVenueBookingsSchema = {
  // ... (schema non modificato, ma l'endpoint potrebbe diventare obsoleto)
  params: {
    type: "object",
    required: ["venueId"],
    properties: {
      venueId: { type: "string" }, // L'ID nell'URL è una stringa
    },
  },
  querystring: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      },
      limit: { type: "number", minimum: 1, maximum: 100, default: 20 },
      offset: { type: "number", minimum: 0, default: 0 }, // Offset deprecato, useremo 'page'
      page: { type: "number", minimum: 1, default: 1 }, // Aggiunto 'page'
      pageSize: { type: "number", minimum: 1, maximum: 100, default: 20} // Sinonimo di limit
    },
  },
};

// Nuovo schema per getMyVenueBookings (solo query params)
export const getMyVenueBookingsSchema = {
  querystring: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
        description: "Filtra per stato della prenotazione (case-insensitive)"
      },
      limit: { type: "number", minimum: 1, maximum: 100, default: 20, description: "Numero di risultati per pagina"},
      page: { type: "number", minimum: 1, default: 1, description: "Numero della pagina" },
      // Potresti aggiungere filtri per data qui
      // startDate: { type: "string", format: "date", description: "Data inizio filtro (YYYY-MM-DD)"},
      // endDate: { type: "string", format: "date", description: "Data fine filtro (YYYY-MM-DD)"},
    },
  },
};
