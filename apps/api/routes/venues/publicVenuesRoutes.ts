import { FastifyInstance } from "fastify";

import {
  allPublicVenueDetailsRoute,
  singlePublicVenueDetailsRoute,
} from "./publicvenues";

export async function publicVenuesRoutes(fastify: FastifyInstance) {
  allPublicVenueDetailsRoute(fastify);
  singlePublicVenueDetailsRoute(fastify);
}
