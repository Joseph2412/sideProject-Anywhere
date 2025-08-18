import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

/**
 * Plugin Fastify per gestione JWT authentication
 * Pattern: fastify-plugin per registrazione automatica e decorator pattern
 * Features: registra @fastify/jwt e aggiunge decorator 'auth' per middleware
 * Configurazione: usa JWT_SECRET da environment variables
 */
export default fp(async function (app: FastifyInstance) {
  app.register(jwt, { secret: process.env.JWT_SECRET! });

  /**
   * Decorator 'auth' per middleware di autenticazione
   * Pattern: decorator pattern per aggiungere funzionalità all'istanza Fastify
   * Uso: preHandler: app.auth nelle route protette
   */
  app.decorate('auth', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });
});

/**
 * Type augmentation per aggiungere tipizzazione ai decorator
 */
declare module 'fastify' {
  interface FastifyInstance {
    auth: any;
  }
  interface FastifyRequest {
    user: { id: number; email: string; role: 'HOST' | 'USER' }; // payload firmato al login
  }
}
