import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface MediaParams {
  venueId: string;
  filename: string;
  packageId?: string;
}

export async function secureMediaRoutes(fastify: FastifyInstance) {
  // Proxy per logo venue
  fastify.get(
    '/venue/:venueId/logo/:filename',
    async (request: FastifyRequest<{ Params: MediaParams }>, reply: FastifyReply) => {
      const { venueId, filename } = request.params;

      try {
        console.log(`🖼️ Serving venue ${venueId} logo: ${filename}`);

        // Costruisci la S3 key seguendo la convenzione esistente
        const s3Key = `venues/${venueId}/logo/${filename}`;

        // Ottieni l'oggetto da S3
        const s3Response = await request.s3.getObject(process.env.S3_REPORTS_BUCKET!, s3Key);

        // Determina il content type dall'estensione
        const contentType = getContentType(filename);

        // Stream dell'immagine direttamente al client
        return reply
          .type(contentType)
          .header('Cache-Control', 'public, max-age=3600') // Cache 1 ora
          .header('ETag', s3Response.ETag || '')
          .send(s3Response.Body);
      } catch (error) {
        console.error(`❌ Error serving venue ${venueId} logo ${filename}:`, error);

        if ((error as any).Code === 'NoSuchKey') {
          return reply.code(404).send({
            error: 'Immagine non trovata',
            resource: `venue/${venueId}/logo/${filename}`,
          });
        }

        return reply.code(500).send({
          error: "Errore nel servire l'immagine",
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Proxy per foto venue
  fastify.get(
    '/venue/:venueId/photos/:filename',
    async (request: FastifyRequest<{ Params: MediaParams }>, reply: FastifyReply) => {
      const { venueId, filename } = request.params;

      try {
        console.log(`📷 Serving venue ${venueId} photo: ${filename}`);

        // Costruisci la S3 key per le foto venue
        const s3Key = `venues/${venueId}/photos/${filename}`;

        // Ottieni l'oggetto da S3
        const s3Response = await request.s3.getObject(process.env.S3_REPORTS_BUCKET!, s3Key);

        // Determina il content type dall'estensione
        const contentType = getContentType(filename);

        // Stream dell'immagine direttamente al client
        return reply
          .type(contentType)
          .header('Cache-Control', 'public, max-age=3600') // Cache 1 ora
          .header('ETag', s3Response.ETag || '')
          .send(s3Response.Body);
      } catch (error) {
        console.error(`❌ Error serving venue ${venueId} photo ${filename}:`, error);

        if ((error as any).Code === 'NoSuchKey') {
          return reply.code(404).send({
            error: 'Foto non trovata',
            resource: `venue/${venueId}/photos/${filename}`,
          });
        }

        return reply.code(500).send({
          error: 'Errore nel servire la foto',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Proxy per foto pacchetti
  fastify.get(
    '/package/:packageId/photos/:filename',
    async (request: FastifyRequest<{ Params: MediaParams }>, reply: FastifyReply) => {
      const { packageId, filename } = request.params;

      try {
        console.log(`📦 Serving package ${packageId} photo: ${filename}`);

        // Costruisci la S3 key per le foto pacchetti
        const s3Key = `packages/${packageId}/photos/${filename}`;

        // Ottieni l'oggetto da S3
        const s3Response = await request.s3.getObject(process.env.S3_REPORTS_BUCKET!, s3Key);

        // Determina il content type dall'estensione
        const contentType = getContentType(filename);

        // Stream dell'immagine direttamente al client
        return reply
          .type(contentType)
          .header('Cache-Control', 'public, max-age=3600') // Cache 1 ora
          .header('ETag', s3Response.ETag || '')
          .send(s3Response.Body);
      } catch (error) {
        console.error(`❌ Error serving package ${packageId} photo ${filename}:`, error);

        if ((error as any).Code === 'NoSuchKey') {
          return reply.code(404).send({
            error: 'Foto pacchetto non trovata',
            resource: `package/${packageId}/photos/${filename}`,
          });
        }

        return reply.code(500).send({
          error: 'Errore nel servire la foto del pacchetto',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Endpoint di health check per il proxy media
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'healthy',
      service: 'secure-media-proxy',
      timestamp: new Date().toISOString(),
    });
  });
}

// Utility per determinare il content type dall'estensione del file
function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'bmp':
      return 'image/bmp';
    case 'tiff':
    case 'tif':
      return 'image/tiff';
    default:
      return 'image/jpeg'; // Default fallback
  }
}
