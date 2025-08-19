import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import { WeekDay } from '@repo/database';

export const getVenueOpeningDaysHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user.id;

    const venue = await prisma.venue.findFirst({
      where: { user: { id: userId } },
      include: { openingDays: true },
    });

    if (!venue) {
      return reply.code(404).send({ message: 'Venue non trovato' });
    }

    const openingDays = venue.openingDays.map(day => ({
      day: day.day,
      isClosed: day.isClosed, // Boolean diretto
      periods: day.periods, // Array stringhe diretto
    }));

    return reply.code(200).send({ openingDays });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const updateVenueOpeningDaysHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { openingDays } = request.body as {
    openingDays: { day: string; isClosed: boolean; periods: string[] }[];
  };

  try {
    const userId = request.user.id;

    const venue = await prisma.venue.findFirst({
      where: { user: { id: userId } },
    });

    if (!venue) {
      return reply.code(404).send({ message: 'Venue non trovato' });
    }

    // Validazione e pulizia
    const validatedOpeningDays = openingDays.map(dayData => {
      const result = {
        day: dayData.day,
        isClosed: Boolean(dayData.isClosed), // Assicura boolean
        periods: dayData.periods.filter(period => {
          const isValid = /^([01]?\d|2[0-3]):([0-5]\d)-([01]?\d|2[0-3]):([0-5]\d)$/.test(period);
          return isValid;
        }), //  SALVA sempre i periodi, indipendentemente da isClosed
      };

      return result;
    });

    // Salvataggio ultra-semplice
    await prisma.$transaction(
      validatedOpeningDays.map(dayData => {
        return prisma.openDays.upsert({
          where: {
            venueId_day: {
              venueId: venue.id,
              day: dayData.day as WeekDay,
            },
          },
          update: {
            isClosed: dayData.isClosed, // Boolean diretto
            periods: dayData.periods, // Array stringhe diretto
          },
          create: {
            venueId: venue.id,
            day: dayData.day as WeekDay,
            isClosed: dayData.isClosed, // Boolean diretto
            periods: dayData.periods, // Array stringhe diretto
          },
        });
      })
    );

    return reply.code(200).send({
      message: 'Orari di apertura aggiornati con successo.',
      success: true,
    });
  } catch (error) {
    console.error('Error in updateVenueOpeningDaysHandler:', error);
    return reply.code(500).send({
      message: "Errore durante l'aggiornamento degli orari di apertura.",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
