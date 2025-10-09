import { FastifyInstance } from "fastify";

import {
  allPublicVenueDetailsRoute,
} from "./publicvenues";

export async function publicVenuesRoutes(fastify: FastifyInstance) {
  allPublicVenueDetailsRoute(fastify);
}
