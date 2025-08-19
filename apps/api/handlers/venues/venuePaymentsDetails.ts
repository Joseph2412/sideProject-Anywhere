import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

interface PaymentDetailPayload {
  companyName: string;
  address: string;
  iban: string;
  bicSwift: string;
  countryCode: string;
  currencyCode: string;
}

export const getVenuePaymentsDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user.id;

    const venue = await prisma.venue.findFirst({
      where: { user: { id: userId } },
      include: { paymentInfo: true },
    });

    if (!venue) {
      return reply.code(404).send({ error: 'Venue not found' });
    }

    // Se non ci sono dati di pagamento, restituisci un oggetto vuoto
    if (!venue.paymentInfo) {
      return reply.code(200).send({});
    }

    // Restituisci i dati direttamente senza wrapper
    const response = venue.paymentInfo;

    return reply.code(200).send(response);
  } catch (error) {
    console.error("Errore dell'handler:", error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

export const updateVenuePaymentsDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user.id;

    const venue = await prisma.venue.findFirst({
      where: { user: { id: userId } },
      include: { paymentInfo: true },
    });

    if (!venue) {
      return reply.code(404).send({ error: 'Venue not found' });
    }

    const { companyName, address, iban, bicSwift, countryCode, currencyCode } =
      request.body as PaymentDetailPayload;

    const paymentInfo = await prisma.paymentInfo.upsert({
      where: { venueId: venue.id },
      create: {
        companyName,
        address,
        iban,
        bicSwift,
        countryCode,
        currencyCode,
        venueId: venue.id,
      },
      update: {
        companyName,
        address,
        iban,
        bicSwift,
        countryCode,
        currencyCode,
      },
    });

    return reply.code(200).send({ paymentInfo });
  } catch (error) {
    console.error("Errore dell'handler:", error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};
