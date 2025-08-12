import { FastifyInstance } from 'fastify';

import { venueDetailsRoute, venueOpeningHoursRoute } from './venues';

export async function venuesRoutes(fastify: FastifyInstance) {
  venueDetailsRoute(fastify);
  venueOpeningHoursRoute(fastify);
}
