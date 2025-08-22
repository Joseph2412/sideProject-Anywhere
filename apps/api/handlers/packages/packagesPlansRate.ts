import { PlansRate } from '@repo/database';
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from './../../libs/prisma';

export const getPackagesPlansRateHandler: (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<unknown> = async (request, reply) => {
  const { id } = request.params as { id: string };

  const packagePlans = await prisma.packagePlan.findUnique({
    where: { id: Number(id) },
  });

  if (!packagePlans) {
    return reply.status(404).send({ message: 'Package not found' });
  }

  return packagePlans;
};

export const updatePackagesPlansRateHandler: (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<unknown> = async (request, reply) => {
  const { packageId } = request.params as { packageId: string };
  const numericPackageId = Number(packageId);

  if (isNaN(numericPackageId)) {
    return reply.status(400).send({ message: 'Invalid packageId' });
  }

  const plans = request.body as Array<{
    id?: number;
    name: string;
    rate: PlansRate;
    price: number;
    isEnabled: boolean;
  }>;

  if (!Array.isArray(plans)) {
    return reply.status(400).send({ message: 'Body must be an array' });
  }

  // Validazione base
  const allowedRates = ['hourly', 'daily', 'weekly', 'monthly', 'yearly'];

  for (const plan of plans) {
    if (
      typeof plan.name !== 'string' ||
      typeof plan.rate !== 'string' ||
      !allowedRates.includes(plan.rate.toLowerCase()) ||
      typeof plan.price !== 'number' ||
      typeof plan.isEnabled !== 'boolean'
    ) {
      return reply.status(400).send({ message: 'Missing or invalid fields in one or more plans' });
    }
  }

  // Mappa valori frontend -> enum Prisma
  const rateMap: Record<string, PlansRate> = {
    hourly: 'HOURLY',
    daily: 'DAILY',
    weekly: 'WEEKLY',
    monthly: 'MONTHLY',
    yearly: 'YEARLY',
  };

  console.log('BODY:', JSON.stringify(plans, null, 2));

  // Upsert per ogni piano
  const results = await Promise.all(
    plans.map(async plan => {
      // Trova se esiste già un piano con questa chiave unica
      const existing = await prisma.packagePlan.findUnique({
        where: {
          packageId_name_rate: {
            packageId: numericPackageId,
            name: plan.name,
            rate: rateMap[plan.rate.toLowerCase()],
          },
        },
      });

      if (existing) {
        // Fai update
        return prisma.packagePlan.update({
          where: { id: existing.id },
          data: {
            name: plan.name,
            rate: rateMap[plan.rate.toLowerCase()],
            price: plan.price,
            isEnabled: plan.isEnabled,
          },
        });
      } else {
        // Fai create
        return prisma.packagePlan.create({
          data: {
            name: plan.name,
            rate: rateMap[plan.rate.toLowerCase()],
            price: plan.price,
            isEnabled: plan.isEnabled,
            packageId: numericPackageId,
          },
        });
      }
    })
  );

  return results;
};
