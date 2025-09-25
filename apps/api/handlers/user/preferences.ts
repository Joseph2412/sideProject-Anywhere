import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../libs/prisma";

export const getPreferencesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  reply.send({ preferences: user?.preferences ?? null });
};

export const updatePreferencesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.id;
  const preferences = request.body as Record<string, any>;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { preferences },
  });

  reply.send({ success: true, preferences: updated.preferences });
};
