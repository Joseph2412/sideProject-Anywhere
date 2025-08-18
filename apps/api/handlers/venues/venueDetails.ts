import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../libs/prisma";

export const getVenueDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const prof = await prisma.hostProfile.findUnique({
    where: { userId: request.user.id },
    select: { id: true },
  });
  if (!prof) {
    return reply
      .code(404)
      .send({ message: "HostProfile not found for current user" });
  }

  const venue = await prisma.coworkingVenue.findUnique({
    where: { hostProfileId: prof.id },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      services: true,
      photos: true,
      avatarURL: true,
      openingDays: {
        orderBy: [{ day: "asc" }],
        select: {
          id: true,
          day: true,
          isClosed: true,
          periods: true, //
        },
      },
    },
  });

  if (!venue) return reply.code(404).send({ venue: null });

  return reply.code(200).send({ venue });
};

export const updateVenueDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { name, address, description, services, avatarURL, photos } =
    request.body as {
      name: string;
      address: string;
      description?: string | null;
      services?: string[];
      avatarURL?: string | null;
      photos?: string[];
    };

  if (!name || !address) {
    return reply.code(400).send({ message: "name and address are required" });
  }

  // Lookup profilo host dal token
  const prof = await prisma.hostProfile.findUnique({
    where: { userId: request.user.id },
    select: { id: true },
  });
  if (!prof) {
    return reply
      .code(404)
      .send({ message: "HostProfile not found for current user" });
  }

  const venue = await prisma.coworkingVenue.upsert({
    where: { hostProfileId: prof.id },
    create: {
      hostProfileId: prof.id,
      name,
      address,
      description: description ?? null,
      services: services ?? [],
      photos: photos ?? [],
      avatarURL: avatarURL ?? null,
    },
    update: {
      name,
      address,
      description: description ?? null,
      services: services ?? [],
      photos: photos ?? [],
      avatarURL: avatarURL ?? null,
    },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      services: true,
      photos: true,
      avatarURL: true,
    },
  });

  return reply.code(200).send({ venue });
};
