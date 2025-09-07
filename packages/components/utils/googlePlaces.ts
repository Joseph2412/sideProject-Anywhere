// Dichiarazioni di tipo per Google Maps
/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => GoogleAutocompleteService;
          PlacesService: new (map: GoogleMap) => GooglePlacesServiceInterface;
          PlacesServiceStatus: {
            OK: string;
          };
        };
        Map: new (element: HTMLElement) => GoogleMap;
      };
    };
  }
}

interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: {
      input: string;
      types?: string[];
      componentRestrictions?: { country: string };
    },
    callback: (predictions: GooglePrediction[], status: string) => void
  ) => void;
}

interface GooglePlacesServiceInterface {
  getDetails: (
    request: {
      placeId: string;
      fields: string[];
    },
    callback: (place: GooglePlace, status: string) => void
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GoogleMap {}

interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlace {
  formatted_address?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

declare const google: typeof window.google;
declare const process: { env: { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string } };
/* eslint-enable @typescript-eslint/naming-convention */

export interface PlaceResult {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

export class GooglePlacesService {
  private static _instance: GooglePlacesService;
  private _isLoaded = false;
  private _autocompleteService: GoogleAutocompleteService | null = null;
  private _placesService: GooglePlacesServiceInterface | null = null;

  private constructor() {}

  static getInstance(): GooglePlacesService {
    if (!GooglePlacesService._instance) {
      GooglePlacesService._instance = new GooglePlacesService();
    }
    return GooglePlacesService._instance;
  }

  async initialize(): Promise<void> {
    if (this._isLoaded) return;

    // Carica dinamicamente il script di Google Maps
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Errore nel caricamento di Google Maps'));
        document.head.appendChild(script);
      });
    }

    this._autocompleteService = new google.maps.places.AutocompleteService();

    // Crea un div nascosto per il PlacesService
    const div = document.createElement('div');
    div.style.display = 'none';
    document.body.appendChild(div);
    const map = new google.maps.Map(div);
    this._placesService = new google.maps.places.PlacesService(map);

    this._isLoaded = true;
  }

  async searchPlaces(input: string): Promise<GooglePrediction[]> {
    if (!this._autocompleteService) {
      await this.initialize();
    }

    return new Promise(resolve => {
      this._autocompleteService!.getPlacePredictions(
        {
          input,
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'IT' }, // Limita all'Italia
        },
        (predictions: GooglePrediction[], status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    });
  }

  async getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
    if (!this._placesService) {
      await this.initialize();
    }

    return new Promise(resolve => {
      this._placesService!.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry.location'],
        },
        (place: GooglePlace, status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const location = place.geometry?.location;
            if (location) {
              resolve({
                address: place.formatted_address || '',
                latitude: location.lat(),
                longitude: location.lng(),
                placeId,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      );
    });
  }
}
