import { ScrapeResult } from "./types";

const STORE = "Aldi";
const LOGO_COLOR = "#00205B";

export function getAldiResult(): ScrapeResult {
  return {
    products: [
      {
        store: STORE,
        logoColor: LOGO_COLOR,
        name: "Check your local Aldi for competitive pricing",
        price: 0,
        productUrl: "https://www.aldi.com.au/en/specials/",
        imageUrl: "",
        mapsQuery: "Aldi",
      },
    ],
  };
}
