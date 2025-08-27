import { FastifyReply, FastifyRequest } from 'fastify';

import { generateS3Key } from './../../utils/generateS3Key';
import { MultipartFile } from '@fastify/multipart';

type UploadImageBody = {
  type: 'host' | 'venue' | 'package';
  id: string | number;
  filename: string;
  photoType: 'avatar' | 'logo' | 'gallery';
};

export const imagesHandler = {
  upload: async (request: FastifyRequest, reply: FastifyReply) => {
    const { type, id, filename, photoType } = request.body as UploadImageBody;

    //Estrazione file da tipop di richeista
    let file: MultipartFile | undefined;

    switch (true) {
      case typeof request.file === 'object':
        file = request.file;
        break;

      case typeof request.files === 'function':
        for await (const part of request.parts()) {
          if (part.type === 'file') {
            file = part;
            break;
          }
        }
        break;
      default:
        reply.status(400).send({ error: 'Invalid file upload' });
    }
    if (!file) {
      return reply.status(400).send({ error: 'File is required' });
    }

    const s3Key = generateS3Key({
      type,
      id,
      filename,
    });

    // Upload file to S3
    const signedUrl = await request.s3.uploadFile('your-bucket-name', file, s3Key, file.mimetype);

    return reply.send({ url: signedUrl });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
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
    await request.s3.deleteFile(S3_BUCKET!, key);

    return { success: true };
  },

  get: async (request: FastifyRequest, reply: FastifyReply) => {
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
    const url = await request.s3.getSignedUrl(S3_BUCKET!, key);
    return { url };
  },
};
