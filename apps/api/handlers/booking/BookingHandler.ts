import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';

interface ExternalBookingBody {
  venueId: number;
  packageId: number;
  start: string;
  end: string;
  people: number;
  userId: number; // Sempre presente per utenti registrati
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

// Handler unificato per prenotazioni esterne (da altra app)
export const createNewBooking = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { venueId, packageId, start, end, people, userId, customerInfo } =
      request.body as ExternalBookingBody;

    // Validazione input
    if (!venueId || !packageId || !start || !end || !people || !userId || !customerInfo) {
      return reply.code(400).send({ error: 'Tutti i campi sono obbligatori' });
    }

    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      return reply.code(400).send({ error: 'Informazioni cliente incomplete' });
    }

    // Verifica che l'utente esista (userId dall'altra app)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return reply.code(404).send({ error: 'Utente non trovato' });
    }

    // Verifica esistenza venue e package
    const venue = await prisma.venue.findFirst({
      where: {
        id: venueId,
        packages: {
          some: {
            id: packageId,
            isActive: true,
            plans: {
              some: { isEnabled: true },
            },
          },
        },
      },
      include: {
        packages: {
          where: { id: packageId, isActive: true },
          include: {
            plans: {
              where: { isEnabled: true },
              orderBy: { price: 'asc' },
            },
          },
        },
      },
    });

    if (!venue || !venue.packages.length) {
      return reply.code(404).send({ error: 'Venue o package non trovato' });
    }

    const selectedPackage = venue.packages[0];

    // Controlla capacità
    if (selectedPackage.capacity && people > selectedPackage.capacity) {
      return reply.code(400).send({
        error: `Capacità massima superata. Massimo: ${selectedPackage.capacity} persone`,
      });
    }

    // Controlla disponibilità temporale
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      return reply.code(400).send({
        error: 'Data di fine deve essere successiva a quella di inizio',
      });
    }

    if (startDate < new Date()) {
      return reply.code(400).send({ error: 'Non è possibile prenotare nel passato' });
    }

    const conflictingBookings = await prisma.booking.count({
      where: {
        packageId,
        status: { in: ['reserved', 'PENDING', 'CONFIRMED'] },
        OR: [
          {
            start: { lte: startDate },
            end: { gt: startDate },
          },
          {
            start: { lt: endDate },
            end: { gte: endDate },
          },
          {
            start: { gte: startDate },
            end: { lte: endDate },
          },
        ],
      },
    });

    if (conflictingBookings > 0) {
      return reply.code(409).send({
        error: 'Slot temporale non disponibile per il periodo selezionato',
      });
    }

    // Crea prenotazione
    const newBooking = await prisma.booking.create({
      data: {
        packageId,
        venueId,
        userId, // ID dell'utente dall'altra app
        start: startDate,
        end: endDate,
        people,
        status: 'PENDING', // Le prenotazioni esterne iniziano come PENDING
        costumerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        costumerEmail: customerInfo.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        venue: {
          select: { id: true, name: true },
        },
        package: {
          select: { id: true, name: true },
        },
      },
    });

    return reply.code(201).send({
      message: 'Prenotazione creata con successo',
      bookingId: newBooking.id,
      booking: {
        id: newBooking.id,
        start: newBooking.start,
        end: newBooking.end,
        people: newBooking.people,
        status: newBooking.status,
        customer: {
          name: newBooking.costumerName,
          email: newBooking.costumerEmail,
        },
        venue: newBooking.venueId,
        package: newBooking.packageId,
      },
    });
  } catch (error) {
    console.error('Error in createNewBooking:', error);
    return reply.code(500).send({
      error: 'Errore nella creazione della prenotazione',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Handler per cancellare prenotazioni
export const deleteBooking = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return reply.code(400).send({ error: 'ID prenotazione non valido' });
    }

    // Trova la prenotazione
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } },
      },
    });

    if (!booking) {
      return reply.code(404).send({ error: 'Prenotazione non trovata' });
    }

    // Verifica se è cancellabile (es: almeno 24h prima)
    const now = new Date();
    const bookingStart = new Date(booking.start);
    const timeDiff = bookingStart.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24) {
      return reply.code(400).send({
        error: 'Non è possibile cancellare prenotazioni con meno di 24 ore di anticipo',
      });
    }

    // Aggiorna status invece di eliminare fisicamente
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'Cancelled',
        updatedAt: new Date(),
      },
      include: {
        venue: { select: { name: true } },
        package: { select: { name: true } },
      },
    });

    return reply.code(200).send({
      message: 'Prenotazione cancellata con successo',
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    return reply.code(500).send({
      error: 'Errore nella cancellazione della prenotazione',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Handler per ottenere dettagli di una prenotazione
export const getBookingDetails = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return reply.code(400).send({ error: 'ID prenotazione non valido' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!booking) {
      return reply.code(404).send({ error: 'Prenotazione non trovata' });
    }

    return reply.code(200).send({ booking });
  } catch (error) {
    console.error('Error in getBookingDetails:', error);
    return reply.code(500).send({
      error: 'Errore nel recupero della prenotazione',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
