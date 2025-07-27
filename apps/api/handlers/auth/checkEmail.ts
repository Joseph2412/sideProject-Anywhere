import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@repo/database";

const prisma = new PrismaClient();

type CheckEmailRequest = {
  email: string;
};

export const checkEmailHandler = async (
  request: FastifyRequest<{ Body: CheckEmailRequest }>,
  reply: FastifyReply,
) => {
  const { email } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return reply.send({ exists: !!user });
  } catch (error) {
    console.error("Errore in checkEmail:", error);
    return reply.code(500).send({ error: "Errore interno del server" });
  }
};
