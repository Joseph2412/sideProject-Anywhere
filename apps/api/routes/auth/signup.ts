import { FastifyInstance } from 'fastify';
import { signupSchema } from '../../schemas/authSchema';
import { signupHandler } from '../../handlers/auth/signup';

export async function signupRoute(fastify: FastifyInstance) {
  fastify.post('/signup', { schema: signupSchema }, signupHandler);
}
