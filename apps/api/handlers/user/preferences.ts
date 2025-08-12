import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getPreferencesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;

  const profile = await prisma.hostProfile.findUnique({
    where: { userId },
    select: { preferences: true },
  });

  reply.send({ preferences: profile?.preferences ?? null });
};

export const updatePreferencesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  const preferences = request.body as Record<string, any>;

  const updated = await prisma.hostProfile.update({
    where: { userId },
    data: { preferences },
  });

  reply.send({ success: true, preferences: updated.preferences });
};
