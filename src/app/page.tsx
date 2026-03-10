"use client";

import { useState, FormEvent } from "react";
import { StoreResult } from "@/data/mockData";
import StoreCard from "@/components/StoreCard";

const SUGGESTIONS = ["milk", "eggs", "bread", "bananas", "chicken", "butter", "cheese", "apples", "rice", "pasta"];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
        </div>
        <div className="h-8 w-16 rounded bg-gray-200" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 flex-1 rounded-xl bg-gray-200" />
        <div className="h-10 flex-1 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [postcode, setPostcode] = useState("");
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StoreResult[] | null>(null);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function runSearch(q: string, pc: string) {
    setLoading(true);
    setError(null);
    setResults(null);
    setSearchedQuery(q.trim());
    try {
      const [searchRes] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(q)}&postcode=${encodeURIComponent(pc)}`),
        fetch(`/api/stores?postcode=${encodeURIComponent(pc)}`),
      ]);
      if (!searchRes.ok) throw new Error("Search failed");
      const { results: data } = await searchRes.json();
      setResults(data);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    runSearch(query, postcode);
  }

  function handleSuggestion(item: string) {
    setQuery(item);
    runSearch(item, postcode);
  }

  function handleClear() {
    setResults(null);
    setError(null);
    setQuery("");
    setSearchedQuery("");
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        // In a real app, reverse-geocode coords to postcode.
        setPostcode("2000");
        setLocating(false);
      },
      () => {
        alert("Unable to get your location. Please enter your postcode.");
        setLocating(false);
      }
    );
  }

  const showResults = results !== null;
  const showError = error !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-green-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <span className="text-xl font-bold text-green-800">Fresh Finder</span>
          </button>
          <nav className="hidden gap-6 text-sm font-medium text-gray-600 sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-green-700">
              How it Works
            </a>
            <a
              href="https://www.choice.com.au/food-and-drink"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-green-700"
            >
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero + Search */}
      <main className="mx-auto max-w-5xl px-4">
        <section className="py-14 text-center sm:py-20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 shadow-lg">
            <svg
              className="h-9 w-9 text-white"
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
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Find the cheapest
            <span className="text-green-600"> groceries</span> near you
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-gray-500">
            Compare prices across Woolworths, Coles, and Aldi — instantly.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-xl space-y-4">
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
                placeholder='Search grocery item (e.g. "milk", "eggs", "bread")'
                className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-lg shadow-sm transition-shadow placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

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
                  <svg className="h-4 w-4 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Comparing prices…
                </span>
              ) : (
                "Compare Prices"
              )}
            </button>
          </form>

          {/* Quick suggestions */}
          {!showResults && !loading && (
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-400">Try:</span>
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSuggestion(item)}
                  className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Loading skeletons */}
        {loading && (
          <section className="pb-20">
            <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>
        )}

        {/* Error state */}
        {showError && !loading && (
          <section className="pb-20">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800">Oops, something went wrong</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button
                onClick={() => runSearch(searchedQuery, postcode)}
                className="mt-4 rounded-xl bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          </section>
        )}

        {/* Results */}
        {showResults && !loading && (
          <section className="pb-20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Results for &ldquo;{searchedQuery}&rdquo;
                </h2>
                {postcode && (
                  <p className="mt-0.5 text-sm text-gray-400">
                    Stores near postcode {postcode}
                  </p>
                )}
              </div>
              <button
                onClick={handleClear}
                className="text-sm font-medium text-green-600 transition-colors hover:text-green-800"
              >
                ← New search
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              {results!.map((result, i) => (
                <StoreCard
                  key={result.store}
                  result={result}
                  cheapest={i === 0 && result.price > 0}
                  postcode={postcode}
                />
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
              Prices are indicative and may vary. Always confirm in-store or online.
            </p>
          </section>
        )}

        {/* How It Works */}
        {!showResults && !loading && !showError && (
          <section id="how-it-works" className="pb-24 pt-4">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              How it works
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  icon: (
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "Search",
                  description:
                    "Type any grocery item and enter your postcode or tap 'Use my location' to find stores near you.",
                },
                {
                  step: "2",
                  icon: (
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "Compare",
                  description:
                    "See prices from Woolworths, Coles, and Aldi side by side, sorted from cheapest to most expensive.",
                },
                {
                  step: "3",
                  icon: (
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Save",
                  description:
                    "Buy online or head to the nearest store — and keep more money in your pocket every week.",
                },
              ].map(({ step, icon, title, description }) => (
                <div
                  key={step}
                  className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                    {icon}
                  </div>
                  <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                    {step}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-gray-400 sm:flex-row sm:justify-between">
          <p>&copy; 2026 Fresh Finder. All rights reserved.</p>
          <p>Made with 🌿 in Australia</p>
        </div>
      </footer>
    </div>
  );
}
