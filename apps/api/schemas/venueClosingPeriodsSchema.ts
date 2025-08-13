export const updateVenueClosingPeriodsSchema = {
  body: {
    type: 'object',
    required: ['closingPeriods'],
    properties: {
      closingPeriods: {
        type: 'array',
        items: {
          type: 'object',
          required: ['start', 'end', 'isClosed'],
          properties: {
            start: { type: 'string', format: 'date-time' }, // ISO 8601
            end: { type: 'string', format: 'date-time' },
            isClosed: { type: 'boolean' },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
};
