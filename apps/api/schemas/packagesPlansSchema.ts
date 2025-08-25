export const getPackagePlansSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          rate: { type: 'string' },
          price: { type: 'number' },
          isEnabled: { type: 'boolean' },
        },
        required: ['id', 'name', 'rate', 'price', 'isEnabled'],
        additionalProperties: false,
      },
    },
  },
};

export const updatePackagePlansSchema = {
  body: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        isEnabled: { type: 'boolean' },
        price: { type: 'number' },
        name: { type: 'string' },
        rate: { type: 'string' },
      },
      required: ['id', 'isEnabled', 'price'],
      additionalProperties: false,
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          rate: { type: 'string' },
          price: { type: 'number' },
          isEnabled: { type: 'boolean' },
        },
        required: ['id', 'name', 'rate', 'price', 'isEnabled'],
        additionalProperties: false,
      },
    },
  },
};
