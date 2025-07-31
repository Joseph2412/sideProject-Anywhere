import { FastifyInstance } from "fastify";
import { signupSchema } from "../../schemas/authSchema";
import { signupHandler } from "../../handlers/auth/signup";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/singnup", { schema: signupSchema }, signupHandler);
}
