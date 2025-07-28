import "fastify";
import "@fastify/jwt";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string; role: "HOST" | "USER" };
    user: { id: number; email: string; role: "HOST" | "USER" };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}
