import { FastifyInstance } from "fastify";
import {
  profileHandler,
  updateProfileHandler,
} from "../../handlers/user/profile";
import { profileSchema, updateProfileSchema } from "../../schemas/authSchema";

export async function profileRoute(fastify: FastifyInstance) {
  fastify.get(
    "/profile",
    { preHandler: fastify.authenticate, schema: profileSchema },
    profileHandler,
  );

  fastify.put("/profile", {
    preValidation: [fastify.authenticate],
    schema: updateProfileSchema,
    handler: updateProfileHandler,
  });
}
