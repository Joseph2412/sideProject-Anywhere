import { FastifyInstance } from 'fastify';
import { getVenueDetailsHandler, updateVenueDetailsHandler } from './../../handlers/venues/venue';
import { venueDetailsSchema, updateVenueDetailsSchema } from './../../schemas/venueDetailsSchema';

export async function venueDetailsRoute(fastify: FastifyInstance) {
  fastify.get(
    '/venues',
    {
      preHandler: fastify.authenticate,
    },
    getVenueDetailsHandler
  );

  fastify.put('/venues', {
    preValidation: [fastify.authenticate],
    schema: updateVenueDetailsSchema,
    handler: updateVenueDetailsHandler,
  });
}

//Un domani, se aggiungi la gestione di più locali, dovrai modificare questi endpoint per supportare la selezione del locale specifico espondendo endpoint /venues/:id
