import { FastifyInstance } from "fastify";

import { imagesRoutes } from "./images";

export async function imageRoutes(fastify: FastifyInstance) {
  imagesRoutes(fastify);
}
