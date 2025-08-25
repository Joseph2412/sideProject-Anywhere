export const createPackageSchema = {
  body: {
    type: 'object',
    required: ['name', 'type'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      capacity: { type: 'number' },
      seats: { type: 'number' },
      services: { type: 'array', items: { type: 'string' } },
      squareMetres: { type: 'number' },
      type: { type: 'string', enum: ['SALA', 'DESK'] },
      isActive: { type: 'boolean' },
    },
  },
};
export const getPackagesDetailsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      squareMetres: { type: 'number' },
      capacity: { type: 'number' },
      services: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      type: {
        type: 'string',
        enum: ['SALA', 'DESK'],
      },
      seats: { type: 'number' },
    },
  },
};

export const updatePackageDetailsSchema = {
  body: {
    type: 'object',
    required: ['name', 'type'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      squareMetres: { type: 'number' },
      capacity: { type: 'number' },
      services: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      type: {
        type: 'string',
        enum: ['SALA', 'DESK'],
      },
      seats: { type: 'number' },
      isActive: { type: 'boolean' },
    },
  },
};
