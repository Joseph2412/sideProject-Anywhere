import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import { WeekDay } from '@repo/database';

export const getVenueOpeningDaysHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user.id;

    const venue = await prisma.coworkingVenue.findFirst({
      where: { hostProfile: { userId } },
      include: { openingDays: true },
    });

    if (!venue) {
      return reply.code(404).send({ message: 'Venue non trovato' });
    }

    // Dati già nel formato perfetto!
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
  console.log('=== UPDATE VENUE OPENING DAYS ===');
  console.log('Request body:', JSON.stringify(request.body, null, 2));

  const { openingDays } = request.body as {
    openingDays: { day: string; isClosed: boolean; periods: string[] }[];
  };

  console.log('Extracted openingDays:', JSON.stringify(openingDays, null, 2));

  try {
    const userId = request.user.id;
    console.log('User ID:', userId);

    const venue = await prisma.coworkingVenue.findFirst({
      where: { hostProfile: { userId } },
    });

    console.log('Found venue:', venue?.id);

    if (!venue) {
      console.log('No venue found for user:', userId);
      return reply.code(404).send({ message: 'Venue non trovato' });
    }

    // Validazione e pulizia
    const validatedOpeningDays = openingDays.map(dayData => {
      console.log(
        `Processing day: ${dayData.day}, isClosed: ${dayData.isClosed}, periods:`,
        dayData.periods
      );

      const result = {
        day: dayData.day,
        isClosed: Boolean(dayData.isClosed), // Assicura boolean
        periods: dayData.periods.filter(period => {
          const isValid = /^([01]?\d|2[0-3]):([0-5]\d)-([01]?\d|2[0-3]):([0-5]\d)$/.test(period);
          console.log(`Period ${period} is valid: ${isValid}`);
          return isValid;
        }), // 🎯 SALVA sempre i periodi, indipendentemente da isClosed
      };

      console.log(`Validated result for ${dayData.day}:`, result);
      return result;
    });

    console.log('All validated opening days:', JSON.stringify(validatedOpeningDays, null, 2));

    // Salvataggio ultra-semplice
    console.log('Starting database transaction...');
    await prisma.$transaction(
      validatedOpeningDays.map(dayData => {
        console.log(`Creating upsert for day: ${dayData.day}`);
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

    console.log('Database transaction completed successfully');
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
