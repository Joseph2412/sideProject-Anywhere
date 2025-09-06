import { FastifyInstance } from 'fastify';
import 'fastify';
import { imagesHandler } from './../../handlers/images/imagesHandler';

export async function imagesRoutes(fastify: FastifyInstance) {
  // Get gallery images (presigned URLs) based on entity and id
  fastify.get(
    '/gallery/:entity/:id',
    { preValidation: fastify.authenticate },
    imagesHandler.getGallery
  );

  // Get signed URL for a file
  fastify.get('/file', { preValidation: fastify.authenticate }, imagesHandler.get);

  // Upload
  fastify.post('/upload', { preValidation: fastify.authenticate }, imagesHandler.upload);

  // Delete a file
  fastify.delete('/delete', { preValidation: fastify.authenticate }, imagesHandler.delete);
}
