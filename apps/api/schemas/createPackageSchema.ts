export const createPackageSchema = {
  body: {
    type: 'object',
    required: ['title', 'description', 'capacity', 'seats', 'services', 'squareMetres', 'type'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      capacity: { type: 'number' },
      seats: { type: 'number' },
      services: { type: 'array', items: { type: 'string' } },
      squareMetres: { type: 'number' },
      type: { type: 'string', enum: ['SALA', 'DESK'] },
    },
  },
};
