import { FastifyReply, FastifyRequest } from 'fastify';
import { User, Role } from '@repo/database';
import bcrypt from 'bcrypt';
import { prisma } from '../../libs/prisma';

export const signupHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password, firstName, lastName, role } = request.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
  };

  try {
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.code(409).send({ error: 'Email Alredy Registred' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        venue: {
          create: {
            name: ' ',
            address: ' ',
            description: ' ',
            services: [],
            photos: [],
            logoURL: ' ',
          },
        },
      },
    });
    return reply.code(201).send({ userId: newUser.id });
  } catch (error) {
    return reply.code(500).send({ error: 'Huston, Abbiamo un Problema' });
  }
};
