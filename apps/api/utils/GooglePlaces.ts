"use client";

import { useState, useCallback } from "react";

export interface GooglePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const useGooglePlaces = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = useCallback(
    async (input: string): Promise<GooglePrediction[]> => {
      if (!input || input.length < 3) return [];

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/google/places/autocomplete?input=${encodeURIComponent(input)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Errore nella richiesta");
        }

        const data = await response.json();

        if (data.status === "OK" && data.predictions) {
          return data.predictions;
        }

        return [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Errore nella ricerca";
        setError(errorMessage);
        console.error("Errore nella ricerca:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/google/places/details?placeId=${placeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Errore nel recupero dettagli");
        }

        const data = await response.json();

        if (data.status === "OK" && data.result) {
          const place = data.result;
          return {
            placeId,
            name: place.name || "",
            address: place.formatted_address || "",
            latitude: place.geometry?.location?.lat || 0,
            longitude: place.geometry?.location?.lng || 0,
          };
        }

        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Errore nel recupero dettagli";
        setError(errorMessage);
        console.error("Errore nel recupero dettagli:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    searchPlaces,
    getPlaceDetails,
    loading,
    error,
  };
};
