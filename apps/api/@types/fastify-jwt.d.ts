/**
 * Type definitions per estensione Fastify JWT
 * Pattern: Module augmentation per aggiungere tipizzazione custom
 * JWT payload: struttura standardizzata per autenticazione utenti
 * Fastify extension: aggiunge metodo authenticate all'istanza server
 */
import "@fastify/jwt";
import "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";

/**
 * Estende FastifyJWT con payload personalizzato
 * Definisce la struttura del token JWT per user authentication
 */
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string; role: "HOST" | "USER" };
    user: { id: number; email: string; role: "HOST" | "USER" };
  }
}

/**
 * Estende FastifyInstance con metodi di autenticazione
 * Aggiunge authenticate decorator disponibile in tutte le route
 */
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    s3: {
      uploadFile: (
        bucket: string,
        file: any,
        key: string,
        mimetype: string,
      ) => Promise<string>;
      deleteFile: (bucket: string, key: string) => Promise<void>;
      getSignedUrl: (bucket: string, key: string) => Promise<string>;
      getObject: (bucket: string, key: string) => Promise<any>;
    };
  }
  interface FastifyRequest {
    s3: FastifyInstance["s3"];
  }
}
