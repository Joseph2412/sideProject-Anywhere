import { FastifyInstance } from 'fastify';

import {
  getVenueDetailsHandler,
  updateVenueDetailsHandler,
} from '../../handlers/venues/venueDetails';

import { updateVenueDetailsSchema } from './../../schemas/venueDetailsSchema';

import { updateVenueOpeningDaysSchema } from '../../schemas/venueOpeningDaysSchema';

import {
  getVenueOpeningDaysHandler,
  updateVenueOpeningDaysHandler,
} from '../../handlers/venues/venueOpeningDays';
import {
  getVenueClosingPeriodsHandler,
  updateVenueClosingPeriodsHandler,
} from '../../handlers/venues/venueClosingPeriods'; // Corretto percorso
import { updateVenueClosingPeriodsSchema } from '../../schemas/venueClosingPeriodsSchema';

export async function venueDetailsRoute(fastify: FastifyInstance) {
  fastify.get('/venues', { preHandler: fastify.authenticate }, getVenueDetailsHandler);

  fastify.put(
    '/venues',
    {
      preValidation: [fastify.authenticate],
      schema: updateVenueDetailsSchema,
    },
    updateVenueDetailsHandler
  );
}

export async function venueOpeningDaysRoute(fastify: FastifyInstance) {
  fastify.get(
    '/venues/opening-days',
    { preHandler: fastify.authenticate },
    getVenueOpeningDaysHandler
  );
  fastify.put(
    '/venues/opening-days',
    { preHandler: fastify.authenticate, schema: updateVenueOpeningDaysSchema },
    updateVenueOpeningDaysHandler
  );
}

export async function venueClosingPeriods(fastify: FastifyInstance) {
  fastify.get(
    '/venues/closing-periods',
    { preHandler: fastify.authenticate },
    getVenueClosingPeriodsHandler
  );
  fastify.put(
    '/venues/closing-periods',
    { preHandler: fastify.authenticate, schema: updateVenueClosingPeriodsSchema },
    updateVenueClosingPeriodsHandler
  );
}
//Un domani, se aggiungi la gestione di più locali, dovrai modificare questi endpoint per supportare la selezione del locale specifico espondendo endpoint /venues/:id
