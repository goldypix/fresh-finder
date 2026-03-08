export interface NearbyStore {
  store: string;
  name: string;
  address: string;
  placeId: string;
  lat: number;
  lng: number;
  distanceKm: number;
  mapsUrl: string;
}

export interface StoresApiResponse {
  stores: NearbyStore[];
  userLocation: {
    lat: number;
    lng: number;
    postcode?: string;
  };
  error?: string;
}

export interface GeocodedLocation {
  lat: number;
  lng: number;
  postcode?: string;
}
