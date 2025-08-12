import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

export default fp(async function (app: FastifyInstance) {
  app.register(jwt, { secret: process.env.JWT_SECRET! });
  app.decorate('auth', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    auth: any;
  }
  interface FastifyRequest {
    user: { id: number; email: string; role: 'HOST' | 'USER' }; // payload firmato al login
  }
}
