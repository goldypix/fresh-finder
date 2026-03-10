import { NextRequest, NextResponse } from "next/server";

interface StoreLocation {
  name: string;
  brand: "Woolworths" | "Coles" | "Aldi";
  address: string;
  suburb: string;
  postcode: string;
}

// Mock store locations indexed by postcode prefix (first 2 digits)
const storesByRegion: Record<string, StoreLocation[]> = {
  "20": [
    { name: "Woolworths Metro Sydney CBD", brand: "Woolworths", address: "270 George St", suburb: "Sydney", postcode: "2000" },
    { name: "Coles Sydney Central", brand: "Coles", address: "436 George St", suburb: "Sydney", postcode: "2000" },
    { name: "Aldi Pyrmont", brand: "Aldi", address: "31 Pyrmont Bridge Rd", suburb: "Pyrmont", postcode: "2009" },
  ],
  "30": [
    { name: "Woolworths Melbourne CBD", brand: "Woolworths", address: "171 Bourke St", suburb: "Melbourne", postcode: "3000" },
    { name: "Coles Melbourne Central", brand: "Coles", address: "211 La Trobe St", suburb: "Melbourne", postcode: "3000" },
    { name: "Aldi Docklands", brand: "Aldi", address: "888 Collins St", suburb: "Docklands", postcode: "3008" },
  ],
  "40": [
    { name: "Woolworths Brisbane City", brand: "Woolworths", address: "333 Adelaide St", suburb: "Brisbane", postcode: "4000" },
    { name: "Coles Myer Centre Brisbane", brand: "Coles", address: "91 Queen St", suburb: "Brisbane", postcode: "4000" },
    { name: "Aldi Fortitude Valley", brand: "Aldi", address: "680 Ann St", suburb: "Fortitude Valley", postcode: "4006" },
  ],
  "50": [
    { name: "Woolworths Rundle Mall", brand: "Woolworths", address: "136 Rundle Mall", suburb: "Adelaide", postcode: "5000" },
    { name: "Coles Adelaide City", brand: "Coles", address: "12 Grenfell St", suburb: "Adelaide", postcode: "5000" },
    { name: "Aldi Prospect", brand: "Aldi", address: "149 Main North Rd", suburb: "Prospect", postcode: "5082" },
  ],
  "60": [
    { name: "Woolworths Perth City", brand: "Woolworths", address: "200 Murray St", suburb: "Perth", postcode: "6000" },
    { name: "Coles Hay Street Perth", brand: "Coles", address: "625 Hay St", suburb: "Perth", postcode: "6000" },
    { name: "Aldi Victoria Park", brand: "Aldi", address: "321 Albany Hwy", suburb: "Victoria Park", postcode: "6100" },
  ],
};

const defaultStores: StoreLocation[] = [
  { name: "Woolworths", brand: "Woolworths", address: "Your local store", suburb: "", postcode: "" },
  { name: "Coles", brand: "Coles", address: "Your local store", suburb: "", postcode: "" },
  { name: "Aldi", brand: "Aldi", address: "Your local store", suburb: "", postcode: "" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get("postcode") ?? "";

  const regionKey = postcode.slice(0, 2);
  const stores = storesByRegion[regionKey] ?? defaultStores;

  return NextResponse.json({ stores, postcode });
}
