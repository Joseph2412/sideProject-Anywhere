import { FastifyInstance } from 'fastify';

import { venueDetailsRoute, venueOpeningDaysRoute, venueClosingPeriods } from './venues';

export async function venuesRoutes(fastify: FastifyInstance) {
  venueDetailsRoute(fastify);
  venueOpeningDaysRoute(fastify);
  venueClosingPeriods(fastify);
}
