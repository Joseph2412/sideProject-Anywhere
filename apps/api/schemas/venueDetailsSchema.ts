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
    required: ['name', 'address', 'description'],
    properties: {
      name: { type: 'string', minLength: 1 },
      address: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      services: { type: 'array', items: { type: 'string' } },
      avatarURL: { type: 'string' }, //Mi aspetto arrivi ma non è required
    },
    additionalProperties: false,
  },
};
