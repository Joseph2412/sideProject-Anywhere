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
  profileSchema,
} from "./schemas/authSchema";

import { loginHandler } from "./handlers/auth/login";
import { signupHandler } from "./handlers/auth/signup";
import { profileHandler } from "./handlers/user/profile";
import { resetPasswordHandler } from "./handlers/auth/reset";
import { restorePasswordHandler } from "./handlers/auth/restore";
import { checkEmailHandler } from "./handlers/auth/checkEmail";
import { PrismaClient } from "@repo/database";

const server: FastifyInstance = fastify();
const prisma = new PrismaClient();

server.register(cors, {
  origin: "http://localhost:3000",
  credentials: true,
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  sign: { expiresIn: "7d" },
  //extra: aggiungo la scadenza del token
});

server.register(async function (protectedRoutes) {
  protectedRoutes.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply
        .status(401)
        .send({ message: "Token Non Valido o Non Presente" });
    }
  });
  protectedRoutes.get("/dashboard", async (request, reply) => {
    return {
      user: request.user,
    };
  });
});

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

server.get(
  "/user/profile",
  { preHandler: server.authenticate, schema: profileSchema },
  profileHandler,
);

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
