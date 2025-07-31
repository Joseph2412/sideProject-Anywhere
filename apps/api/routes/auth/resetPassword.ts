import { FastifyInstance } from "fastify";
import { resetPasswordHandler } from "../../handlers/auth/reset";
import { resetPasswordScheme } from "../../schemas/authSchema";

export async function resetPasswordRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/resetPassword",
    { schema: resetPasswordScheme },
    resetPasswordHandler,
  );
}
