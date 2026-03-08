import { scrapeWoolworths } from "./woolworths";
import { scrapeColes } from "./coles";
import { getAldiResult } from "./aldi";
import { ScrapedProduct, ScrapeResult } from "./types";

export type { ScrapedProduct, ScrapeResult };

export interface SearchResponse {
  results: ScrapedProduct[];
  errors: string[];
}

export async function searchGroceries(query: string): Promise<SearchResponse> {
  const errors: string[] = [];

  // Run Woolworths (direct API) and Coles (SSR HTML parsing) in parallel
  const [woolworthsResult, colesResult] = await Promise.allSettled([
    scrapeWoolworths(query),
    scrapeColes(query),
  ]);

  let allProducts: ScrapedProduct[] = [];

  if (woolworthsResult.status === "fulfilled") {
    const wr = woolworthsResult.value;
    allProducts.push(...wr.products);
    if (wr.error) errors.push(wr.error);
  } else {
    errors.push(`Woolworths: ${woolworthsResult.reason}`);
  }

  if (colesResult.status === "fulfilled") {
    const cr = colesResult.value;
    allProducts.push(...cr.products);
    if (cr.error) errors.push(cr.error);
  } else {
    errors.push(`Coles: ${colesResult.reason}`);
  }

  // Add Aldi static result
  const aldiProducts = getAldiResult().products;

  // Sort scraped products by price ascending
  allProducts.sort((a, b) => a.price - b.price);

  // Append Aldi at the end (no real price)
  allProducts.push(...aldiProducts);

  return { results: allProducts, errors };
}
