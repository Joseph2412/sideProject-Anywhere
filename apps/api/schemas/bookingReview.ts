export const createBookingSchema = {
  body: {
    type: 'object',
    required: ['start', 'end', 'createdAt', 'people', 'userId', 'packageId', 'venueId', 'status'],
    properties: {
      start: { type: 'string', format: 'date-time' },
      end: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      people: { type: 'number', minimum: 1 },
      userId: { type: 'number' },
      packageId: { type: 'number' },
      venueId: { type: 'number' },
      status: { type: 'string', enum: ['pending', 'confirmed', 'canceled'] }, //Guardaci sullo status
    },
  },
};
