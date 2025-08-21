import { PlansRate } from '@repo/database';
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from './../../libs/prisma';

export const getPackagesPlansRateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  const packagePlans = await prisma.packagePlan.findUnique({
    where: { id: Number(id) },
  });

  if (!packagePlans) {
    return reply.status(404).send({ message: 'Package not found' });
  }

  return packagePlans;
};

export const updatePackagesPlansRateHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, rate, price, isEnabled } = request.body as {
    name: string;
    rate: PlansRate;
    price: number;
    isEnabled: boolean;
  };

  const packagePlans = await prisma.packagePlan.findUnique({
    where: { id: Number(id) },
  });

  if (!packagePlans) {
    return reply.status(404).send({ message: 'Package not found' });
  }

  const updatedPackage = await prisma.packagePlan.update({
    where: { id: Number(id) },
    data: { name, rate, price, isEnabled },
  });

  return updatedPackage;
};
