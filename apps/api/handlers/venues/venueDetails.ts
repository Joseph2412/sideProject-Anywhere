import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  // Recupera l'utente e la venue in un'unica query
  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    select: {
      venue: {
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          services: true,
          photos: true,
          logoURL: true,
          openingDays: {
            orderBy: [{ day: 'asc' }],
            select: {
              id: true,
              day: true,
              isClosed: true,
              periods: true,
            },
          },
        },
      },
    },
  });

  if (!user?.venue) return reply.code(404).send({ venue: null });

  // Genera URL signed per il logo se esiste
  const venue = user.venue;
  let logoURL = null;
  if (venue.logoURL) {
    const { S3_REPORTS_BUCKET } = process.env;
    logoURL = await request.s3.getSignedUrl(S3_REPORTS_BUCKET!, venue.logoURL);
  }

  return reply.code(200).send({
    venue: {
      ...venue,
      logoURL,
    },
  });
};

export const updateVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, address, description, services, logoURL, photos } = request.body as {
    name: string;
    address: string;
    description?: string | null;
    services?: string[];
    logoURL?: string | null;
    photos?: string[];
  };

  if (!name || !address) {
    return reply.code(400).send({ message: 'name and address are required' });
  }

  // Recupera venueId dell'utente in una sola query
  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    select: { venueId: true },
  });

  const venue = await prisma.venue.upsert({
    where: { id: user?.venueId ?? 0 },
    create: {
      user: { connect: { id: request.user.id } },
      name,
      address,
      description: description ?? null,
      services: services ?? [],
      photos: photos ?? [],
      logoURL: logoURL ?? null,
    },
    update: {
      name,
      address,
      description: description ?? null,
      services: services ?? [],
      photos: photos ?? [],
      logoURL: logoURL ?? null,
    },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      services: true,
      photos: true,
      logoURL: true,
    },
  });

  return reply.code(200).send({ venue });
};
