import { FastifyInstance } from 'fastify';
import 'fastify';
import { imagesHandler } from './../../handlers/images/imagesHandler';

export async function imagesRoutes(fastify: FastifyInstance) {
  // Get signed URL for a file
  fastify.get('/file', { preValidation: fastify.auth }, imagesHandler.get);

  // Upload
  fastify.post('/upload', { preValidation: fastify.auth }, imagesHandler.upload);

  // Delete a file
  fastify.delete('/file', { preValidation: fastify.auth }, imagesHandler.delete);
}
