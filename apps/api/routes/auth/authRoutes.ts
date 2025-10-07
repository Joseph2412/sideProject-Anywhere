import { FastifyInstance } from "fastify";
import { loginRoute } from "./login";
import { signupRoute } from "./signup";
import { resetPasswordRoute } from "./resetPassword";
import { restorePasswordRoute } from "./restorePassword";
import { checkEmailRoute } from "./checkEmail";
import { meRoute } from "./me";

export async function authRoutes(server: FastifyInstance) {
  server.register(loginRoute);
  server.register(resetPasswordRoute);
  server.register(restorePasswordRoute);
  server.register(signupRoute);
  server.register(checkEmailRoute);
  
  server.register(meRoute);
}
