export const signupSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'role'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }, //minomo 8 Caratteri.
      firstName: { type: 'string', minLength: 1 },
      lastName: { type: 'string', minLength: 1 },
      role: {
        type: 'string',
        enum: ['USER', 'HOST'],
      },
    },
    additionalProperties: false,
  },
};

//Richiama qui il types da Packages...See PRISMA DOCS

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },

      password: {
        type: 'string',
        minLength: 1,
      },
    },
    additionalProperties: false,
  },
};

export const resetPasswordScheme = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
    },
    additionalProperties: false,
  },
};

export const restorePasswordScheme = {
  body: {
    type: 'object',
    required: ['token', 'newPassword'],
    properties: {
      token: { type: 'string' },
      newPassword: { type: 'string', minLength: 10 },
    },
    additionalProperties: false,
  },
};

export const checkEmailSchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
    },
    additionalProperties: false,
  },
};

export const profileSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            avatarUrl: { type: 'string' },
            preferences: { type: 'object' },
            role: { type: 'string', enum: ['USER', 'HOST'] },
            coworkingVenue: {
              type: ['object', 'null'],
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
              },
              required: ['id', 'name'],
            },
          },
          required: ['id', 'firstName', 'lastName', 'email', 'role', 'avatarUrl', 'preferences'],
        },
      },
      required: ['user'],
    },
  },
};

export const updateProfileSchema = {
  body: {
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: { type: 'string', minLength: 1, maxLength: 20 },
      lastName: { type: 'string', minLength: 1, maxLength: 20 },
      avatarUrl: { type: 'string' },
      preferences: { type: 'object' },
    },
    additionalProperties: false,
  },
};
