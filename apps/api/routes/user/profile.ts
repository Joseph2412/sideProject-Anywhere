import { FastifyInstance } from "fastify";
import { profileHandler } from "../../handlers/user/profile";
import { profileSchema } from "../../schemas/authSchema";

export async function profileRoute(fastify: FastifyInstance) {
  fastify.get(
    "/profile",
    { preHandler: fastify.authenticate, schema: profileSchema },
    profileHandler,
  );
}
