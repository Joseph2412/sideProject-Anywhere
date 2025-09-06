export const createReviewSchema = {
  body: {
    type: 'object',
    required: ['reviewWifi', 'reviewStaff', 'reviewQuiet', 'reviewComfort'],
    properties: {
      reviewWifi: { type: 'number', minimum: 1, maximum: 5 },
      reviewStaff: { type: 'number', minimum: 1, maximum: 5 },
      reviewQuiet: { type: 'number', minimum: 1, maximum: 5 },
      reviewComfort: { type: 'number', minimum: 1, maximum: 5 },
    },
  },
};
