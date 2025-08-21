import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getAllPackagesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const packages = await prisma.package.findMany();
    return reply.send(packages);
  } catch (error) {
    return reply.status(500).send({ message: 'Errore nel recupero dei pacchetti' });
  }
};
// Handler per la creazione di un nuovo pacchetto
export const createPackageHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, description, capacity, seats, services, squareMetres, type } = request.body as {
    name: string;
    description: string;
    capacity: number;
    seats: number;
    services: string[];
    squareMetres: number;
    type: 'SALA' | 'DESK';
  };

  const newPackage = await prisma.package.create({
    data: {
      name,
      description,
      capacity,
      seats,
      services,
      squareMetres,
      type,
    },
  });

  return reply.status(201).send(newPackage);
};

export const getPackagesDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  const packageDetails = await prisma.package.findUnique({
    where: { id: Number(id) },
  });

  if (!packageDetails) {
    return reply.status(404).send({ message: 'Package not found' });
  }

  return packageDetails;
};

export const updatePackagesDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, description, capacity, seats, services, squareMetres, type } = request.body as {
    name: string;
    description: string;
    capacity: number;
    seats: number;
    services: string[];
    squareMetres: number;
    type: 'SALA' | 'DESK';
  };

  try {
    const updatedPackage = await prisma.package.update({
      where: { id: Number(id) },
      data: { name, description, capacity, seats, services, squareMetres, type },
    });
    return updatedPackage;
  } catch (error) {
    return reply.status(404).send({ message: 'Package not found' });
  }
};
