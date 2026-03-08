import { StoreResult } from "@/data/mockData";
import { NearbyStore } from "@/lib/stores/types";

export default function StoreCard({
  result,
  cheapest,
  nearbyStore,
}: {
  result: StoreResult;
  cheapest: boolean;
  nearbyStore?: NearbyStore;
}) {
  const mapsHref = result.mapsUrl
    ? result.mapsUrl
    : `https://www.google.com/maps/search/${encodeURIComponent(result.mapsQuery)}`;
  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        cheapest
          ? "border-green-400 ring-2 ring-green-100"
          : "border-gray-200"
      }`}
    >
      {cheapest && (
        <span className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
          Cheapest
        </span>
      )}

      {result.imageUrl && (
        <div className="mb-3 flex justify-center">
          <img
            src={result.imageUrl}
            alt={result.item}
            className="h-24 w-24 rounded-lg object-contain"
          />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Store logo placeholder */}
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundColor: result.logoColor }}
        >
          {result.store[0]}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {result.store}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">{result.item}</p>
          {nearbyStore && nearbyStore.distanceKm >= 0 && (
            <p className="mt-0.5 text-xs text-gray-400">
              {nearbyStore.name} &middot; {nearbyStore.distanceKm.toFixed(1)} km
              away
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-green-700">
            {result.price > 0 ? `$${result.price.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={result.onlineUrl}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          Buy Online
        </a>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Find in Maps
        </a>
      </div>
    </div>
  );
}
