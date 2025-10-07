import { FastifyInstance } from "fastify";
import { meHandler } from "../../handlers/auth/me";

export async function meRoute(fastify: FastifyInstance) {
    fastify.get("/me", {
        preHandler: [fastify.authenticate], // Richiede autenticazione JWT
    }, meHandler);
}