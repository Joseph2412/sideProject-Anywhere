import { FastifyInstance } from 'fastify';

import {
  getVenueDetailsHandler,
  updateVenueDetailsHandler,
} from '../../handlers/venues/venueDetails';

import { updateVenueDetailsSchema } from './../../schemas/venueDetailsSchema';

import { updateVenueOpeningHoursSchema } from '../../schemas/venueOpeningHoursSchema';

import {
  getVenueOpeningHoursHandler,
  updateVenueOpeningHoursHandler,
} from '../../handlers/venues/venueOpeningHours';

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

export async function venueOpeningHoursRoute(fastify: FastifyInstance) {
  fastify.get(
    '/venues/opening-hours',
    { preHandler: fastify.authenticate },
    getVenueOpeningHoursHandler
  );
  fastify.put(
    '/venues/opening-hours',
    { preHandler: fastify.authenticate, schema: updateVenueOpeningHoursSchema },
    updateVenueOpeningHoursHandler
  );
}

//Un domani, se aggiungi la gestione di più locali, dovrai modificare questi endpoint per supportare la selezione del locale specifico espondendo endpoint /venues/:id
