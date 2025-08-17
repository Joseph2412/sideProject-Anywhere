import dotenv from 'dotenv';
dotenv.config();

import fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { decorateAuth } from './plugins/auth';
import { authRoutes } from './routes/auth/authRoutes';
import { userRoute } from './routes/user/userRoutes';
import {
  venueClosingPeriods,
  venueDetailsRoute,
  venueOpeningDaysRoute,
  venuePayments,
} from './routes/venues/venues';

//Ricorda di importare prisma in ogni handler senza istanziarlo sempre

const server: FastifyInstance = fastify();

server.register(cors, {
  origin: process.env.APP_HOST,
  credentials: true,
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  sign: { expiresIn: '7d' },
  //extra: aggiungo la scadenza del token
});

decorateAuth(server); //Sostituito con plugins/auth

//Rimanda Gli errori di validazione. Da Modificare per Build Finale
server.setErrorHandler((error, request, reply) => {
  if ((error as any).validation) {
    console.error('Validation failed:', (error as any).validation);
    return reply.status(400).send({
      error: 'Validation failed',
      details: (error as any).validation,
    });
  }
  reply.send(error);
});

// Endpoint di test
server.get('/ping', async (request, reply) => {
  return { message: 'pong' };
});

server.register(authRoutes, { prefix: '/auth' });
server.register(userRoute, { prefix: '/user' });
server.register(venueDetailsRoute, { prefix: '/api' });
server.register(venueOpeningDaysRoute, { prefix: '/api' });
server.register(venueClosingPeriods, { prefix: '/api' });
server.register(venuePayments, { prefix: '/api' });

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
