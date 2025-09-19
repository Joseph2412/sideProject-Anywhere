import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import { generateSecureVenueLogoUrl } from './../../utils/secureMediaUtils';

export const getVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  // Recupera l'utente e la venue in un'unica query
  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    select: {
      venue: {
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          services: true,
          photos: true,
          logoURL: true,
          latitude: true,
          longitude: true,
          openingDays: {
            orderBy: [{ day: 'asc' }],
            select: {
              id: true,
              day: true,
              isClosed: true,
              periods: true,
            },
          },
        },
      },
    },
  });

  if (!user?.venue) return reply.code(404).send({ venue: null });

  // Genera URL proxy sicuro per il logo se esiste
  const venue = user.venue;
  let logoURL = null;
  if (venue.logoURL) {
    try {
      logoURL = generateSecureVenueLogoUrl(venue.logoURL);
    } catch (error) {
      console.warn(`Could not generate secure logo URL for venue ${venue.id}:`, error);
      logoURL = null;
    }
  }

  return reply.code(200).send({
    venue: {
      ...venue,
      logoURL,
    },
  });
};

export const updateVenueDetailsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, address, description, services, logoURL, photos, latitude, longitude } =
    request.body as {
      name: string;
      address: string;
      description?: string | null;
      services?: string[];
      logoURL?: string | null;
      photos?: string[];
      latitude?: number | null;
      longitude?: number | null;
    };

  if (!name || !address) {
    return reply.code(400).send({ message: 'name and address are required' });
  }

  // Recupera venueId dell'utente in una sola query
  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    select: { venueId: true },
  });

  // Se stiamo aggiornando, recupera i dati esistenti per preservare logoURL se non fornito
  let existingVenue = null;
  if (user?.venueId) {
    existingVenue = await prisma.venue.findUnique({
      where: { id: user.venueId },
      select: { logoURL: true, latitude: true, longitude: true },
    });
  }

  const venue = await prisma.venue.upsert({
    where: { id: user?.venueId ?? 0 },
    create: {
      user: { connect: { id: request.user.id } },
      name,
      address,
      description: description ?? null,
      services: services ?? [],
      photos: photos ?? [],
      logoURL: logoURL ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    },
    update: {
      name,
      address,
      description: description ?? null,
      services: services ?? [],
      photos: photos ?? [],
      // Preserva il logoURL esistente se non viene fornito un nuovo valore
      logoURL: logoURL !== undefined ? logoURL : (existingVenue?.logoURL ?? null),
      // Aggiorna le coordinate se fornite, altrimenti mantieni quelle esistenti
      latitude: latitude !== undefined ? latitude : (existingVenue?.latitude ?? null),
      longitude: longitude !== undefined ? longitude : (existingVenue?.longitude ?? null),
    },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      services: true,
      photos: true,
      logoURL: true,
      latitude: true,
      longitude: true,
    },
  });

  return reply.code(200).send({ venue });
};
