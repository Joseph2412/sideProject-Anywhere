import { FastifyInstance } from "fastify";
import { profileRoute } from "./profile";
import { preferencesRoute } from "./preferences";

export async function userRoute(server: FastifyInstance) {
  server.register(profileRoute);
  server.register(preferencesRoute);
}
