import { createPackageSchema } from '../../schemas/packagesDetailsSchema';
import { FastifyInstance } from 'fastify';
import {
  getPackagesDetailsHandler,
  updatePackagesDetailsHandler,
  createPackageHandler,
  getAllPackagesHandler,
} from '../../handlers/packages/packagesDetails';
import {
  getPackagesPlansRateHandler,
  updatePackagesPlansRateHandler,
} from '../../handlers/packages/packagesPlansRate';
import {
  getPackagesDetailsSchema,
  updatePackageDetailsSchema,
} from '../../schemas/packagesDetailsSchema';

import { getPackagePlansSchema, updatePackagePlansSchema } from '../../schemas/packagesPlansSchema';

//Rotte per i Dettagli Generali Del pacchetto
export async function packagesDetailsRoutes(fastify: FastifyInstance) {
  // Rotta per la creazione di un nuovo pacchetto
  fastify.post(
    '/packages',
    { preValidation: fastify.authenticate, schema: createPackageSchema },
    createPackageHandler
  );

  // Rotta per ottenere tutti i pacchetti
  fastify.get('/packages', { preValidation: fastify.authenticate }, getAllPackagesHandler);

  fastify.get(
    '/packages/:id',
    { preValidation: fastify.authenticate, schema: getPackagesDetailsSchema },
    getPackagesDetailsHandler
  );

  fastify.put(
    '/packages/:id',
    { preValidation: fastify.authenticate, schema: updatePackageDetailsSchema },
    updatePackagesDetailsHandler
  );
}

//Rotte per I Piani/Tipi di Abbonamento dei Pacchetti
export async function packagesPlansRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/packages/:id/plans',
    { preValidation: fastify.authenticate, schema: getPackagePlansSchema },
    getPackagesPlansRateHandler
  );

  fastify.put(
    '/packages/:id/plans',
    { preValidation: fastify.authenticate, schema: updatePackagePlansSchema },
    updatePackagesPlansRateHandler
  );
}
