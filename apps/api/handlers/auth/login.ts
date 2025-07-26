import { FastifyRequest, FastifyReply } from "fastify";
import { User, PrismaClient } from "@repo/database";
import bcrypt from "bcrypt";
import { UserLogin } from "@repo/types/src/user/user";

const Prisma = new PrismaClient();

export const loginHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = request.body as UserLogin;

  try {
    const user: User | null = await Prisma.user.findUnique({
      where: { email },
    });

    //Blocco Errori se !user e !passWord Sbagliata
    if (!user) {
      return reply.code(401).send({ error: "Email non corretta" });
    }
    const passwordFound: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordFound) {
      return reply.code(401).send({ error: "PassoWord Errata" });
    }

    //Login Corretto. Ritorno l'utente con le specifiche
    return reply.send({
      message: "Login Effettuato con Successo",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Huston, Abbiamo un Problema" });
  }
};
