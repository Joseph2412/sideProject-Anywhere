export const venueDetailsSchema = {
  body: {
    type: 'object',
    required: ['id', 'name', 'address', 'description'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      address: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      services: { type: 'array', items: { type: 'string' } },
      avatarURL: { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const updateVenueDetailsSchema = {
  body: {
    type: 'object',
    required: ['name', 'address'],
    properties: {
      name: { type: 'string', minLength: 1 },
      address: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      services: {
        type: 'array',
        items: { type: 'string' },
      },
      photos: {
        type: 'array',
        items: { type: 'string' },
      },
      logoURL: { type: 'string' },
      avatarURL: { type: 'string' },
      latitude: { type: 'number', minimum: -90, maximum: 90 },
      longitude: { type: 'number', minimum: -180, maximum: 180 },
    },
    additionalProperties: false,
  },
};
