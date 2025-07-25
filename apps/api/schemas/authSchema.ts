export const signupSchema = {
  body: {
    type: "object",
    required: ["email", "password", "name", "role"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 10 }, //dieci caratteri? Why Not.
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
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};
