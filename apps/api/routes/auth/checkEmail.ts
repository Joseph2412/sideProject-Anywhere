import { FastifyInstance } from 'fastify';
import { checkEmailHandler } from '../../handlers/auth/checkEmail';
import { checkEmailSchema } from '../../schemas/authSchema';

export async function checkEmailRoute(fastify: FastifyInstance) {
  fastify.post('/check-email', { schema: checkEmailSchema }, checkEmailHandler);
}
