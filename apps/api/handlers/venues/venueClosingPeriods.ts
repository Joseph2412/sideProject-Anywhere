import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

export const getVenueClosingPeriodsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user.id;

    const venue = await prisma.coworkingVenue.findFirst({
      where: { hostProfile: { userId } },
      include: { closingPeriods: true },
    });

    if (!venue) {
      return reply.code(404).send({ message: 'Venue non trovato' });
    }

    const closingPeriods = venue.closingPeriods.map(period => ({
      isClosed: period.isClosed, // Boolean diretto
      start: period.start, // DateTime di Inizio
      end: period.end, // DateTime di Fine
    }));

    return reply.code(200).send({ closingPeriods });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const updateVenueClosingPeriodsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log('=== UPDATE VENUE OPENING DAYS ===');
  console.log('Request body:', JSON.stringify(request.body, null, 2));

  const { closingPeriods } = request.body as {
    closingPeriods: { start: string; end: string; isClosed: boolean }[];
  };

  console.log('Extracted closingPeriods:', JSON.stringify(closingPeriods, null, 2));

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

    // Salvataggio ultra-semplice
    console.log('Starting database transaction...');
    await prisma.$transaction(
      closingPeriods.map(periodData => {
        console.log(`Creating upsert for period: ${periodData.start} - ${periodData.end}`);
        return prisma.closingPeriod.upsert({
          where: {
            venueId_start_end: {
              venueId: venue.id,
              start: periodData.start,
              end: periodData.end,
            },
          },
          update: {
            isClosed: periodData.isClosed, // Boolean diretto
          },
          create: {
            venueId: venue.id,
            start: periodData.start,
            end: periodData.end,
            isClosed: periodData.isClosed,
          },
        });
      })
    );
    console.log('Database transaction completed successfully');
    return reply.code(200).send({
      message: 'Periodi di Chiusura aggiornati con successo.',
      success: true,
    });
  } catch (error) {
    console.error('Error in updateVenueClosingPeriodsHandler:', error);
    return reply.code(500).send({
      message: "Errore durante l'aggiornamento dei periodi di Chiusura.",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
