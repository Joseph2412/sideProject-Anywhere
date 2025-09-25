import { FastifyInstance } from "fastify";
import { loginHandler } from "../../handlers/auth/login";
import { loginSchema } from "../../schemas/authSchema";

export async function loginRoute(fastify: FastifyInstance) {
  fastify.post("/login", { schema: loginSchema }, loginHandler);
}
