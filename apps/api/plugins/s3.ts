import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const FASTIFY_VERSION = '5.5.0';

export class S3Service {
  // private s3: S3;
  private client: S3Client;
  public expirationSignedUrl: number = 3600;

  constructor(private readonly instance: FastifyInstance) {
    // construct s3 client
    this.client = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      endpoint: process.env.S3_ENDPOINT,
    });
  }

  public getSignedUrl = async (bucket: string, key: string) => {
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(this.client, getCommand, { expiresIn: this.expirationSignedUrl });
  };

  public uploadFile = async (bucket: string, file: any, fileName: string, type: string) => {
    console.log('UPLOAD FILE CALLED'); // LOG DI TEST
    try {
      const params = {
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ContentType: type,
      };
      console.log('S3 upload params:', params); // LOG DETTAGLIATO
      //put to s3 bucket
      const putCommand = new PutObjectCommand(params);
      await this.client.send(putCommand);

      // ✅ SICURO: Restituisce solo la chiave S3, non la signed URL
      return fileName;
    } catch (err) {
      console.error('S3 upload error:', err); // LOG ERRORE ORIGINALE
      this.instance.log.error(err);
      throw new Error('Error uploading file to S3');
    }
  };

  public async deleteFile(bucket: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await this.client.send(command);
  }

  public async getObject(bucket: string, key: string) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await this.client.send(command);
  }
}

const plugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  const s3: S3Service = new S3Service(instance);

  instance.decorate('s3', s3);
  instance.addHook('onRequest', (request, _reply, done) => {
    request.s3 = s3;
    done();
  });
};

/**
 * Make s3 plugin accesible to root context with fastify plugin
 */
export const s3Plugin = fastifyPlugin(plugin, { fastify: FASTIFY_VERSION, name: 'env' });
