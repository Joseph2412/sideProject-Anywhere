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
  createPackageSchema,
  getPackagesDetailsSchema,
  updatePackageDetailsSchema,
} from '../../schemas/packagesDetailsSchema';

import { getPackagePlansSchema, updatePackagePlansSchema } from '../../schemas/packagesPlansSchema';

//Rotte per i Dettagli Generali Del pacchetto
export async function packagesDetailsRoutes(fastify: FastifyInstance) {
  // Rotta per la creazione di un nuovo pacchetto
  fastify.post(
    '/packages/add',
    { preValidation: fastify.authenticate, schema: createPackageSchema },
    createPackageHandler
  );

  // Rotta per ottenere tutti i pacchetti
  fastify.get('/packages', { preValidation: fastify.authenticate }, getAllPackagesHandler);

  //Rotta per ottenere i dettagli di un pacchetto tramite ID
  fastify.get(
    '/packages/:id',
    { preValidation: fastify.authenticate, schema: getPackagesDetailsSchema },
    getPackagesDetailsHandler
  );

  //Rotta per aggiornare i dettagli di un pacchetto tramite ID
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
