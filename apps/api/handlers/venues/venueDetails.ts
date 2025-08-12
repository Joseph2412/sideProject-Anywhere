import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  // SICUREZZA: Filtra per utente autenticato
  const userId = request.user.id;

  const venue = await prisma.coworkingVenue.findFirst({
    where: {
      HostProfile: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: { id: 'asc' },
    take: 1,
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      openingHours: true,
      services: true,
      avatarURL: true,
    },
  });

  if (!venue) {
    return reply.code(404).send({ message: 'Venue non trovato o non autorizzato' });
  }

  return reply.code(200).send({ venue });
};

export const updateVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, address, description, services, avatarURL } = request.body as {
    name: string;
    address: string;
    description: string;
    services?: string[];
    avatarURL?: string;
  };

  // SICUREZZA: Filtra per utente autenticato
  const userId = request.user.id;

  // Trova il primo record dell'utente autenticato
  const firstVenue = await prisma.coworkingVenue.findFirst({
    where: {
      HostProfile: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: { id: 'asc' },
    take: 1,
  });

  // Usa upsert per creare o aggiornare il primo venue
  const venue = await prisma.coworkingVenue.upsert({
    where: { id: firstVenue?.id || 0 }, // Usa l'id del primo venue se esiste, altrimenti 0 (che non esisterà)
    update: { name, address, description, services, avatarURL },
    create: { name, address, description, services, avatarURL },
  });

  return reply.code(200).send({ venue });
};
