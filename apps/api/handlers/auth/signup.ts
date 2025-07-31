import { FastifyReply, FastifyRequest } from "fastify";
import { User, Role } from "@repo/database";
import bcrypt from "bcrypt";
import { prisma } from "../../libs/prisma";

export const signupHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password, name, role } = request.body as {
    email: string;
    password: string;
    name: string;
    role: Role;
  };

  try {
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.code(409).send({ error: "Email Alredy Registred" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
    return reply.code(201).send({ userId: newUser.id });
  } catch (error) {
    return reply.code(500).send({ error: "Huston, Abbiamo un Problema" });
  }
};
