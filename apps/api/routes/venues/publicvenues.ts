import { FastifyInstance } from 'fastify';

import {
  getPublicVenuesHandler,
  getPublicVenueDetailsHandler,
} from '../../handlers/booking/PublicVenueHandler';

export async function allPublicVenueDetailsRoute(fastify: FastifyInstance) {
  fastify.get('/public/venues', getPublicVenuesHandler);
}

export async function singlePublicVenueDetailsRoute(fastify: FastifyInstance) {
  fastify.get('/public/venues/:id', getPublicVenueDetailsHandler);
}
