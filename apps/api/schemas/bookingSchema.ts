export const availabilityBookingSchema = {
  schema: {
    params: {
      type: 'object',
      required: ['venueId', 'packageId'],
      properties: {
        venueId: { type: 'number' },
        packageId: { type: 'number' },
      },
    },
    querystring: {
      type: 'object',
      required: ['date'],
      properties: {
        date: { type: 'string', format: 'date' },
      },
    },
  },
};

export const createBookingSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['venueId', 'packageId', 'start', 'end', 'people', 'customerInfo'],
      properties: {
        venueId: { type: 'number' },
        packageId: { type: 'number' },
        start: { type: 'string', format: 'date-time' },
        end: { type: 'string', format: 'date-time' },
        people: { type: 'number', minimum: 1 },
        customerInfo: {
          type: 'object',
          required: ['email', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
          },
        },
      },
    },
  },
};
