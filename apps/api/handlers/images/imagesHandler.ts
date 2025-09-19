import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from './../../libs/prisma';
import { generateS3Key } from './../../utils/generateS3Key';
import { generateSecureMediaUrl } from './../../utils/secureMediaUtils';

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
    const urls = photos
      .map((s3Key: string) => {
        try {
          return generateSecureMediaUrl(s3Key);
        } catch (error) {
          console.warn(`Could not generate secure URL for ${s3Key}:`, error);
          return null;
        }
      })
      .filter(Boolean);
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

    const { S3_REPORTS_BUCKET } = process.env;

    // ✅ SICURO: uploadFile ora restituisce solo la chiave S3
    await request.s3.uploadFile(S3_REPORTS_BUCKET!, fileBuffer, s3Key, file.mimetype);

    // Gestione salvataggio nel DB basato sul tipo
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
    } else if (typeValue === 'avatar') {
      // Salva la CHIAVE S3 dell'avatar nel campo avatarUrl dell'utente
      await prisma.user.update({
        where: { id: Number(idValue) },
        data: {
          avatarUrl: s3Key, // Salviamo la chiave S3, non l'URL signed
        },
      });
    } else if (typeValue === 'logo') {
      // Salva la CHIAVE S3 del logo nel campo logoURL della venue
      await prisma.venue.update({
        where: { id: Number(idValue) },
        data: {
          logoURL: s3Key, // Salviamo la chiave S3, non l'URL signed
        },
      });
    }

    // ✅ SICURO: Genera URL proxy invece di esporre signed URL
    try {
      const secureUrl = generateSecureMediaUrl(s3Key);
      return reply.send({ url: secureUrl });
    } catch (error) {
      console.warn(`Could not generate secure URL for ${s3Key}:`, error);
      // Fallback: restituisci solo un messaggio di successo senza URL
      return reply.send({
        success: true,
        message: 'File caricato con successo',
        s3Key: s3Key,
      });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const { entity, id, filename, type } = request.query as any;

    const entityValue = entity?.value ?? entity;
    const idValue = id?.value ?? id;
    const filenameValue = filename?.value ?? filename;
    const typeValue = type?.value ?? type;

    if (!idValue || !filenameValue) {
      return reply.status(400).send({ error: 'Missing id or filename' });
    }

    const { S3_REPORTS_BUCKET } = process.env;
    let key: string;

    // Gestisci i diversi tipi di delete
    if (typeValue === 'avatar') {
      // Per avatar: host/{id}/profile/avatar/{timestamp}_{filename}
      key = filenameValue; // Il filename è già la chiave S3 completa

      await request.s3.deleteFile(S3_REPORTS_BUCKET!, key);

      // Pulisci il campo avatarUrl dell'utente
      await prisma.user.update({
        where: { id: Number(idValue) },
        data: {
          avatarUrl: null,
        },
      });
    } else if (typeValue === 'logo') {
      // Per logo: venues/{id}/logo/{timestamp}_{filename}
      key = filenameValue; // Il filename è già la chiave S3 completa

      await request.s3.deleteFile(S3_REPORTS_BUCKET!, key);

      // Pulisci il campo logoURL della venue
      await prisma.venue.update({
        where: { id: Number(idValue) },
        data: {
          logoURL: null,
        },
      });
    } else if (entityValue && (entityValue === 'venues' || entityValue === 'packages')) {
      // Per gallery: venues/{id}/photos/{filename} o packages/{id}/photos/{filename}
      key = `${entityValue}/${idValue}/photos/${filenameValue}`;

      await request.s3.deleteFile(S3_REPORTS_BUCKET!, key);

      // Rimuovi la chiave dal campo photos della venue o package
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
                (
                  await prisma.package.findUnique({ where: { id: Number(idValue) } })
                )?.photos?.filter((k: string) => k !== key) || [],
            },
          },
        });
      }
    } else {
      return reply
        .status(400)
        .send({ error: 'Invalid delete parameters. Must specify type or entity.' });
    }

    return reply.send({ success: true });
  },

  get: async (request: FastifyRequest, reply: FastifyReply) => {
    const { key } = request.query as any;
    if (!key) {
      return reply.status(400).send({ error: 'Missing key' });
    }
    console.log('S3 GET key:', key);

    try {
      // ✅ SICURO: Usa URL proxy invece di signed URL AWS
      const secureUrl = generateSecureMediaUrl(key);
      return reply.send({ url: secureUrl });
    } catch (error) {
      console.warn(`Could not generate secure URL for ${key}:`, error);
      // ✅ SICURO: Non esporre mai signed URL, anche in caso di errore
      return reply.status(400).send({
        error: 'Impossibile generare URL sicuro per questo file',
        s3Key: key,
        message: 'Formato chiave S3 non supportato',
      });
    }
  },
};
