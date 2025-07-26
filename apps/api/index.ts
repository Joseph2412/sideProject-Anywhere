import fastify from "fastify";
import cors from "@fastify/cors";
import {
  signupSchema,
  loginSchema,
  restorePasswordScheme,
  resetPasswordScheme,
} from "./schemas/authSchema";
import { loginHandler } from "./handlers/auth/login";
import { signupHandler } from "./handlers/auth/signup";
import { resetPasswordHandler } from "./handlers/auth/reset";
import { restorePasswordHandler } from "./handlers/auth/restore";
const server = fastify();

server.register(cors, { origin: true });

// Signup
server.post("/signup", { schema: signupSchema }, signupHandler);

// Login
server.post("/login", { schema: loginSchema }, loginHandler);

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

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`✅ Server listening at ${address}`);
});
