import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from './../../libs/prisma';

import { generateS3Key } from './../../utils/generateS3Key';

type UploadImageBody = {
  type: 'avatar' | 'logo' | 'gallery';
  id: string | number;
  filename: string;
};

export const imagesHandler = {
  getGallery: async (request: FastifyRequest, reply: FastifyReply) => {
    const { venueId } = request.params as { venueId: string };
    const { S3_REPORTS_BUCKET } = process.env;
    if (!venueId) {
      return reply.status(400).send({ error: 'Missing venueId' });
    }
    const venue = await prisma.venue.findUnique({ where: { id: Number(venueId) } });
    if (!venue) {
      return reply.status(404).send({ error: 'Venue not found' });
    }
    const photos = venue.photos || [];
    const urls = await Promise.all(
      photos.map((key: string) => request.s3.getSignedUrl(S3_REPORTS_BUCKET!, key))
    );
    return reply.send({ urls });
  },
  upload: async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('BODY: ', request.body);
    const { type, id, filename, file } = request.body as Record<string, any>;

    if (!type || !id || !filename || !file) {
      return reply.status(400).send({ error: 'Missing type, id, filename or file' });
    }

    // Estrai i valori reali dai campi multipart
    const typeValue = type.value ?? type;
    const idValue = id.value ?? id;
    const filenameValue = filename.value ?? filename;

    const s3Key = generateS3Key({ type: typeValue, id: idValue, filename: filenameValue });
    const fileBuffer = await file.toBuffer(); // stream
    const signedUrl = await request.s3.uploadFile(
      'nibol-anywhere',
      fileBuffer,
      s3Key,
      file.mimetype
    );

    if (typeValue === 'gallery') {
      await prisma.venue.update({
        where: { id: Number(idValue) },
        data: {
          photos: {
            push: s3Key, // oppure push: signedUrl....Dubbio Amletico. Pugia tu che dici?
          },
        },
      });
    }

    return reply.send({ url: signedUrl });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const { type, id, filename } = request.query as any;

    // Estrai i valori reali se presenti
    const typeValue = type?.value ?? type;
    const idValue = id?.value ?? id;
    const filenameValue = filename?.value ?? filename;

    if (!typeValue || !idValue || !filenameValue) {
      return reply.status(400).send({ error: 'Missing type, id or filename' });
    }

    const key = `${typeValue}/${idValue}/${filenameValue}`;
    const { S3_REPORTS_BUCKET } = process.env;

    // Cancella il file da S3
    await request.s3.deleteFile(S3_REPORTS_BUCKET!, key);

    return { success: true };
  },

  get: async (request: FastifyRequest, reply: FastifyReply) => {
    const { key } = request.query as any;
    if (!key) {
      return reply.status(400).send({ error: 'Missing key' });
    }
    console.log('S3 GET key:', key);
    const { S3_REPORTS_BUCKET } = process.env;
    const url = await request.s3.getSignedUrl(S3_REPORTS_BUCKET!, key);
    return { url };
  },
};
