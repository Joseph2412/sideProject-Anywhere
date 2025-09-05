import { FastifyRequest, FastifyReply } from 'fastify';

import { prisma } from 'libs/prisma';

export const createNewBooking = async (request: FastifyRequest, reply: FastifyReply) => {
  const {
    id,
    start,
    end,
    createdAt,
    costumerId,
    venue,
    venueId,
    package: { id: packageId },
  } = request.body as {
    id: number;
    start: Date;
    end: Date;
    createdAt: Date;
    costumerId: number;
    venue: { id: number };
    venueId: number;
    package: { id: number };
    packageId: number;
  };

  if (
    !id ||
    !start ||
    !end ||
    !venueId ||
    !packageId ||
    !costumerId ||
    !venue ||
    !venue.id ||
    !createdAt
  ) {
    return reply.status(400).send({ error: 'All fields are required' });
  }

  const newBooking = await prisma.booking.create({
    data: {
      id,
      start,
      end,
      createdAt,
      updatedAt: new Date(),
      costumerId,
      venueId,
      packageId,
    },
  });

  return reply.status(201).send(newBooking);
};

export const deleteBooking = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: number };

  if (!id) {
    return reply.status(400).send({ error: 'Booking ID is required' });
  }

  const deletedBooking = await prisma.booking.delete({
    where: { id },
  });

  return reply.status(200).send({ deletedBooking, message: 'Booking deleted successfully' });
};
