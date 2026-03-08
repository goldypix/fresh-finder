import { ScrapedProduct, ScrapeResult } from "./types";

const STORE = "Coles";
const LOGO_COLOR = "#E01A22";
const BASE_URL = "https://www.coles.com.au";
const SEARCH_URL = `${BASE_URL}/search?q=`;
const IMAGE_BASE = "https://productimages.coles.com.au/productimages";
const MAX_RESULTS = 5;

interface ColesProduct {
  id: number;
  name: string;
  brand: string;
  size: string;
  availability: boolean;
  imageUris: Array<{ uri: string }>;
  pricing: {
    now: number;
  };
  _type: string;
}

export async function scrapeColes(query: string): Promise<ScrapeResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `${SEARCH_URL}${encodeURIComponent(query)}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-AU,en-US;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          "Cache-Control": "max-age=0",
        },
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        products: [],
        error: `Coles: HTTP ${response.status}`,
      };
    }

    const html = await response.text();

    // Extract __NEXT_DATA__ from the SSR HTML
    const match = html.match(
      /<script id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/
    );
    if (!match) {
      // Check if we got a bot detection page
      const isBotBlock =
        html.includes("Pardon Our Interruption") ||
        html.includes("bot") ||
        html.includes("captcha");
      return {
        products: [],
        error: isBotBlock
          ? "Coles: Temporarily rate-limited"
          : "Coles: Could not find product data in page",
      };
    }

    const nextData = JSON.parse(match[1]);
    const searchResults = nextData.props?.pageProps?.searchResults;

    if (!searchResults?.results) {
      return {
        products: [],
        error: "Coles: No search results found",
      };
    }

    const products: ScrapedProduct[] = [];

    for (const p of searchResults.results as ColesProduct[]) {
      if (p._type !== "PRODUCT" || !p.availability) continue;
      if (!p.pricing?.now || p.pricing.now <= 0) continue;

      const imageUri = p.imageUris?.[0]?.uri || "";
      const imageUrl = imageUri ? `${IMAGE_BASE}${imageUri}` : "";

      const slug = `${p.brand}-${p.name}-${p.size}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      products.push({
        store: STORE,
        logoColor: LOGO_COLOR,
        name: `${p.brand} ${p.name} | ${p.size}`,
        price: p.pricing.now,
        productUrl: `${BASE_URL}/product/${slug}-${p.id}`,
        imageUrl,
        mapsQuery: STORE,
      });

      if (products.length >= MAX_RESULTS) break;
    }

    return { products };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Coles error";
    console.error(`Coles scraper failed: ${message}`);
    return { products: [], error: `Coles: ${message}` };
  }
}
