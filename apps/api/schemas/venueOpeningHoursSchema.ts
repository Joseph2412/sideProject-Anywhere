export const updateVenueOpeningHoursSchema = {
  body: {
    type: 'object',
    required: ['openingHours'],
    properties: {
      openingHours: {
        type: 'array',
        items: {
          type: 'object',
          required: ['day', 'periods'],
          properties: {
            day: {
              type: 'string',
              enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
            periods: {
              type: 'array',
              items: {
                type: 'object',
                required: ['start', 'end'],
                properties: {
                  start: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' }, // HH:mm format
                  end: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' }, // HH:mm format
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
