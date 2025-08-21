import { FastifyInstance } from 'fastify';

import { packagesDetailsRoutes, packagesPlansRoutes } from './packages';

export async function packagesRoutes(fastify: FastifyInstance) {
  packagesDetailsRoutes(fastify);
  packagesPlansRoutes(fastify);
}
