import { FastifyInstance } from "fastify";
import { restorePasswordHandler } from "../../handlers/auth/restore";
import { restorePasswordScheme } from "../../schemas/authSchema";

export async function restorePasswordRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/restorePassword",
    { schema: restorePasswordScheme },
    restorePasswordHandler,
  );
}
