import { ScrapedProduct, ScrapeResult } from "./types";

const STORE = "Woolworths";
const LOGO_COLOR = "#125F30";
const BASE_URL = "https://www.woolworths.com.au";
const API_URL = `${BASE_URL}/apis/ui/v2/Search/products`;
const MAX_RESULTS = 5;

interface WoolworthsProduct {
  Stockcode: number;
  Name: string;
  DisplayName: string;
  UrlFriendlyName: string;
  Price: number;
  MediumImageFile: string;
  LargeImageFile: string;
  IsInStock: boolean;
}

interface WoolworthsResponse {
  Products: Array<{
    Products: WoolworthsProduct[];
  }>;
}

export async function scrapeWoolworths(
  query: string
): Promise<ScrapeResult> {
  try {
    const url = `${API_URL}?searchTerm=${encodeURIComponent(query)}&pageSize=${MAX_RESULTS}&sortBy=TraderRelevance`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        products: [],
        error: `Woolworths: HTTP ${response.status}`,
      };
    }

    const data: WoolworthsResponse = await response.json();

    const products: ScrapedProduct[] = [];
    // Each product is in its own group: Products[n].Products[0]
    const allProducts = (data.Products || []).flatMap(
      (group) => group.Products || []
    );

    for (const p of allProducts.slice(0, MAX_RESULTS)) {
      if (!p.Price || !p.IsInStock) continue;

      products.push({
        store: STORE,
        logoColor: LOGO_COLOR,
        name: p.DisplayName || p.Name,
        price: p.Price,
        productUrl: `${BASE_URL}/shop/productdetails/${p.Stockcode}/${p.UrlFriendlyName}`,
        imageUrl: p.MediumImageFile || p.LargeImageFile || "",
        mapsQuery: STORE,
      });
    }

    return { products };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Woolworths error";
    console.error(`Woolworths scraper failed: ${message}`);
    return { products: [], error: `Woolworths: ${message}` };
  }
}
