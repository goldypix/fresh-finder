import { NearbyStore, GeocodedLocation } from "./types";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function buildMapsDirectionsUrl(
  lat: number,
  lng: number,
  placeId: string
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${placeId}`;
}

export function buildMapsSearchUrl(
  query: string,
  lat: number,
  lng: number
): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},14z`;
}

export async function geocodePostcode(
  postcode: string
): Promise<GeocodedLocation> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode + " Australia")}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.results?.length) {
    throw new Error(`Could not geocode postcode: ${postcode}`);
  }

  const location = data.results[0].geometry.location;
  return {
    lat: location.lat,
    lng: location.lng,
    postcode,
  };
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodedLocation> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  let postcode: string | undefined;
  if (data.status === "OK" && data.results?.length) {
    for (const result of data.results) {
      for (const component of result.address_components || []) {
        if (component.types?.includes("postal_code")) {
          postcode = component.short_name;
          break;
        }
      }
      if (postcode) break;
    }
  }

  return { lat, lng, postcode };
}

export async function findNearestStore(
  storeName: string,
  lat: number,
  lng: number,
  radiusMeters: number = 10000
): Promise<NearbyStore | null> {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.location,places.id",
    },
    body: JSON.stringify({
      textQuery: `${storeName} supermarket`,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusMeters,
        },
      },
      maxResultCount: 1,
    }),
  });

  if (!res.ok) {
    console.error(
      `Places API error for ${storeName}: HTTP ${res.status}`
    );
    return null;
  }

  const data = await res.json();
  const place = data.places?.[0];
  if (!place) return null;

  const storeLat = place.location.latitude;
  const storeLng = place.location.longitude;
  const placeId = place.id;

  return {
    store: storeName,
    name: place.displayName?.text || storeName,
    address: place.formattedAddress || "",
    placeId,
    lat: storeLat,
    lng: storeLng,
    distanceKm: haversineDistance(lat, lng, storeLat, storeLng),
    mapsUrl: buildMapsDirectionsUrl(storeLat, storeLng, placeId),
  };
}
