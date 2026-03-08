export interface StoreResult {
  store: string;
  logoColor: string;
  item: string;
  price: number;
  onlineUrl: string;
  mapsQuery: string;
  imageUrl?: string;
  mapsUrl?: string;
}

const mockResults: Record<string, StoreResult[]> = {
  milk: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Farmdale Full Cream Milk 2L",
      price: 2.09,
      onlineUrl: "#",
      mapsQuery: "Aldi",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Full Cream Milk 2L",
      price: 2.5,
      onlineUrl: "#",
      mapsQuery: "Coles",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Full Cream Milk 2L",
      price: 2.6,
      onlineUrl: "#",
      mapsQuery: "Woolworths",
    },
  ],
  eggs: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Lodge Farms Free Range Eggs 12pk",
      price: 4.99,
      onlineUrl: "#",
      mapsQuery: "Aldi",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Free Range Eggs 12pk",
      price: 5.5,
      onlineUrl: "#",
      mapsQuery: "Woolworths",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Free Range Eggs 12pk",
      price: 5.7,
      onlineUrl: "#",
      mapsQuery: "Coles",
    },
  ],
  bread: [
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles Soft White Bread 700g",
      price: 1.8,
      onlineUrl: "#",
      mapsQuery: "Coles",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Soft White Bread 700g",
      price: 1.9,
      onlineUrl: "#",
      mapsQuery: "Woolworths",
    },
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Baker's Life White Bread 700g",
      price: 1.95,
      onlineUrl: "#",
      mapsQuery: "Aldi",
    },
  ],
  bananas: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Bananas per kg",
      price: 2.99,
      onlineUrl: "#",
      mapsQuery: "Aldi",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Cavendish Bananas per kg",
      price: 3.5,
      onlineUrl: "#",
      mapsQuery: "Woolworths",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Cavendish Bananas per kg",
      price: 3.9,
      onlineUrl: "#",
      mapsQuery: "Coles",
    },
  ],
  chicken: [
    {
      store: "Aldi",
      logoColor: "#00205B",
      item: "Chicken Breast Fillets 1kg",
      price: 9.99,
      onlineUrl: "#",
      mapsQuery: "Aldi",
    },
    {
      store: "Coles",
      logoColor: "#E01A22",
      item: "Coles RSPCA Chicken Breast 1kg",
      price: 11.0,
      onlineUrl: "#",
      mapsQuery: "Coles",
    },
    {
      store: "Woolworths",
      logoColor: "#125F30",
      item: "Woolworths Chicken Breast 1kg",
      price: 11.5,
      onlineUrl: "#",
      mapsQuery: "Woolworths",
    },
  ],
};

const defaultResults: StoreResult[] = [
  {
    store: "Aldi",
    logoColor: "#00205B",
    item: "Item not found — showing placeholder",
    price: 3.49,
    onlineUrl: "#",
    mapsQuery: "Aldi",
  },
  {
    store: "Coles",
    logoColor: "#E01A22",
    item: "Item not found — showing placeholder",
    price: 3.99,
    onlineUrl: "#",
    mapsQuery: "Coles",
  },
  {
    store: "Woolworths",
    logoColor: "#125F30",
    item: "Item not found — showing placeholder",
    price: 4.29,
    onlineUrl: "#",
    mapsQuery: "Woolworths",
  },
];

export function getResults(query: string, postcode: string): StoreResult[] {
  const key = query.toLowerCase().trim();
  const results = mockResults[key] || defaultResults;
  return [...results].sort((a, b) => a.price - b.price);
}
