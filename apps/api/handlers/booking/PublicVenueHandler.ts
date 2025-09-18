import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../libs/prisma';
import {
  generateSecureVenueLogoUrl,
  generateSecureVenuePhotoUrl,
  generateSecurePackagePhotoUrl,
} from '../../utils/secureMediaUtils';

interface PublicVenuesQuery {
  city?: string;
}

export const getPublicVenuesHandler = async (
  request: FastifyRequest<{ Querystring: PublicVenuesQuery }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id?: number };
    const { city } = request.query as { city?: string };

    if (id) {
      const venue = await prisma.venue.findUnique({
        where: { id: id },
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
              day: true,
              isClosed: true,
              periods: true,
            },
          },
          packages: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              description: true,
              type: true,
              squareMetres: true,
              capacity: true,
              photos: true,
              plans: {
                where: { isEnabled: true },
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      if (!venue) {
        return reply.code(404).send({ message: 'Venue non trovato' });
      }

      // Genera URL signed per le foto se necessario
      let logoURL = null;
      if (venue.logoURL) {
        const { S3_REPORTS_BUCKET } = process.env;
        logoURL = await request.s3.getSignedUrl(S3_REPORTS_BUCKET!, venue.logoURL);
      }

      return reply.code(200).send({
        venue: {
          ...venue,
          logoURL,
        },
      });
    }

    // Query per tutti i venue o filtrati per città
    const whereClause: any = {};

    // Se la città è fornita, filtra per indirizzo che la contiene
    if (city) {
      whereClause.address = {
        contains: city,
        mode: 'insensitive',
        // Case insensitive search
        //Prendi qualsiasi cosa come riscontro
      };
    }

    const venues = await prisma.venue.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        description: true,
        logoURL: true,
        photos: true,
        services: true,
        venueRatings: true,
        reviewsCounter: true,
        openingDays: {
          orderBy: [{ day: 'asc' }],
          select: {
            day: true,
            isClosed: true,
            periods: true,
          },
        },
        packages: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            capacity: true,
            seats: true,
            squareMetres: true,
            services: true,
            photos: true,
            plans: {
              where: { isEnabled: true },
              select: {
                id: true,
                name: true,
                rate: true,
                price: true,
              },
              orderBy: { price: 'asc' },
            },
          },
        },
        _count: { select: { packages: { where: { isActive: true } } } }, // Conta i pacchetti attivi
      },
    });

    // Genera URL proxy sicuri per logos e photos
    const venuesWithUrls = venues.map(venue => {
      // Genera URL proxy sicuro per il logo
      let logoURL = null;
      if (venue.logoURL) {
        try {
          logoURL = generateSecureVenueLogoUrl(venue.logoURL);
        } catch (error) {
          console.warn(`Could not generate logo URL for venue ${venue.id}:`, error);
          logoURL = null;
        }
      }

      // Genera URL proxy sicuri per le photos
      const photos = venue.photos
        .map(photo => {
          try {
            return generateSecureVenuePhotoUrl(photo);
          } catch (error) {
            console.warn(`Could not generate photo URL for venue ${venue.id}:`, error);
            return null;
          }
        })
        .filter(Boolean); // Rimuovi URL null

      // Genera URL proxy sicuri per le photos dei packages
      const packages = venue.packages.map(pkg => {
        const packagePhotos = pkg.photos
          .map(photo => {
            try {
              return generateSecurePackagePhotoUrl(photo);
            } catch (error) {
              console.warn(`Could not generate package photo URL for package ${pkg.id}:`, error);
              return null;
            }
          })
          .filter(Boolean); // Rimuovi URL null

        return { ...pkg, photos: packagePhotos };
      });

      return {
        ...venue,
        logoURL,
        photos,
        packages,
      };
    });

    return reply.code(200).send({
      venues: venuesWithUrls,
      total: venuesWithUrls.length,
      city: city || 'tutte le città',
    });
  } catch (error) {
    console.error('Error in getPublicVenuesHandler:', error);
    return reply.code(500).send({
      error: 'Errore nel recupero dei locali',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getPublicVenueDetailsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const venueId = parseInt(request.params.id);

    if (isNaN(venueId)) {
      return reply.code(400).send({ error: 'ID venue non valido' });
    }

    const venue = await prisma.venue.findFirst({
      where: {
        id: venueId,
        packages: {
          some: {
            isActive: true,
            plans: {
              some: { isEnabled: true },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        description: true,
        logoURL: true,
        photos: true,
        services: true,
        venueRatings: true,
        reviewsCounter: true,
        openingDays: {
          select: {
            day: true,
            isClosed: true,
            periods: true,
          },
          orderBy: { day: 'asc' },
        },
        closingPeriods: {
          where: {
            end: { gte: new Date() }, // Solo periodi di chiusura futuri
          },
          select: {
            start: true,
            end: true,
          },
        },
        packages: {
          where: {
            isActive: true,
            plans: {
              some: { isEnabled: true },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            capacity: true,
            seats: true,
            squareMetres: true,
            services: true,
            photos: true,
            plans: {
              where: { isEnabled: true },
              select: {
                id: true,
                name: true,
                rate: true,
                price: true,
              },
              orderBy: { price: 'asc' },
            },
          },
        },
      },
    });

    if (!venue) {
      return reply.code(404).send({ error: 'Locale non trovato' });
    }

    // Genera URL proxy sicuri
    let logoURL = null;
    if (venue.logoURL) {
      try {
        logoURL = generateSecureVenueLogoUrl(venue.logoURL);
      } catch (error) {
        console.warn(`Could not generate logo URL for venue ${venue.id}:`, error);
        logoURL = null;
      }
    }

    const photos = venue.photos
      .map(photo => {
        try {
          return generateSecureVenuePhotoUrl(photo);
        } catch (error) {
          console.warn(`Could not generate photo URL for venue ${venue.id}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Rimuovi URL null

    const packages = venue.packages.map(pkg => {
      const packagePhotos = pkg.photos
        .map(photo => {
          try {
            return generateSecurePackagePhotoUrl(photo);
          } catch (error) {
            console.warn(`Could not generate package photo URL for package ${pkg.id}:`, error);
            return null;
          }
        })
        .filter(Boolean); // Rimuovi URL null

      return { ...pkg, photos: packagePhotos };
    });

    return reply.code(200).send({
      venue: {
        ...venue,
        logoURL,
        photos,
        packages,
      },
    });
  } catch (error) {
    console.error('Error in getPublicVenueDetailsHandler:', error);
    return reply.code(500).send({
      error: 'Errore nel recupero del locale',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
