import dotenv from 'dotenv';
dotenv.config();

import multipart from '@fastify/multipart';

import fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { s3Plugin } from './plugins/s3';

import { decorateAuth } from './plugins/auth';
import { authRoutes } from './routes/auth/authRoutes';
import { userRoute } from './routes/user/userRoutes';
import {
  venueClosingPeriods,
  venueDetailsRoute,
  venueOpeningDaysRoute,
  venuePayments,
} from './routes/venues/venues';
import { packagesRoutes } from './routes/packages/packagesRoutes';
import { imagesRoutes } from './routes/images/images';
import fastifyMultipart from '@fastify/multipart';

import { googlePlacesRoutes } from './proxy/googleGeoLocation';

//Ricorda di importare prisma in ogni handler senza istanziarlo sempre

const server: FastifyInstance = fastify();

server.register(cors, {
  origin: process.env.APP_HOST,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],

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

server.register(s3Plugin);
server.register(fastifyMultipart, { attachFieldsToBody: true });

//Rotte di AUTENTICAZIONE (Rotte di Servizio)
server.register(authRoutes, { prefix: '/auth' });

//Rotte sezione UTENTE/PROFILO
server.register(userRoute, { prefix: '/user' });

//Rotte Sezione Locale (Venue + Dettagli Pagamenti)
server.register(venueDetailsRoute, { prefix: '/api' });
server.register(venueOpeningDaysRoute, { prefix: '/api' });
server.register(venueClosingPeriods, { prefix: '/api' });
server.register(venuePayments, { prefix: '/api' });

//Rotte Sezione Recensioni
//server.register(reviewsRoutes, { prefix: '/api' });

//Rotte Sezione Pacchetti
server.register(packagesRoutes, { prefix: '/api' });

//Rotta per GET/POST/DELETE Foto dell'intero Applicativo

//Metodi GET POST DELETE Consentiti e previsiti
server.register(imagesRoutes, { prefix: '/media' });

server.register(googlePlacesRoutes, { prefix: '/api/google' });

//Rotta di Servizio per Avvio BACKEND
server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
