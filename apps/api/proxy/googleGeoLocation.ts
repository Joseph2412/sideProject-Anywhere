import { FastifyInstance, FastifyRequest } from 'fastify';

interface GooglePlacesQuery {
  input: string;
}

interface GooglePlaceDetailsQuery {
  placeId: string;
}

export async function googlePlacesRoutes(fastify: FastifyInstance) {
  // Endpoint per autocomplete
  fastify.get<{ Querystring: GooglePlacesQuery }>(
    '/places/autocomplete',
    {
      preHandler: [fastify.authenticate], // Usa il plugin auth esistente
      schema: {
        querystring: {
          type: 'object',
          required: ['input'],
          properties: {
            input: { type: 'string', minLength: 3 },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: GooglePlacesQuery }>, reply) => {
      const { input } = request.query;

      try {
        const googleUrl =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
          `input=${encodeURIComponent(input)}` +
          `&types=establishment` +
          `&components=country:IT` +
          `&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        console.log(
          'Calling Google Places API:',
          googleUrl.replace(process.env.GOOGLE_MAPS_API_KEY || '', '[API_KEY]')
        );

        const response = await fetch(googleUrl);
        const data = await response.json();

        console.log('Google API response status:', data.status);
        if (data.error_message) {
          console.error('Google API error:', data.error_message);
        }

        return reply.send(data);
      } catch (error) {
        console.error('Error calling Google Places API:', error);
        return reply.code(500).send({ error: 'Errore nel servizio Google Places' });
      }
    }
  );

  // Endpoint per dettagli del luogo
  fastify.get<{ Querystring: GooglePlaceDetailsQuery }>(
    '/places/details',
    {
      preHandler: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['placeId'],
          properties: {
            placeId: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: GooglePlaceDetailsQuery }>, reply) => {
      const { placeId } = request.query;

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?` +
            `place_id=${placeId}` +
            `&fields=geometry,formatted_address,name` +
            `&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();
        return reply.send(data);
      } catch (error) {
        return reply.code(500).send({ error: 'Errore nel recupero dettagli luogo' });
      }
    }
  );
}
