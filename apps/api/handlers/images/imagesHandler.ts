import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from './../../libs/prisma';

import { generateS3Key } from './../../utils/generateS3Key';

export const imagesHandler = {
  getGallery: async (request: FastifyRequest, reply: FastifyReply) => {
    const { entity, id } = request.params as { entity: string; id: string };
    const { S3_REPORTS_BUCKET } = process.env;
    if (!entity || !id) {
      return reply.status(400).send({ error: 'Missing entity or id' });
    }
    let record: any = null;
    if (entity === 'venues') {
      record = await prisma.venue.findUnique({ where: { id: Number(id) } });
      if (!record) return reply.status(404).send({ error: 'Venue not found' });
    } else if (entity === 'packages') {
      record = await prisma.package.findUnique({ where: { id: Number(id) } });
      if (!record) return reply.status(404).send({ error: 'Package not found' });
    } else {
      return reply.status(400).send({ error: 'Invalid entity' });
    }
    const photos = record.photos || [];
    const urls = await Promise.all(
      photos.map((key: string) => request.s3.getSignedUrl(S3_REPORTS_BUCKET!, key))
    );
    return reply.send({ urls });
  },

  upload: async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('BODY: ', request.body);
    const { type, id, filename, file, entity } = request.body as Record<string, any>;

    if (!type || !id || !filename || !file || !entity) {
      return reply.status(400).send({ error: 'Missing type, id, filename, entity or file' });
    }

    // Estrai i valori reali dai campi multipart
    const typeValue = type.value ?? type;
    const idValue = id.value ?? id;
    const filenameValue = filename.value ?? filename;
    const entityValue = entity.value ?? entity;

    const s3Key = generateS3Key({
      type: typeValue,
      id: idValue,
      filename: filenameValue,
      entity: entityValue === 'packages' ? 'package' : 'venue',
    });

    const fileBuffer = await file.toBuffer();

    const signedUrl = await request.s3.uploadFile(
      'nibol-anywhere',
      fileBuffer,
      s3Key,
      file.mimetype
    );

    if (typeValue === 'gallery') {
      if (entityValue === 'venues') {
        await prisma.venue.update({
          where: { id: Number(idValue) },
          data: {
            photos: {
              push: s3Key,
            },
          },
        });
      } else if (entityValue === 'packages') {
        await prisma.package.update({
          where: { id: Number(idValue) },
          data: {
            photos: {
              push: s3Key,
            },
          },
        });
      }
    }

    return reply.send({ url: signedUrl });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const { entity, id, filename } = request.query as any;

    const entityValue = entity?.value ?? entity;
    const idValue = id?.value ?? id;
    const filenameValue = filename?.value ?? filename;

    if (!entityValue || !idValue || !filenameValue) {
      return reply.status(400).send({ error: 'Missing entity, id or filename' });
    }

    // Costruisci la chiave S3 secondo la struttura reale
    const key = `${entityValue}/${idValue}/photos/${filenameValue}`;
    const { S3_REPORTS_BUCKET } = process.env;

    await request.s3.deleteFile(S3_REPORTS_BUCKET!, key);
    // Rimuovi la chiave dal campo photos della venue se entity è venues
    //è un fix temporaneo. Dobbiamo fare la stessa cosa anche per Packages

    if (entityValue === 'venues') {
      await prisma.venue.update({
        where: { id: Number(idValue) },
        data: {
          photos: {
            set:
              (await prisma.venue.findUnique({ where: { id: Number(idValue) } }))?.photos?.filter(
                (k: string) => k !== key
              ) || [],
          },
        },
      });
    } else if (entityValue === 'packages') {
      await prisma.package.update({
        where: { id: Number(idValue) },
        data: {
          photos: {
            set:
              (await prisma.package.findUnique({ where: { id: Number(idValue) } }))?.photos?.filter(
                (k: string) => k !== key
              ) || [],
          },
        },
      });
    }

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
