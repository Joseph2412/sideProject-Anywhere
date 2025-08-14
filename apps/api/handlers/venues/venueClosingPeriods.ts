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
  console.log('Request body:', JSON.stringify(request.body, null, 2));
  const { closingPeriods } = request.body as {
    closingPeriods: {
      id?: number;
      start: string;
      end: string;
      isClosed: boolean;
    }[];
  };

  try {
    const userId = request.user.id;

    const venue = await prisma.coworkingVenue.findFirst({
      where: { hostProfile: { userId } },
      include: { closingPeriods: true }, // Includi i periodi esistenti
    });

    if (!venue) {
      return reply.code(404).send({ message: 'Venue non trovato' });
    }

    // Recupera i periodi originali dal database
    const originalPeriods = venue.closingPeriods.map(period => ({
      id: period.id,
      start: period.start.toISOString(),
      end: period.end.toISOString(),
      isClosed: period.isClosed,
    }));

    // Determina i periodi da eliminare
    const periodsToDelete = originalPeriods.filter(
      original =>
        !closingPeriods.some(
          updated =>
            (updated.id && updated.id === original.id) ||
            (updated.start === original.start && updated.end === original.end)
        )
    );

    console.log('Original periods (from DB):', originalPeriods);
    console.log('Closing periods (from request):', closingPeriods);
    console.log('Periods to delete:', periodsToDelete);

    // Esegui la transazione per aggiornare e rimuovere i periodi
    await prisma.$transaction([
      // Elimina i periodi non più presenti
      ...periodsToDelete.map(periodData => {
        console.log('Deleting period:', {
          id: periodData.id,
        });

        return prisma.closingPeriod.delete({
          where: {
            id: periodData.id,
          },
        });
      }),
      // Upsert dei periodi attuali
      ...closingPeriods.map(periodData => {
        console.log('Upserting period:', {
          venueId: venue.id,
          start: periodData.start,
          end: periodData.end,
          isClosed: periodData.isClosed,
        });

        return prisma.closingPeriod.upsert({
          where: periodData.id
            ? { id: periodData.id }
            : {
                venueId_start_end: {
                  venueId: venue.id,
                  start: periodData.start,
                  end: periodData.end,
                },
              },
          update: {
            isClosed: periodData.isClosed,
            start: periodData.start,
            end: periodData.end,
          },
          create: {
            venueId: venue.id,
            start: periodData.start,
            end: periodData.end,
            isClosed: periodData.isClosed,
          },
        });
      }),
    ]);

    return reply.code(200).send({
      message: 'Periodi di chiusura aggiornati con successo.',
      success: true,
    });
  } catch (error) {
    console.error('Error in updateVenueClosingPeriodsHandler:', error);
    return reply.code(500).send({
      message: "Errore durante l'aggiornamento dei periodi di chiusura.",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
