import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const venue = await prisma.coworkingVenue.findFirst({
    where: { userProfileId: request.user.id },
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
  });

  if (!venue) return reply.code(404).send({ venue: null });

  return reply.code(200).send({ venue });
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

  const venue = await prisma.coworkingVenue.upsert({
    where: { userProfileId: request.user.id },
    create: {
      userProfileId: request.user.id,
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
