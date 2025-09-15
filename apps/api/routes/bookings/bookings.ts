import fastify, { FastifyInstance } from 'fastify';

import 'fastify';

import {
  createNewBooking,
  deleteBooking,
  getBookingDetails,
  getVenueBookings,
} from '../../handlers/booking/BookingHandler';
import { addSSEClient } from '../../handlers/booking/BookingSSEHandler';
import { createBookingSchema, deleteBookingSchema } from '../../schemas/bookingSchema';

export async function bookingsRoute(fastify: FastifyInstance) {
  fastify.delete(
    '/booking/:id',
    { preValidation: fastify.authenticate, schema: deleteBookingSchema },
    deleteBooking
  );

  fastify.post(
    '/booking/:id',
    { preValidation: fastify.authenticate, schema: createBookingSchema },
    createNewBooking
  );

  fastify.get('/booking/:id', { preHandler: fastify.authenticate }, getBookingDetails);
}

export async function venueBookingsDetailsRoute(fastify: FastifyInstance) {
  fastify.get('/venues/bookings/:id', { preHandler: fastify.authenticate }, getVenueBookings);

  // Rotta SSE per aggiornamenti in tempo reale delle prenotazioni
  fastify.get('/venue/:venueId/events', async (request, reply) => {
    const { venueId } = request.params as { venueId: string };
    const { token } = request.query as { token?: string };
    const venueIdNum = parseInt(venueId);

    if (isNaN(venueIdNum)) {
      return reply.code(400).send({ error: 'ID venue non valido' });
    }

    // Verifica il token (dall'header o dalla query)
    try {
      // Se il token è nella query, lo aggiungiamo temporaneamente all'header
      if (token) {
        request.headers.authorization = `Bearer ${token}`;
      }

      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Token non valido o scaduto' });
    }

    // Configura la connessione SSE
    addSSEClient(venueIdNum, reply);
  });
}
