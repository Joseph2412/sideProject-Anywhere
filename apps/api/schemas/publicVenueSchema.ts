export const allPublicVenueSchema = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        radius: { type: 'number', default: 10 }, // km
        type: { type: 'string', enum: ['SALA', 'DESK'] },
        capacity: { type: 'number' },
        date: { type: 'string', format: 'date' },
      },
    },
  },
};

export const idPublicVenueSchema = {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' },
      },
    },
  },
};
