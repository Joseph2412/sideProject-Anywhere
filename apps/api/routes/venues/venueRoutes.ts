import { FastifyInstance } from 'fastify';

import {
  venueDetailsRoute,
  venueOpeningDaysRoute,
  venueClosingPeriods,
  venuePayments,
} from './venues';

export async function venuesRoutes(fastify: FastifyInstance) {
  venueDetailsRoute(fastify);
  venueOpeningDaysRoute(fastify);
  venueClosingPeriods(fastify);
  venuePayments(fastify);
}
