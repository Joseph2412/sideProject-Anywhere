import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from 'libs/prisma';

interface BookingRequest extends FastifyRequest {
  booking: { id: number };
  venue: { id: number };
}

export const createReviewsHandler = async (request: BookingRequest, reply: FastifyReply) => {
  const { reviewWifi, reviewStaff, reviewQuiet, reviewComfort, reviewOverall } = request.body as {
    reviewWifi: number;
    reviewStaff: number;
    reviewQuiet: number;
    reviewComfort: number;
    reviewOverall: number;
  };

  if (!reviewComfort || !reviewStaff || !reviewWifi || !reviewQuiet || !reviewOverall) {
    return reply.status(400).send({ error: 'All review fields are required' });
  }

  const review = await prisma.booking.update({
    where: { id: request.booking.id },
    data: {
      reviewWifi,
      reviewStaff,
      reviewQuiet,
      reviewComfort,
    },
  });

  return reply.status(200).send(review);
};

export const getReviewsHandler = async (request: BookingRequest, reply: FastifyReply) => {
  const reviews = await prisma.venue.findMany({
    where: { id: request.venue.id },
    select: {
      venueRatings: true,
      reviewsCounter: true,
    },
  });

  return reply.status(200).send({ reviews, message: 'Reviews fetched successfully' });
};
