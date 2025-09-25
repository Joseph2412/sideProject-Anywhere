import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export function decorateAuth(server: FastifyInstance) {
  server.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ message: "Non Autorizzato" });
      }
    },
  );
}
