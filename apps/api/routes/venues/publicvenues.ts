import { FastifyInstance } from "fastify";

import {
  getPublicVenuesHandler,
} from "../../handlers/booking/PublicVenueHandler";

export async function allPublicVenueDetailsRoute(fastify: FastifyInstance) {
  fastify.get("/public/venues", getPublicVenuesHandler);
}

