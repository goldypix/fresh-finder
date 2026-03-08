export interface ScrapedProduct {
  store: string;
  logoColor: string;
  name: string;
  price: number;
  productUrl: string;
  imageUrl: string;
  mapsQuery: string;
}

export interface ScrapeResult {
  products: ScrapedProduct[];
  error?: string;
}
