import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const FASTIFY_VERSION = '5.4.0';

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
    try {
      const params = {
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ContentType: type,
      };
      //put to s3 bucket
      const putCommand = new PutObjectCommand(params);
      await this.client.send(putCommand);

      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: fileName,
      });
      //return signed url
      return await getSignedUrl(this.client, getCommand, {
        signableHeaders: new Set(['content-type']),
        expiresIn: this.expirationSignedUrl,
      });
    } catch (err) {
      this.instance.log.error(err);
    }
  };

  public async deleteFile(bucket: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await this.client.send(command);
  }
}

//
//  * S3 bucket service plugin
//  * @param {FastifyInstance} instance
//  * @param {FastifyPluginOptions} options
//
const plugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  const s3: S3Service = new S3Service(instance);

  instance.decorate('s3', s3);
};

/**
 * Make s3 plugin accesible to root context with fastify plugin
 */
export const s3Plugin = fastifyPlugin(plugin, { fastify: FASTIFY_VERSION, name: 'env' });
