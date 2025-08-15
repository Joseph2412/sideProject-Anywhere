import { FastifyInstance } from 'fastify';

//Import Handler e Schema per Dettagli Locale
import {
  getVenueDetailsHandler,
  updateVenueDetailsHandler,
} from '../../handlers/venues/venueDetails';

import { updateVenueDetailsSchema } from './../../schemas/venueDetailsSchema';

//Import Handler e Schema per i Giorni di Apertura
import { updateVenueOpeningDaysSchema } from '../../schemas/venueOpeningDaysSchema';

import {
  getVenueOpeningDaysHandler,
  updateVenueOpeningDaysHandler,
} from '../../handlers/venues/venueOpeningDays';

//Import Handler e Schema per i Periodi di Chiusura
import {
  getVenueClosingPeriodsHandler,
  updateVenueClosingPeriodsHandler,
} from '../../handlers/venues/venueClosingPeriods';
import { updateVenueClosingPeriodsSchema } from '../../schemas/venueClosingPeriodsSchema';

//Import Handler e Schema per Dettagli Pagamenti
import {
  getVenuePaymentsDetailsHandler,
  updateVenuePaymentsDetailsHandler,
} from './../../handlers/venues/venuePaymentsDetails';
import { updateVenuePaymentsDetailsSchema } from '../../schemas/venuePaymentsDetailsSchema';

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

export async function venuePayments(fastify: FastifyInstance) {
  fastify.get(
    '/venues/payments',
    { preHandler: fastify.authenticate }, // Riabilitato
    getVenuePaymentsDetailsHandler
  );
  fastify.put(
    '/venues/payments',
    { preHandler: fastify.authenticate, schema: updateVenuePaymentsDetailsSchema },
    updateVenuePaymentsDetailsHandler
  );
}

//Un domani, se aggiungi la gestione di più locali, dovrai modificare questi endpoint per supportare la selezione del locale specifico espondendo endpoint /venues/:id
