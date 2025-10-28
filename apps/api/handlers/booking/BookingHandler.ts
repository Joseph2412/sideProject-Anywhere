import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../libs/prisma";
import { notifyBookingChange } from "./BookingSSEHandler";

interface ExternalBookingBody {
  venueId: number;
  packageId: number;
  start: string;
  end: string;
  people: number;
  // userId: number; // RIMOSSO - Useremo l'utente autenticato
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

// Handler unificato per prenotazioni esterne (da altra app)
export const createNewBooking = async (
  request: FastifyRequest, // Aggiunto tipo corretto
  reply: FastifyReply,
) => {
  try {
    const body = request.body as ExternalBookingBody;
    const venueId = Number(body.venueId);
    const packageId = Number(body.packageId);
    const people = Number(body.people);
    // ✅ USA L'ID DELL'UTENTE AUTENTICATO DAL TOKEN JWT
    const authenticatedUserId = request.user.id;
    const { start, end, customerInfo } = body;
    
    // 🔍 DEBUG: Aggiungi questi log
    console.log("========== DEBUG BOOKING ==========");
    console.log("📋 Body ricevuto:", JSON.stringify(body, null, 2));
    console.log("🔐 Utente autenticato dal token:", authenticatedUserId); // Log ID autenticato
    console.log("🔢 Parametri convertiti:");
    console.log("  venueId:", venueId, "type:", typeof venueId);
    console.log("  packageId:", packageId, "type:", typeof packageId);
    // console.log("  userId (dal body - ignorato):", body.userId); // Log ID ignorato
    console.log("===================================");
    
    if (isNaN(venueId) || isNaN(packageId) || isNaN(people)) {
      console.log("❌ Errore: Parametri numerici non validi");
      return reply.code(400).send({ error: "Parametri numerici non validi" });
    }
    
    // Validazione input (rimosso userId da qui)
    if (
      !venueId ||
      !packageId ||
      !start ||
      !end ||
      !people ||
      !customerInfo
    ) {
      console.log("❌ Errore: Campi obbligatori mancanti");
      return reply.code(400).send({ error: "Tutti i campi sono obbligatori" });
    }
    
    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.email
    ) {
      console.log("❌ Errore: Informazioni cliente incomplete");
      return reply.code(400).send({ error: "Informazioni cliente incomplete" });
    }
    
    // Verifica che l'utente autenticato esista (dovrebbe sempre esistere a questo punto)
    console.log("🔍 Cerco utente autenticato con ID:", authenticatedUserId);
    const existingUser = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
    });
    
    console.log("👤 Utente autenticato trovato:", !!existingUser);
    if (!existingUser) {
      console.log("❌ Utente autenticato non trovato nel database (ERRORE GRAVE)");
      // Questo non dovrebbe succedere se il token è valido
      return reply.code(401).send({ error: "Utente non valido" });
    }
    console.log("👤 Dettagli utente:", { id: existingUser.id, email: existingUser.email });
    
    
    // Verifica esistenza venue e package (manteniamo i log di debug)
    console.log("🏢 Cerco venue con ID:", venueId);
    const venueCheck = await prisma.venue.findUnique({ where: { id: venueId } });
    console.log("📦 Cerco package con ID:", packageId);
    const packageCheck = await prisma.package.findUnique({ where: { id: packageId } });
    console.log("🏢 Venue esiste:", !!venueCheck);
    console.log("📦 Package esiste:", !!packageCheck);
    
    
    // Verifica esistenza venue E che il package appartenga al venue e sia prenotabile
    console.log("🔗 Cerco venue con package valido collegato...");
    const venue = await prisma.venue.findFirst({
      where: {
        id: venueId,
        packages: {
          some: {
            id: packageId,
            isActive: true, // Package attivo
            plans: {
              some: { isEnabled: true }, // Almeno un piano attivo
            },
          },
        },
      },
      include: { // Includi solo il package richiesto
        packages: {
          where: { id: packageId },
          include: { plans: { where: { isEnabled: true }} },
        },
      },
    });
    
    if (!venue || !venue.packages.length || venue.packages[0].plans.length === 0) {
      console.log("❌ Venue/Package non trovato o non prenotabile (Package inattivo o senza piani)");
      console.log("   Venue trovato:", !!venue);
      if (venue) {
        console.log("   Package trovati nel venue:", venue.packages.length);
        if(venue.packages.length > 0) {
          console.log("   Package richiesto:", venue.packages[0]);
          console.log("   Piani attivi nel package:", venue.packages[0].plans.length);
        }
      }
      return reply.code(404).send({ error: "Venue o package non trovato/prenotabile" });
    }
    console.log("✅ Venue e Package validi trovati");
    
    const selectedPackage = venue.packages[0];
    
    // Controlla capacità
    if (selectedPackage.capacity && people > selectedPackage.capacity) {
      console.log(`❌ Capacità superata: richiesti ${people}, max ${selectedPackage.capacity}`);
      return reply.code(400).send({
        error: `Capacità massima superata. Massimo: ${selectedPackage.capacity} persone`,
      });
    }
    
    // Controlla disponibilità temporale
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.log("❌ Date non valide:", start, end);
      return reply.code(400).send({ error: "Date di inizio o fine non valide" });
    }
    
    
    if (startDate >= endDate) {
      console.log("❌ Date invertite:", startDate, ">=", endDate);
      return reply.code(400).send({
        error: "Data di fine deve essere successiva a quella di inizio",
      });
    }
    
    // Rimuovi il controllo per prenotazioni nel passato, potrebbe essere utile per test
    // if (startDate < new Date()) {
    //   return reply
    //     .code(400)
    //     .send({ error: "Non è possibile prenotare nel passato" });
    // }
    
    console.log(`⏳ Controllo conflitti per package ${packageId} tra ${startDate.toISOString()} e ${endDate.toISOString()}`);
    const conflictingBookings = await prisma.booking.count({
      where: {
        packageId,
        status: { notIn: ["CANCELLED", "REJECTED"] }, // Considera solo prenotazioni attive/pendenti
        // Logica di sovrapposizione:
        // Una prenotazione esistente (ES, EE) confligge con la nuova (NS, NE) se:
        // (ES < NE) and (EE > NS)
        start: { lt: endDate },    // L'inizio esistente è prima della fine nuova
        end: { gt: startDate },    // La fine esistente è dopo l'inizio nuovo
      },
    });
    console.log(`💥 Conflitti trovati: ${conflictingBookings}`);
    
    if (conflictingBookings > 0) {
      return reply.code(409).send({
        error: "Slot temporale non disponibile per il periodo selezionato",
      });
    }
    console.log("✅ Slot temporale disponibile");
    
    // Crea prenotazione
    console.log(`➕ Creazione prenotazione per utente ${authenticatedUserId}`);
    const newBooking = await prisma.booking.create({
      data: {
        packageId,
        venueId,
        userId: authenticatedUserId, // ✅ USA ID UTENTE AUTENTICATO
        start: startDate,
        end: endDate,
        people,
        status: "PENDING", // Le prenotazioni esterne iniziano come PENDING
        costumerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        costumerEmail: customerInfo.email,
        // Non serve createdAt/updatedAt, Prisma li gestisce
      },
      include: { // Includi dati per la notifica SSE
        venue: { select: { id: true, name: true } },
        package: { select: { id: true, name: true, type: true } },
      },
    });
    console.log(`🎉 Prenotazione creata con ID: ${newBooking.id}`);
    
    // 🔥 Invia notifica SSE per aggiornamenti in tempo reale
    notifyBookingChange(venueId, "created", newBooking);
    
    return reply.code(201).send({
      message: "Prenotazione creata con successo",
      bookingId: newBooking.id,
      // Restituisci un payload più snello se non serve tutto nel frontend
      booking: {
        id: newBooking.id,
        start: newBooking.start.toISOString(), // Standardizza output date
        end: newBooking.end.toISOString(),
        people: newBooking.people,
        status: newBooking.status,
        customer: {
          name: newBooking.costumerName,
          email: newBooking.costumerEmail,
        },
        venue: newBooking.venue, // Già inclusi
        package: newBooking.package, // Già inclusi
      },
    });
  } catch (error) {
    console.error("❌ Errore grave in createNewBooking:", error);
    return reply.code(500).send({
      error: "Errore interno nella creazione della prenotazione",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// --- Gli altri handler (deleteBooking, getBookingDetails, etc.) rimangono invariati ---
export const deleteBooking = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params as { id: string };
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return reply.code(400).send({ error: "ID prenotazione non valido" });
    }
    
    // Trova la prenotazione per sapere a quale venue appartiene (per notifica SSE)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, venueId: true, start: true } // Seleziona solo i campi necessari
    });
    
    if (!booking) {
      return reply.code(404).send({ error: "Prenotazione non trovata" });
    }
    
    // Verifica se è cancellabile (es: almeno 24h prima)
    const now = new Date();
    const bookingStart = new Date(booking.start);
    const timeDiff = bookingStart.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    // Permetti la cancellazione anche se è iniziata da poco (es. per errore)
    // if (hoursDiff < -1) { // Permetti cancellazione fino a 1h dopo l'inizio? Da decidere
    if (hoursDiff < 24 && bookingStart > now) { // Manteniamo la regola delle 24h prima
      return reply.code(400).send({
        error:
        "Non è possibile cancellare prenotazioni con meno di 24 ore di anticipo",
      });
    }
    
    // Aggiorna status invece di eliminare fisicamente
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED", // Usa lo stato standard
        updatedAt: new Date(),
      },
      include: { // Includi dati utili per SSE e risposta
        venue: { select: { id: true, name: true } },
        package: { select: { id: true, name: true, type: true } },
      },
    });
    
    // 🔥 Invia notifica SSE per aggiornamenti in tempo reale
    notifyBookingChange(booking.venueId, "deleted", cancelledBooking); // Usiamo 'deleted' anche se è un update di stato
    
    return reply.code(200).send({
      message: "Prenotazione cancellata con successo",
      booking: { // Ritorna un payload consistente con create
        id: cancelledBooking.id,
        start: cancelledBooking.start.toISOString(),
        end: cancelledBooking.end.toISOString(),
        people: cancelledBooking.people,
        status: cancelledBooking.status,
        customer: {
          name: cancelledBooking.costumerName,
          email: cancelledBooking.costumerEmail,
        },
        venue: cancelledBooking.venue,
        package: cancelledBooking.package,
      },
    });
  } catch (error) {
    console.error("❌ Errore in deleteBooking:", error);
    return reply.code(500).send({
      error: "Errore nella cancellazione della prenotazione",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const getBookingDetails = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params as { id: string };
    const bookingId = parseInt(id);
    const authenticatedUserId = request.user.id; // ID dell'utente loggato
    
    if (isNaN(bookingId)) {
      return reply.code(400).send({ error: "ID prenotazione non valido" });
    }
    
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: { select: { id: true, name: true, address: true, user: { select: { id: true }} } }, // Include user ID del proprietario
        package: { select: { id: true, name: true, type: true } },
        // user: { select: { id: true, email: true, firstName: true, lastName: true }}, // Include dati utente che ha prenotato?
      },
    });
    
    if (!booking) {
      return reply.code(404).send({ error: "Prenotazione non trovata" });
    }
    
    // Controllo Autorizzazione: L'utente loggato deve essere o chi ha prenotato o il proprietario del venue
    const isOwner = booking.venue.user?.id === authenticatedUserId;
    const isBooker = booking.userId === authenticatedUserId;
    
    if (!isOwner && !isBooker) {
      console.log(`❌ Autorizzazione negata: Utente ${authenticatedUserId} non è né proprietario (${booking.venue.user?.id}) né prenotante (${booking.userId})`);
      return reply.code(403).send({ error: "Non autorizzato a vedere questa prenotazione" });
    }
    console.log(`✅ Autorizzazione OK per utente ${authenticatedUserId} (Owner: ${isOwner}, Booker: ${isBooker})`);
    
    
    // Rimuovi l'ID utente del proprietario prima di inviare la risposta se non serve al frontend
    const { venue, ...restBooking } = booking;
    const { user, ...restVenue } = venue;
    
    
    return reply.code(200).send({
      booking: {
        ...restBooking,
        start: booking.start.toISOString(), // Standardizza output date
        end: booking.end.toISOString(),
        venue: restVenue, // Venue senza user ID proprietario
        package: booking.package,
        // Aggiungi customer info se necessario
        customer: {
          name: booking.costumerName,
          email: booking.costumerEmail,
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Errore in getBookingDetails:", error);
    return reply.code(500).send({
      error: "Errore nel recupero della prenotazione",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const getVenueBookings = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // Questo handler potrebbe diventare obsoleto se si usa solo getMyVenueBookings
  console.warn("⚠️ Chiamata all'handler deprecato getVenueBookings");
  // Delega al nuovo handler per ora
  return getMyVenueBookings(request, reply);
};

// Handler principale per recuperare le prenotazioni del PROPRIO venue
export const getMyVenueBookings = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authenticatedUserId = request.user.id;
    const {
      status,
      limit = 20, // Default a 20
      page = 1,   // Default a pagina 1
      // Aggiungi filtri per data se necessario
      // startDate,
      // endDate,
    } = request.query as {
      status?: string;
      limit?: number;
      page?: number;
      // startDate?: string;
      // endDate?: string;
    };
    
    // Validazione parametri paginazione
    const take = Math.max(1, Math.min(100, Number(limit) || 20)); // Limita tra 1 e 100
    const skip = Math.max(0, (Number(page) || 1) - 1) * take; // Calcola offset
    
    // Trova il venue dell'utente autenticato
    const user = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: { venue: { select: { id: true } } },
    });
    
    console.log("🔍 My Venue Bookings Debug:");
    console.log("User from JWT:", { id: authenticatedUserId });
    console.log("User venue from DB:", user?.venue ? { id: user.venue.id } : "NO VENUE");
    
    if (!user?.venue?.id) {
      console.log("❌ User has no venue assigned");
      // Se l'utente è HOST ma non ha venue, ritorna lista vuota invece di 404
      return reply.code(200).send({
        bookings: [],
        total: 0,
        limit: take,
        page: Number(page) || 1,
        totalPages: 0,
      });
      // return reply.code(404).send({ error: "Utente non ha un venue associato" });
    }
    
    const venueId = user.venue.id;
    console.log("✅ User owns venue:", venueId);
    
    const whereClause: any = { venueId: venueId };
    if (status) {
      // Validazione status
      const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
      if (validStatuses.includes(status.toUpperCase())) {
        whereClause.status = status.toUpperCase();
        console.log(`Filtering by status: ${whereClause.status}`);
      } else {
        console.warn(`⚠️ Status non valido ricevuto: ${status}, ignorato.`);
      }
    }
    // Aggiungi qui filtri per data se implementati
    
    console.log(`📊 Querying bookings for venue ${venueId} with limit=${take}, skip=${skip}, status=${whereClause.status || 'any'}`);
    
    const [bookings, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where: whereClause,
        include: { // Includi solo i dati necessari per la lista
          package: { select: { id: true, name: true, type: true } },
          // Non includere venue, è sempre lo stesso
        },
        orderBy: { start: "desc" }, // Ordina per data inizio decrescente
        take: take,
        skip: skip,
      }),
      prisma.booking.count({ where: whereClause })
    ]);
    
    
    console.log(`✅ Trovate ${bookings.length} prenotazioni (totale: ${total})`);
    
    // Formatta la risposta per coerenza
    const formattedBookings = bookings.map(b => ({
      id: b.id,
      venueId: b.venueId,
      packageId: b.packageId,
      // price: b.price, // Il prezzo non è nel modello Booking, andrebbe calcolato o recuperato
      start: b.start.toISOString(),
      end: b.end.toISOString(),
      people: b.people,
      status: b.status,
      costumerName: b.costumerName,
      costumerEmail: b.costumerEmail,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      package: b.package,
      // Non includere venue qui
    }));
    
    
    return reply.code(200).send({
      bookings: formattedBookings,
      total,
      limit: take,
      page: Number(page) || 1,
      totalPages: Math.ceil(total / take), // Aggiungi numero totale pagine
    });
  } catch (error) {
    console.error("❌ Errore in getMyVenueBookings:", error);
    return reply.code(500).send({
      error: "Errore nel recupero delle prenotazioni del venue",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
