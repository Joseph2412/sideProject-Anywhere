export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    );

    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    return null;
  } catch (error) {
    console.error("Errore durante il geocoding:", error);
    return null;
  }
}
