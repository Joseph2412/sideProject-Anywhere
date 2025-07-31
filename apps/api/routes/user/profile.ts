import { FastifyInstance } from "fastify";
import { profileHandler } from "../../handlers/user/profile";
import { profileSchema } from "../../schemas/authSchema";

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/user/profile",
    { preHandler: fastify.authenticate, schema: profileSchema },
    profileHandler,
  );
}
