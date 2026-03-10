import { StoreResult } from "@/data/mockData";

function StoreLogo({ store }: { store: string }) {
  if (store === "Woolworths") {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-[#125F30]">
        <svg viewBox="0 0 56 56" className="h-14 w-14" aria-label="Woolworths">
          <rect width="56" height="56" fill="#125F30" rx="12" />
          {/* Stylised W mark */}
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="26"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="-2"
          >
            W
          </text>
        </svg>
      </div>
    );
  }

  if (store === "Coles") {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-[#E01A22]">
        <svg viewBox="0 0 56 56" className="h-14 w-14" aria-label="Coles">
          <rect width="56" height="56" fill="#E01A22" rx="12" />
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="0.5"
          >
            COLES
          </text>
        </svg>
      </div>
    );
  }

  if (store === "Aldi") {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-[#00205B]">
        <svg viewBox="0 0 56 56" className="h-14 w-14" aria-label="Aldi">
          <rect width="56" height="56" fill="#00205B" rx="12" />
          <text
            x="50%"
            y="42%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="1"
          >
            aldi
          </text>
          {/* Coloured stripe accent */}
          <rect x="14" y="33" width="28" height="3" rx="1.5" fill="#E30613" />
          <rect x="14" y="38" width="28" height="3" rx="1.5" fill="#FFCD00" />
        </svg>
      </div>
    );
  }

  // Fallback
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
      style={{ backgroundColor: "#6b7280" }}
    >
      {store[0]}
    </div>
  );
}

export default function StoreCard({
  result,
  cheapest,
  postcode,
}: {
  result: StoreResult;
  cheapest: boolean;
  postcode?: string;
}) {
  const isAldi = result.store === "Aldi";
  const hasPrice = result.price > 0;

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    result.mapsQuery + (postcode ? ` near ${postcode}` : "")
  )}`;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        cheapest
          ? "border-green-400 ring-2 ring-green-100"
          : "border-gray-200"
      }`}
    >
      {cheapest && (
        <span className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          🏆 Cheapest
        </span>
      )}

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Product emoji */}
        <div className="mb-4 flex items-center justify-center">
          <span className="text-5xl" role="img" aria-label={result.item}>
            {result.imageEmoji}
          </span>
        </div>

        {/* Store logo + info + price */}
        <div className="flex items-start gap-4">
          <StoreLogo store={result.store} />

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{result.store}</h3>
            <p className="mt-0.5 text-sm leading-snug text-gray-500">{result.item}</p>
          </div>

          <div className="text-right">
            {hasPrice ? (
              <p className="text-2xl font-bold text-green-700">
                ${result.price.toFixed(2)}
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-400">—</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          {isAldi ? (
            <a
              href={result.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#00205B] px-4 py-2.5 text-sm font-medium text-[#00205B] transition-colors hover:bg-blue-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View at Aldi
            </a>
          ) : (
            <a
              href={result.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Buy Online
            </a>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find in Maps
          </a>
        </div>
      </div>
    </div>
  );
}
