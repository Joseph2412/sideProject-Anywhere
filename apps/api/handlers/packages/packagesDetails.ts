import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import { PlansRate } from '@repo/database';

export const getAllPackagesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const packages = await prisma.package.findMany({
      include: { plans: true },
    });
    return reply.send(packages);
  } catch (error) {
    return reply.status(500).send({ message: 'Errore nel recupero dei pacchetti' });
  }
};

// Handler per la creazione di un nuovo pacchetto
export const createPackageHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, type } = request.body as {
    name: string;
    type: 'SALA' | 'DESK';
  };

  const newPackage = await prisma.package.create({
    data: {
      name,
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

  // Recupera anche i piani associati
  const plans = await prisma.packagePlan.findMany({
    where: { packageId: Number(id) },
    orderBy: { id: 'asc' },
  });

  return { ...packageDetails, plans };
};

export const updatePackagesDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const {
    name,
    description,
    capacity,
    seats,
    services,
    squareMetres,
    type,
    plans = [],
  } = request.body as {
    name: string;
    description: string;
    capacity: number;
    seats: number;
    services: string[];
    squareMetres: number;
    type: 'SALA' | 'DESK';
    plans?: any[];
  };

  try {
    const updatedPackage = await prisma.package.update({
      where: { id: Number(id) },
      data: { name, description, capacity, seats, services, squareMetres, type },
    });

    // Ritorna il pacchetto aggiornato con i piani
    const updatedPlans = await prisma.packagePlan.findMany({
      where: { packageId: Number(id) },
      orderBy: { id: 'asc' },
    });
    return { ...updatedPackage, plans: updatedPlans };
  } catch (error) {
    return reply.status(404).send({ message: 'Package not found' });
  }
};
