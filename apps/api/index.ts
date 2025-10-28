import dotenv from "dotenv";
dotenv.config();

import multipart from "@fastify/multipart";

import fastify, { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { s3Plugin } from "./plugins/s3";

const PORT = parseInt(process.env.PORT || "3001", 10);

import { decorateAuth } from "./plugins/auth";
import { authRoutes } from "./routes/auth/authRoutes";
import { userRoute } from "./routes/user/userRoutes";
import {
  venueClosingPeriods,
  venueDetailsRoute,
  venueOpeningDaysRoute,
  venuePayments,
} from "./routes/venues/venues";
import { packagesRoutes } from "./routes/packages/packagesRoutes";
import { imagesRoutes } from "./routes/images/images";

import { bookingsRoutes } from "./routes/bookings/bookingsRoutes";

import fastifyMultipart from "@fastify/multipart";

import { googlePlacesRoutes } from "./proxy/googleGeoLocation";

import { publicVenuesRoutes } from "./routes/venues/publicVenuesRoutes";
import { secureMediaRoutes } from "./routes/media/secureMediaRoutes";

const server: FastifyInstance = fastify();

server.register(cors, {
  origin: [
    process.env.APP_HOST,     // http://localhost:3000 (host app)
    process.env.APP_CLIENT,   // http://localhost:3002 (client app)
    'http://192.168.1.101:3000', // IP locale host app
    'http://192.168.1.101:3002', // IP locale client app
  ].filter((origin): origin is string => Boolean(origin)), // Rimuove eventuali undefined
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

  credentials: true,
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  sign: { expiresIn: "7d" },
  //extra: aggiungo la scadenza del token
});

decorateAuth(server); //Sostituito con plugins/auth

//Rimanda Gli errori di validazione. Da Modificare per Build Finale
server.setErrorHandler((error, request, reply) => {
  if ((error as any).validation) {
    console.error("Validation failed:", (error as any).validation);
    return reply.status(400).send({
      error: "Validation failed",
      details: (error as any).validation,
    });
  }
  reply.send(error);
});

// Endpoint di test
server.get("/ping", async (request, reply) => {
  return { message: "pong" };
});

server.register(s3Plugin);
server.register(fastifyMultipart, { attachFieldsToBody: true });

//Rotte di AUTENTICAZIONE (Rotte di Servizio)
server.register(authRoutes, { prefix: "/auth" });

//Rotte sezione UTENTE/PROFILO
server.register(userRoute, { prefix: "/user" });

//Rotte Sezione Locale (Venue + Dettagli Pagamenti)
server.register(venueDetailsRoute, { prefix: "/api" });
server.register(venueOpeningDaysRoute, { prefix: "/api" });
server.register(venueClosingPeriods, { prefix: "/api" });
server.register(venuePayments, { prefix: "/api" });

//Rotte Sezione Pacchetti
server.register(packagesRoutes, { prefix: "/api" });

//Rotte per Prenotazioni/Booking
server.register(bookingsRoutes, { prefix: "/bookings" });

//Rotta per GET/POST/DELETE Foto dell'intero Applicativo
//Metodi GET POST DELETE Consentiti e previsiti
server.register(imagesRoutes, { prefix: "/media" });

// Rotte proxy sicure per servire media S3 senza esporre credenziali
server.register(secureMediaRoutes, { prefix: "/secure-media" });

server.register(googlePlacesRoutes, { prefix: "/api/google" });

//Rotte esterne per Applicazione Cliente
server.register(publicVenuesRoutes);


//Rotta di Servizio per Avvio BACKEND
const start = async () => {
  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
    
    console.log(`\n🚀 Server running on http://localhost:${PORT}\n`);
    
    // ✅ AGGIUNGI QUESTO per vedere tutte le rotte
    console.log("📍 Registered API Routes:\n");
    const routes = server.printRoutes({ commonPrefix: false });
    
    // Formatta l'output per renderlo più leggibile
    const routeLines = routes.split('\n').filter(line => 
      line.includes('POST') || 
      line.includes('GET') || 
      line.includes('PUT') || 
      line.includes('DELETE')
    );
    
    routeLines.forEach(line => {
      const colorMap: Record<string, string> = {
        'POST': '\x1b[34m',   // Blu
        'GET': '\x1b[32m',    // Verde
        'PUT': '\x1b[33m',    // Giallo
        'DELETE': '\x1b[31m', // Rosso
      };
      
      let coloredLine = line;
      Object.entries(colorMap).forEach(([method, color]) => {
        coloredLine = coloredLine.replace(method, `${color}${method}\x1b[0m`);
      });
      
      console.log(coloredLine);
    });
    
    console.log('\n');
    
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

//Continua con il Backend
//Imposta un componente per visualizzare le prenotazioni presenti e passate.

