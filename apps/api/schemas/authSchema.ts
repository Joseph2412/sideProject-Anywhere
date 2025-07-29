export const signupSchema = {
  body: {
    type: "object",
    required: ["email", "password", "name", "role"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 }, //dieci caratteri? Why Not.
      name: { type: "string" },
      role: {
        type: "string",
        enum: ["USER", "HOST"],
      },
    },
    additionalProperties: false,
  },
};

//Richiama qui il types da Packages...See PRISMA DOCS

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
      },

      password: {
        type: "string",
        minLength: 1,
      },
    },
    additionalProperties: false,
  },
};

export const resetPasswordScheme = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: {
        type: "string",
        format: "email",
      },
    },
    additionalProperties: false,
  },
};

export const restorePasswordScheme = {
  body: {
    type: "object",
    required: ["token", "newPassoword"],
    properties: {
      token: { type: "string" },
      newPassword: { type: "string", minLength: 10 },
    },
    additionalProperties: false,
  },
};

export const checkEmailSchema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: {
        type: "string",
        format: "email",
      },
    },
    additionalProperties: false,
  },
};
