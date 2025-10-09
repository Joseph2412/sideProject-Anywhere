import { Venue } from "@/types";

/**
 * Filtra venues che hanno almeno 1 package con almeno 1 piano attivo
 */
export function filterVenuesWithPlans(venues: Venue[]): Venue[] {
  return venues.filter((venue) => {
    return venue.packages?.some(
      (pkg) => pkg.plans && pkg.plans.length > 0
    );
  });
}

/**
 * Verifica se un singolo venue ha piani disponibili
 */
export function hasAvailablePlans(venue: Venue): boolean {
  return venue.packages?.some(
    (pkg) => pkg.plans && pkg.plans.length > 0
  ) ?? false;
}