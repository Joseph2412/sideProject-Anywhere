import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string; role: "HOST" | "USER" }; // opzionale
    user: { id: number; email: string; role: "HOST" | "USER" }; // obbligatorio se usi request.user
  }
}
