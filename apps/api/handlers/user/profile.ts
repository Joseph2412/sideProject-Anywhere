import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import { Prisma } from '@repo/database';

export const profileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const auth = request.user as {
    id: number;
    email: string;
    role: 'USER' | 'HOST';
    name?: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      id: auth.id,
    },
    include: {
      coworkingVenue: true,
    },
  });

  if (!user) {
    return reply.code(404).send({ message: 'Profilo non trovato' });
  }

  return reply.send({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      preferences: user.preferences,
      role: user.role,
      coworkingVenue: user.coworkingVenue ?? null,
    },
  });
};

export const updateProfileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { firstName, lastName, avatarUrl, preferences } = request.body as {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    preferences?: Record<string, unknown>;
  };

  const userId = request.user?.id;

  if (!userId) {
    return reply.code(401).send({ error: 'Non Autorizzato' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        ...(preferences !== undefined && {
          preferences: preferences as Prisma.InputJsonValue,
        }),
      },
    });

    return reply.code(200).send({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    return reply.code(500).send({ error: 'Errore interno del server' });
  }
};
