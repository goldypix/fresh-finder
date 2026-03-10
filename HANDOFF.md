# Fresh Finder — Handoff Summary

## What Is It

Fresh Finder is an Australian grocery price comparison app built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. Users search for a grocery item (e.g. "full cream milk 2L") and get live prices from Woolworths, Coles, and Aldi sorted cheapest-first, with links to buy online and get directions to the nearest store.

## Tech Stack

- **Framework:** Next.js 16.1.6, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Hosting:** Render (free tier), auto-deploys from `main` branch
- **DNS:** Cloudflare (goldy.xyz zone)
- **Repo:** github.com/goldypix/fresh-finder

## What Works

### Live Grocery Scraping (`/api/search?q=...`)

- **Woolworths** — Hits their internal JSON API (`/apis/ui/v2/Search/products`). Returns up to 5 results with name, price, image, and product URL. Uses `flatMap` across product groups to handle their nested response format.
- **Coles** — Fetches the SSR HTML search page and extracts product data from the `__NEXT_DATA__` script tag. Returns up to 5 results with name, price, image, and product URL.
- **Aldi** — No API available. Returns a static placeholder card linking to aldi.com.au/specials.
- All three run in parallel via `Promise.allSettled` so one failing doesn't block the others. Results are sorted by price ascending, with Aldi appended at the end.

### Location-Aware Store Finding (`/api/stores?lat=...&lng=...&postcode=...`)

- Accepts lat/lng coordinates, a postcode, or both.
- Uses Google Maps Geocoding API to convert between postcode and coordinates.
- Uses Google Maps Places API (New, Text Search) to find the nearest Woolworths and Coles within 10km.
- Returns store name, address, distance (haversine), and a Google Maps directions deep link for each.
- Aldi gets a generic Maps search URL (no Places API call to save quota).

### Frontend (`src/app/page.tsx`)

- Search bar with quick-suggestion chips ("full cream milk 2L", "free range eggs", etc.).
- Postcode input field for manual location entry.
- "Use my location" button using the browser Geolocation API.
- Product search and store-finding run in parallel on submit.
- Result cards show store logo, product name, price, product image, "Buy Online" link, and "Find in Maps" button.
- "Find in Maps" deep-links to Google Maps directions to the nearest specific store when location is available, falling back to a generic Maps search.
- Distance shown on each card (e.g. "Woolworths Bondi Junction · 1.2 km away").

### Deployment

- **Render URL:** https://fresh-finder-1.onrender.com (live, working)
- **Custom domain:** freshfinder.goldy.xyz (CNAME record added in Cloudflare, Render verification pending — should resolve within minutes)
- **Auto-deploy:** On commit to `main` branch on GitHub
- **Free tier:** 512 MB RAM, 0.1 CPU. Instance spins down after inactivity (~50s cold start).

## What Does Not Work Yet

1. **`GOOGLE_MAPS_API_KEY` not set on Render.** The `.env.local` file has an empty placeholder. The store-finding features (`/api/stores`) will return a 500 error in production until the key is added as an environment variable in Render's dashboard (Settings > Environment).

2. **Aldi has no real price data.** Aldi doesn't expose a public API or scrapeable search page. The app shows a static "Check your local Aldi" card with price `$0` (displayed as "—"). This is by design for now.

3. **Coles scraper is fragile.** It relies on Coles serving `__NEXT_DATA__` in their SSR HTML. Coles may rate-limit or serve a bot-detection page ("Pardon Our Interruption"), causing the scraper to return an error. This happens intermittently, especially on Render's shared IP range.

4. **Custom domain SSL.** The `freshfinder.goldy.xyz` CNAME record was just created. Render needs to verify DNS and issue an SSL certificate. The DNS resolves correctly (confirmed via `dig`) but Render's dashboard still shows "Waiting for DNS". Should auto-resolve shortly.

5. **No tests.** There are no unit or integration tests.

6. **Mock data still in codebase.** `src/data/mockData.ts` contains hardcoded mock results from the initial commit. It's no longer used by the search flow (which uses live scrapers) but is still imported for the `StoreResult` type interface. Could be cleaned up.

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Main frontend — search form, location flow, result rendering |
| `src/app/api/search/route.ts` | GET `/api/search?q=` — orchestrates scrapers |
| `src/app/api/stores/route.ts` | GET `/api/stores?lat=&lng=&postcode=` — finds nearest stores |
| `src/lib/scraper/woolworths.ts` | Woolworths API scraper |
| `src/lib/scraper/coles.ts` | Coles SSR HTML scraper |
| `src/lib/scraper/aldi.ts` | Aldi static placeholder |
| `src/lib/scraper/index.ts` | `searchGroceries()` — parallel scrape orchestrator |
| `src/lib/scraper/types.ts` | `ScrapedProduct`, `ScrapeResult` types |
| `src/lib/stores/google.ts` | Google Maps API helpers (geocode, places, haversine) |
| `src/lib/stores/types.ts` | `NearbyStore`, `StoresApiResponse` types |
| `src/components/StoreCard.tsx` | Result card component with Maps deep link |
| `src/data/mockData.ts` | Legacy mock data + `StoreResult` interface |
| `.claude/launch.json` | Dev server config (port 3001) |

## What the Next Session Should Pick Up

1. **Add `GOOGLE_MAPS_API_KEY` to Render.** Go to dashboard.render.com > fresh-finder-1 > Environment and add the key. This unblocks the store-finding feature in production.

2. **Verify `freshfinder.goldy.xyz` is live.** Check Render's Custom Domains settings — it should show "Verified" with a valid certificate by now. If still pending, check that the Cloudflare CNAME is set to "DNS only" (grey cloud, not orange).

3. **Harden the Coles scraper.** Consider adding retry logic, rotating user-agents, or falling back to a cached result when Coles blocks the request.

4. **Clean up `mockData.ts`.** Extract the `StoreResult` interface to its own types file and remove the unused mock data.

5. **Add Aldi price scraping** if a viable data source is found (e.g. scraping their weekly specials PDF, or a third-party API).

6. **Add tests.** At minimum, unit tests for the scrapers and the haversine distance function.

7. **Consider mobile responsiveness.** The UI uses Tailwind responsive classes but hasn't been thoroughly tested on small screens.
