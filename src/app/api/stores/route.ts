import { NextRequest, NextResponse } from "next/server";
import {
  geocodePostcode,
  reverseGeocode,
  findNearestStore,
  buildMapsSearchUrl,
} from "@/lib/stores/google";
import { NearbyStore, StoresApiResponse } from "@/lib/stores/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const postcodeParam = searchParams.get("postcode");

  if (!postcodeParam && (!latParam || !lngParam)) {
    return NextResponse.json(
      { error: "Provide either postcode or lat & lng" },
      { status: 400 }
    );
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "Store location service not configured" },
      { status: 500 }
    );
  }

  try {
    let lat: number;
    let lng: number;
    let postcode: string | undefined = postcodeParam || undefined;

    if (latParam && lngParam) {
      lat = parseFloat(latParam);
      lng = parseFloat(lngParam);
      if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json(
          { error: "Invalid lat/lng values" },
          { status: 400 }
        );
      }
      // Reverse-geocode to get postcode for display if not provided
      if (!postcode) {
        const geo = await reverseGeocode(lat, lng);
        postcode = geo.postcode;
      }
    } else {
      // Geocode postcode to lat/lng
      const geo = await geocodePostcode(postcode!);
      lat = geo.lat;
      lng = geo.lng;
    }

    // Find nearest Woolworths and Coles in parallel
    const [woolworthsResult, colesResult] = await Promise.allSettled([
      findNearestStore("Woolworths", lat, lng),
      findNearestStore("Coles", lat, lng),
    ]);

    const stores: NearbyStore[] = [];

    if (woolworthsResult.status === "fulfilled" && woolworthsResult.value) {
      stores.push(woolworthsResult.value);
    }
    if (colesResult.status === "fulfilled" && colesResult.value) {
      stores.push(colesResult.value);
    }

    // Aldi: generic search URL centered on user location (no Places API call)
    stores.push({
      store: "Aldi",
      name: "Aldi near you",
      address: "",
      placeId: "",
      lat: 0,
      lng: 0,
      distanceKm: -1,
      mapsUrl: buildMapsSearchUrl("Aldi supermarket", lat, lng),
    });

    const response: StoresApiResponse = {
      stores,
      userLocation: { lat, lng, postcode },
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to find nearby stores";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
