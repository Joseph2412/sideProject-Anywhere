import { FastifyInstance } from 'fastify';
import { profileRoute } from './profile';

export async function userRoute(server: FastifyInstance) {
  server.register(profileRoute);
}
