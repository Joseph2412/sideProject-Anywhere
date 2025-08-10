import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const venue = await prisma.coworkingVenue.findFirst({
    orderBy: { id: 'asc' },
    take: 1,
    //Fix Temporaneo: In vista di una possibile 1-To-Many.
    //Al momento: 1 UserProfile -> 1 CoworkingVenue. In futuro potrebbe essere necessario gestire più CoworkingVenue per UserProfile. Quindi predispodi ordinare ogni scelta per id.
    //Se si implementa 1-To-Many, filtrare con ownerId o coworkingVenueId dal UserProfile.
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
    return reply.code(404).send({ message: 'Venue not found' });
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

  // Trova il primo record
  const firstVenue = await prisma.coworkingVenue.findFirst({
    orderBy: { id: 'asc' },
    take: 1,
  });

  if (!firstVenue) {
    // Se non esiste, crea un nuovo record
    //Fix Temporaneo ma che potrebbe essere necessario rimuovere in futuro
    //Se implementiamo più CoworkingVenue per UserProfile, sarà necessario gestire la creazione in modo diverso
    const newVenue = await prisma.coworkingVenue.create({
      data: { name, address, description, services, avatarURL },
    });
    return reply.code(201).send({ venue: newVenue });
  }

  // Se esiste, aggiorna il primo record
  const updatedVenue = await prisma.coworkingVenue.update({
    where: { id: firstVenue.id },
    data: { name, address, description, services, avatarURL },
  });

  return reply.code(200).send({ venue: updatedVenue });
};
