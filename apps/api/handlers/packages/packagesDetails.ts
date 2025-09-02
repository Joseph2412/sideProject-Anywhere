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
  const { name, type, venueId } = request.body as {
    name: string;
    type: 'SALA' | 'DESK';
    venueId: number;
  };

  // Crea il pacchetto
  const newPackage = await prisma.package.create({
    data: {
      name,
      type,
      venueId,
    },
  });

  // Crea subito tutti i piani di abbonamento associati (uno per rate)
  const rates = [
    { name: 'Orario', rate: PlansRate.HOURLY },
    { name: 'Giornaliero', rate: PlansRate.DAILY },
    { name: 'Settimanale', rate: PlansRate.WEEKLY },
    { name: 'Mensile', rate: PlansRate.MONTHLY },
    { name: 'Annuale', rate: PlansRate.YEARLY },
  ];
  await Promise.all(
    rates.map(r =>
      prisma.packagePlan.create({
        data: {
          name: r.name,
          rate: r.rate,
          price: 0,
          isEnabled: false,
          packageId: newPackage.id,
        },
      })
    )
  );

  // Ritorna il pacchetto con i piani
  const plans = await prisma.packagePlan.findMany({
    where: { packageId: newPackage.id },
    orderBy: { id: 'asc' },
  });
  return reply.status(201).send({ ...newPackage, plans });
};

export const getPackagesDetailsHandler: (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<any> = async (request: FastifyRequest, reply: FastifyReply) => {
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

export const updatePackagesDetailsHandler: (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<any> = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const {
    name,
    description,
    capacity,
    seats,
    services,
    squareMetres,
    type,
    isActive,
    plans = [],
  } = request.body as {
    name: string;
    description: string;
    capacity: number;
    seats: number;
    services: string[];
    squareMetres: number;
    type: 'SALA' | 'DESK';
    isActive: boolean;
    plans?: any[];
  };

  try {
    const updatedPackage = await prisma.package.update({
      where: { id: Number(id) },
      data: { name, description, capacity, seats, services, squareMetres, type, isActive },
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

export const deletePackagesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    await prisma.package.delete({
      where: { id: Number(id) },
    });
    return reply.status(204).send({ message: 'Pacchetto eliminato con successo' });
  } catch (error) {
    return reply.status(404).send({ message: 'Package not found' });
  }
};
