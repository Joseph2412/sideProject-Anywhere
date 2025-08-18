import { FastifyInstance } from 'fastify';
import { getPreferencesHandler, updatePreferencesHandler } from '../../handlers/user/preferences';

export async function preferencesRoute(fastify: FastifyInstance) {
  fastify.get('/preferences', {
    preHandler: fastify.authenticate,
    handler: getPreferencesHandler,
  });

  fastify.put('/preferences', {
    preHandler: fastify.authenticate,
    handler: updatePreferencesHandler,
  });
}
