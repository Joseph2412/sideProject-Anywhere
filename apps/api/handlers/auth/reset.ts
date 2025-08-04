import { FastifyReply, FastifyRequest } from 'fastify';
import crypto from 'crypto';
import { prisma } from '../../libs/prisma';

export const resetPasswordHandler = async (
  request: FastifyRequest<{ Body: { email: string } }>, //Non creo un Payload: Tanto mando solo 1 Dato
  reply: FastifyReply
) => {
  const { email } = request.body;

  //Cerchiamo la mail in db
  const user = await prisma.user.findUnique({ where: { email } });

  //Utente non trovato, rimandiamo errore
  if (!user) {
    return reply.code(500).send({ message: `L'email ${email} Non Esiste` });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 15 * 60 * 1000); //scade in 15 minuti

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expires,
    },
  });

  console.log(`Link Reset: http://localhost3000/reset?token=${token}`);

  return reply.code(200).send({
    message: `Abbiamo Appena Inviato alla mail ${email} un link di Reset: Controlla nella Spam!`,
  });
};
