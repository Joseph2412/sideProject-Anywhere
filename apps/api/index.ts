import dotenv from "dotenv";
dotenv.config();

import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import {
  signupSchema,
  loginSchema,
  restorePasswordScheme,
  resetPasswordScheme,
  checkEmailSchema,
} from "./schemas/authSchema";

import { loginHandler } from "./handlers/auth/login";
import { signupHandler } from "./handlers/auth/signup";
import { resetPasswordHandler } from "./handlers/auth/reset";
import { restorePasswordHandler } from "./handlers/auth/restore";
import { checkEmailHandler } from "./handlers/auth/checkEmail";

const server: FastifyInstance = fastify();

server.register(cors, {
  origin: "http://localhost:3000",
  credentials: true,
});

server.register(cookie);
server.register(fastifyJwt, { secret: process.env.JWT_SECRET! });

server.decorate(
  "authenticate",
  async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: "Non Autorizzato" });
    }
  },
);

// Signup
server.post("/signup", { schema: signupSchema }, signupHandler);

// Login+CheckEmail
server.post("/login", { schema: loginSchema }, loginHandler);
server.post("/check-email", { schema: checkEmailSchema }, checkEmailHandler);

// Reset Password
server.post(
  "/resetPassword",
  { schema: resetPasswordScheme },
  resetPasswordHandler,
);

// Restore Password
server.post(
  "/restorePassword",
  { schema: restorePasswordScheme },
  restorePasswordHandler,
);

// server.get(
//   "/dashboard",
//   { preHandler: server.authenticate },
//   async (request, reply) => {
//     return {
//       message: "Autenticato",
//       user: request.user,
//     };
//   },
// );

//Rimanda Gli errori di validazione. Da Modificare per Build Finale
server.setErrorHandler((error, request, reply) => {
  if ((error as any).validation) {
    console.error("Validation failed:", (error as any).validation);
    return reply.status(400).send({
      error: "Validation failed",
      details: (error as any).validation,
    });
  }

  reply.send(error);
});

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`✅ Server listening at ${address}`);
});
