import { FastifyInstance } from 'fastify';

import { venueDetailsRoute } from './venues';

export async function venuesRoutes(fastify: FastifyInstance) {
  venueDetailsRoute(fastify);
}
