import { FastifyInstance } from 'fastify';

import { bookingsRoute, venueBookingsDetailsRoute } from './bookings';

export async function bookingsRoutes(fastify: FastifyInstance) {
  bookingsRoute(fastify);
  venueBookingsDetailsRoute(fastify);
}
