export const updateVenueOpeningDaysSchema = {
  body: {
    type: 'object',
    required: ['openingDays'],
    properties: {
      openingDays: {
        type: 'array',
        items: {
          type: 'object',
          required: ['day'],
          properties: {
            day: {
              type: 'string',
              enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
            periods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  start: { type: ['string', 'null'], pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' }, // HH:mm format
                  end: { type: ['string', 'null'], pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' }, // HH:mm format
                },
              },
            },
            isClosed: { type: 'boolean' },
          },
        },
      },
    },
    additionalProperties: false,
  },
};
