import { FastifyRequest, FastifyReply } from "fastify";
import { RestorePasswordPayload } from "@repo/types/src/auth/auth";
import bcrypt from "bcrypt";
import { prisma } from "../../libs/prisma";

export const restorePasswordHandler = async (
  request: FastifyRequest<{ Body: RestorePasswordPayload }>,
  reply: FastifyReply,
) => {
  const { token, newPassword } = request.body;

  try {
    const expiryDate = new Date();
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return reply.code(400).send({ error: "Token non Pervenuto" });
    } else if (!user.resetTokenExpiry || user.resetTokenExpiry < expiryDate) {
      return reply.code(400).send({ error: "Token Scaduto" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); //cripti la nuova password. Always 10 caratteri

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return reply
      .code(200)
      .send({ message: "Password Aggiornata con Successo" });
  } catch (error) {
    return reply.code(500).send({ message: "Huston, we have a problem" });
  }
};
