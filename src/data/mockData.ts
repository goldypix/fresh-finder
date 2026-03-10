export interface StoreResult {
  store: string;
  logoColor: string;
  item: string;
  price: number;
  onlineUrl: string;
  mapsQuery: string;
  imageEmoji: string;
}

const mockResults: Record<string, StoreResult[]> = {
  milk: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Farmdale Full Cream Milk 2L",
      price: 2.09,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🥛",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Full Cream Milk 2L",
      price: 2.5,
      onlineUrl: "https://www.coles.com.au/search?q=full+cream+milk+2L",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🥛",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Full Cream Milk 2L",
      price: 2.6,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=full+cream+milk+2L",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🥛",
    },
  ],
  eggs: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Lodge Farms Free Range Eggs 12pk",
      price: 4.99,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🥚",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Free Range Eggs 12pk",
      price: 5.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=free+range+eggs+12pk",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🥚",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Free Range Eggs 12pk",
      price: 5.7,
      onlineUrl: "https://www.coles.com.au/search?q=free+range+eggs+12pk",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🥚",
    },
  ],
  bread: [
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Soft White Bread 700g",
      price: 1.8,
      onlineUrl: "https://www.coles.com.au/search?q=soft+white+bread+700g",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🍞",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Soft White Bread 700g",
      price: 1.9,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=soft+white+bread+700g",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🍞",
    },
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Baker's Life White Bread 700g",
      price: 1.95,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🍞",
    },
  ],
  bananas: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Bananas per kg",
      price: 2.99,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🍌",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Cavendish Bananas per kg",
      price: 3.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=bananas+per+kg",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🍌",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Cavendish Bananas per kg",
      price: 3.9,
      onlineUrl: "https://www.coles.com.au/search?q=bananas+per+kg",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🍌",
    },
  ],
  chicken: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Chicken Breast Fillets 1kg",
      price: 9.99,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🍗",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles RSPCA Chicken Breast 1kg",
      price: 11.0,
      onlineUrl:
        "https://www.coles.com.au/search?q=chicken+breast+fillets+1kg",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🍗",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Chicken Breast 1kg",
      price: 11.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=chicken+breast+1kg",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🍗",
    },
  ],
  butter: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Beautifully Butterfully Unsalted 250g",
      price: 2.79,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🧈",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Unsalted Butter 250g",
      price: 3.5,
      onlineUrl: "https://www.coles.com.au/search?q=unsalted+butter+250g",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🧈",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Unsalted Butter 250g",
      price: 3.7,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=unsalted+butter+250g",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🧈",
    },
  ],
  cheese: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Emporium Selection Tasty Cheese 500g",
      price: 5.49,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🧀",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Tasty Cheese 500g",
      price: 6.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=tasty+cheese+500g",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🧀",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Tasty Shredded Cheese 500g",
      price: 6.8,
      onlineUrl: "https://www.coles.com.au/search?q=tasty+cheese+500g",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🧀",
    },
  ],
  apples: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Pink Lady Apples per kg",
      price: 3.49,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🍎",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Pink Lady Apples per kg",
      price: 4.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=pink+lady+apples",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🍎",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Pink Lady Apples per kg",
      price: 4.9,
      onlineUrl: "https://www.coles.com.au/search?q=pink+lady+apples",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🍎",
    },
  ],
  rice: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Asia Specialities Long Grain Rice 5kg",
      price: 6.49,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🍚",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Long Grain White Rice 5kg",
      price: 8.0,
      onlineUrl:
        "https://www.coles.com.au/search?q=long+grain+white+rice+5kg",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🍚",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Long Grain Rice 5kg",
      price: 8.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=long+grain+rice+5kg",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🍚",
    },
  ],
  pasta: [
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Penne Pasta 500g",
      price: 1.3,
      onlineUrl: "https://www.coles.com.au/search?q=penne+pasta+500g",
      mapsQuery: "Coles supermarket",
      imageEmoji: "🍝",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Penne Pasta 500g",
      price: 1.5,
      onlineUrl:
        "https://www.woolworths.com.au/shop/search/products?searchTerm=penne+pasta+500g",
      mapsQuery: "Woolworths supermarket",
      imageEmoji: "🍝",
    },
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Remano Penne Pasta 500g",
      price: 1.59,
      onlineUrl: "https://www.aldi.com.au/en/groceries/",
      mapsQuery: "Aldi supermarket",
      imageEmoji: "🍝",
    },
  ],
};

const defaultResults: StoreResult[] = [
  {
    store: "Aldi",
    logoColor: "#00205B",
    item: "Check in store for pricing",
    price: 0,
    onlineUrl: "https://www.aldi.com.au/en/groceries/",
    mapsQuery: "Aldi supermarket",
    imageEmoji: "🛒",
  },
  {
    store: "Coles",
    logoColor: "#E01A22",
    item: "Check in store for pricing",
    price: 0,
    onlineUrl: "https://www.coles.com.au/search",
    mapsQuery: "Coles supermarket",
    imageEmoji: "🛒",
  },
  {
    store: "Woolworths",
    logoColor: "#125F30",
    item: "Check in store for pricing",
    price: 0,
    onlineUrl: "https://www.woolworths.com.au/shop/search/products",
    mapsQuery: "Woolworths supermarket",
    imageEmoji: "🛒",
  },
];

export function getResults(query: string, postcode: string): StoreResult[] {
  const key = query.toLowerCase().trim();
  const results = mockResults[key] || defaultResults;
  return [...results].sort((a, b) => a.price - b.price);
}
