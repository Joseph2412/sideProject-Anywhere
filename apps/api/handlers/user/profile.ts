import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

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
      profile: true,
    },
  });

  if (!user || !user.profile) {
    return reply.code(404).send({ message: 'Profilo non trovato' });
  }

  return reply.send({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? 'Utente',
    },
    profile: {
      //Ritorniamo due cose: L'utente per autenticazione, l'userProfile per form e Componente User
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      avatarUrl: user.profile.avatarUrl,
      preferences: user.profile.preferences,
    },
  });
};

export const updateProfileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { firstName, lastName } = request.body as {
    firstName: string;
    lastName: string;
  };

  const userId = request.user?.id;

  if (!userId) {
    return reply.code(401).send({ error: 'Non Autorizzato' });
  }

  try {
    // 1. Recupero il profilo associato all'utente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profile: { select: { id: true } } },
    });

    if (!user?.profile?.id) {
      return reply.code(404).send({ error: 'Profilo utente non trovato' });
    }

    // 2. Eseguo l'update
    const updatedProfile = await prisma.userProfile.update({
      where: { id: user.profile.id },
      data: { firstName, lastName },
    });

    return reply.code(200).send({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    return reply.code(500).send({ error: 'Errore interno del server' });
  }
};
