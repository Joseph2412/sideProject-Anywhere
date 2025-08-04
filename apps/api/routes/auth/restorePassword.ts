import { FastifyInstance } from 'fastify';
import { restorePasswordHandler } from '../../handlers/auth/restore';
import { restorePasswordScheme } from '../../schemas/authSchema';

export async function restorePasswordRoute(fastify: FastifyInstance) {
  fastify.post('/restorePassword', { schema: restorePasswordScheme }, restorePasswordHandler);
}
