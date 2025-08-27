const uploadImageSchema = {
  body: {
    type: 'object',
    required: ['type', 'id', 'filename', 'photoType'],
    properties: {
      type: { type: 'string', enum: ['host', 'venue', 'package'] },
      id: { anyOf: [{ type: 'string' }, { type: 'number' }] },
      filename: { type: 'string' },
      photoType: { type: 'string', enum: ['avatar', 'logo', 'gallery'] },
    },
  },
};
