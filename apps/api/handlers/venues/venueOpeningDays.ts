import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import { WeekDay } from '@repo/database';

export const getVenueOpeningDaysHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  console.log('GET /venues/opening-days chiamato');
  try {
    // SICUREZZA: Filtra per utente autenticato
    const userId = request.user.id;

    const venue = await prisma.coworkingVenue.findFirst({
      where: {
        hostProfile: {
          userId: userId,
        },
      },
      select: {
        id: true,
        openingDays: {
          include: {
            periods: true,
          },
        },
      },
    });

    if (!venue) {
      return reply.code(404).send({ message: 'Venue non trovato o non autorizzato' });
    }

    return reply.code(200).send({ openingDays: venue.openingDays });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const updateVenueOpeningDaysHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log('Dati ricevuti dal front-end:', request.body);

  const { openingDays } = request.body as {
    openingDays: {
      day: string;
      isClosed: boolean;
      periods: {
        id?: number;
        start: string;
        end: string;
      }[];
    }[];
  };

  try {
    const userId = request.user.id;

    const firstVenue = await prisma.coworkingVenue.findFirst({
      where: {
        hostProfile: {
          userId: userId,
        },
      },
      orderBy: { id: 'asc' },
      take: 1,
    });

    if (!firstVenue) {
      return reply.code(404).send({ message: 'Venue non trovato o non autorizzato' });
    }

    for (const day of openingDays) {
      const { day, isClosed, periods } = day;

      await prisma.openDays.upsert({
        where: { venueId_day: { venueId: firstVenue.id, day: day as WeekDay } },
        update: {
          isClosed,
          periods: {
            upsert: periods.map(period => ({
              where: { id: period.id || 0 }, // Usa l'ID se esiste, altrimenti un valore inesistente
              update: {
                start: period.start,
                end: period.end,
              },
              create: {
                start: period.start,
                end: period.end,
              },
            })),
          },
        },
        create: {
          venueId: firstVenue.id,
          day: day as WeekDay,
          isClosed,
          periods: {
            create: periods.map(period => ({
              start: period.start,
              end: period.end,
            })),
          },
        },
      });
    }
    return reply.code(200).send({ message: 'Orari di apertura aggiornati con successo.' });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      error: 'Validation Failed',
      details: error,
      where: (error as any)?.validationContext ?? 'body', //Puoi eliminarli volendo
      message: "Errore durante l'aggiornamento degli orari di apertura.",
    });
  }
};
