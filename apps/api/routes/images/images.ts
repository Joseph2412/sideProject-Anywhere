import { FastifyInstance } from 'fastify';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3Service } from 'plugins/s3';
import 'fastify';
import { Multipart, MultipartFields, MultipartFile } from '@fastify/multipart';

declare module 'fastify' {
  interface FastifyInstance {
    s3: S3Service;
  }
}

export async function imagesRoutes(fastify: FastifyInstance) {
  // Upload
  fastify.post('/upload', { preValidation: fastify.auth }, async (request, reply) => {
    const data = (await request.file()) as MultipartFile;
    const { type, id } = request.query as { type: 'host' | 'venue' | 'package'; id: string };

    if (!type || !id) {
      return reply.status(400).send({ error: 'Missing type or id' });
    }

    const key = `${type}/${id}/${Date.now()}_${data.filename}`;
    const url = await fastify.s3.uploadFile(process.env.S3_BUCKET!, data.file, key, data.mimetype);

    return { url, key };
  });

  // Get signed URL for a file
  fastify.get('/file', { preValidation: fastify.auth }, async (request, reply) => {
    const { type, id, filename } = request.query as {
      type: 'host' | 'venue' | 'package';
      id: string;
      filename: string;
    };

    if (!type || !id || !filename) {
      return reply.status(400).send({ error: 'Missing type, id or filename' });
    }

    const key = `${type}/${id}/${filename}`;
    const { S3_BUCKET } = process.env;

    // Ottieni la signed URL
    const url = await fastify.s3.getSignedUrl(S3_BUCKET!, key);
    return { url };
  });

  // Delete a file
  fastify.delete('/file', { preValidation: fastify.auth }, async (request, reply) => {
    const { type, id, filename } = request.query as {
      type: 'host' | 'venue' | 'package';
      id: string;
      filename: string;
    };

    if (!type || !id || !filename) {
      return reply.status(400).send({ error: 'Missing type, id or filename' });
    }

    const key = `${type}/${id}/${filename}`;
    const { S3_BUCKET } = process.env;

    // Cancella il file da S3
    await fastify.s3.deleteFile(S3_BUCKET!, key);

    return { success: true };
  });
}
