"use client";

import { useState, useRef, FormEvent } from "react";
import { StoreResult } from "@/data/mockData";
import { NearbyStore } from "@/lib/stores/types";
import StoreCard from "@/components/StoreCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [postcode, setPostcode] = useState("");
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StoreResult[] | null>(null);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchErrors, setSearchErrors] = useState<string[]>([]);
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[] | null>(null);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const lastStoresFetchRef = useRef<string>("");

  async function fetchResults(searchQuery: string) {
    setLoading(true);
    setSearchErrors([]);
    setSearchedQuery(searchQuery.trim());

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      // Map ScrapedProduct to StoreResult format
      const mapped: StoreResult[] = (data.results || []).map(
        (p: {
          store: string;
          logoColor: string;
          name: string;
          price: number;
          productUrl: string;
          imageUrl: string;
          mapsQuery: string;
        }) => ({
          store: p.store,
          logoColor: p.logoColor,
          item: p.name,
          price: p.price,
          onlineUrl: p.productUrl,
          mapsQuery: p.mapsQuery,
          imageUrl: p.imageUrl || undefined,
        })
      );

      setResults(mapped);
      if (data.errors) {
        setSearchErrors(data.errors);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setSearchErrors([
        error instanceof Error ? error.message : "Search failed",
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNearbyStores(params: {
    lat?: number;
    lng?: number;
    postcode?: string;
  }) {
    const key = params.lat
      ? `${params.lat},${params.lng}`
      : params.postcode || "";
    if (key === lastStoresFetchRef.current) return;
    lastStoresFetchRef.current = key;

    try {
      const searchParams = new URLSearchParams();
      if (params.lat !== undefined)
        searchParams.set("lat", String(params.lat));
      if (params.lng !== undefined)
        searchParams.set("lng", String(params.lng));
      if (params.postcode) searchParams.set("postcode", params.postcode);

      const res = await fetch(`/api/stores?${searchParams}`);
      const data = await res.json();

      if (!res.ok) return;

      setNearbyStores(data.stores);
      if (data.userLocation?.postcode) {
        setPostcode(data.userLocation.postcode);
      }
      if (data.userLocation?.lat) {
        setUserCoords({
          lat: data.userLocation.lat,
          lng: data.userLocation.lng,
        });
      }
    } catch {
      // Non-fatal: product results still display with generic maps links
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    fetchResults(query);

    // Fetch nearby stores in parallel if location is available
    if (userCoords) {
      fetchNearbyStores({ lat: userCoords.lat, lng: userCoords.lng });
    } else if (postcode.trim()) {
      fetchNearbyStores({ postcode: postcode.trim() });
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        fetchNearbyStores({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => {
        alert("Unable to get your location. Please enter your postcode.");
        setLocating(false);
      }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-green-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xl font-bold text-green-800">
              Fresh Finder
            </span>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-gray-600 sm:flex">
            <a href="#" className="transition-colors hover:text-green-700">
              About
            </a>
            <a href="#" className="transition-colors hover:text-green-700">
              How it Works
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-4">
        <section className="py-16 text-center sm:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Fresh
            <span className="text-green-600"> Finder</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-gray-500">
            Find the cheapest groceries near you
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-xl space-y-4"
          >
            {/* Search bar */}
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search for a grocery item (e.g. "full cream milk 2L")'
                disabled={loading}
                className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-lg shadow-sm transition-shadow placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-50"
              />
            </div>

            {/* Location section */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Postcode (e.g. 2000)"
                  maxLength={4}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-base shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locating}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {locating ? (
                  <svg
                    className="h-4 w-4 animate-spin text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {locating ? "Locating..." : "Use my location"}
              </button>
            </div>

            {/* Search button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Searching stores..." : "Compare Prices"}
            </button>
          </form>

          {/* Quick suggestions */}
          {!results && !loading && (
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-400">Try:</span>
              {[
                "full cream milk 2L",
                "free range eggs",
                "sliced bread",
                "bananas",
                "chicken breast",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    fetchResults(item);
                    if (userCoords) {
                      fetchNearbyStores({
                        lat: userCoords.lat,
                        lng: userCoords.lng,
                      });
                    } else if (postcode.trim()) {
                      fetchNearbyStores({ postcode: postcode.trim() });
                    }
                  }}
                  className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Loading indicator */}
        {loading && (
          <section className="pb-20 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-6 py-4 shadow-sm">
              <svg
                className="h-5 w-5 animate-spin text-green-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-gray-600">
                Searching Woolworths, Coles & Aldi...
              </span>
            </div>
          </section>
        )}

        {/* Results */}
        {results && !loading && (
          <section className="pb-20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Results for &ldquo;{searchedQuery}&rdquo;
                {postcode && (
                  <span className="ml-2 text-base font-normal text-gray-400">
                    near {postcode}
                  </span>
                )}
              </h2>
              <button
                onClick={() => {
                  setResults(null);
                  setQuery("");
                  setSearchedQuery("");
                  setSearchErrors([]);
                  setNearbyStores(null);
                  lastStoresFetchRef.current = "";
                }}
                className="text-sm font-medium text-green-600 transition-colors hover:text-green-800"
              >
                Clear results
              </button>
            </div>

            {searchErrors.length > 0 && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Some stores could not be reached. Showing available results.
              </div>
            )}

            {results.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">
                  No results found. Try a different search term.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {results.map((result, i) => {
                  const nearbyStore = nearbyStores?.find(
                    (s) =>
                      s.store.toLowerCase() === result.store.toLowerCase()
                  );
                  return (
                    <StoreCard
                      key={`${result.store}-${i}`}
                      result={{
                        ...result,
                        mapsUrl: nearbyStore?.mapsUrl,
                      }}
                      cheapest={i === 0 && result.price > 0}
                      nearbyStore={nearbyStore}
                    />
                  );
                })}
              </div>
            )}

            <p className="mt-8 text-center text-sm text-gray-400">
              Prices scraped live from store websites. Results may vary.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-gray-400 sm:flex-row sm:justify-between">
          <p>&copy; 2026 Fresh Finder. All rights reserved.</p>
          <p>Made in Australia</p>
        </div>
      </footer>
    </div>
  );
}
