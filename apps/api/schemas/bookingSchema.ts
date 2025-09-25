export const availabilityBookingSchema = {
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
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};

export const createBookingSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: [
      "venueId",
      "packageId",
      "start",
      "end",
      "people",
      "customerInfo",
    ],
    properties: {
      venueId: { type: "string" },
      packageId: { type: "string" },
      start: { type: "string", format: "date-time" },
      end: { type: "string", format: "date-time" },
      people: { type: "number" },
      customerInfo: {
        type: "object",
        required: ["email", "firstName", "lastName"],
        properties: {
          email: { type: "string", format: "email" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          phone: { type: "string" },
        },
      },
    },
  },
};

export const getVenueBookingsSchema = {
  params: {
    type: "object",
    required: ["venueId"],
    properties: {
      venueId: { type: "string" },
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
      offset: { type: "number", minimum: 0, default: 0 },
    },
  },
};
