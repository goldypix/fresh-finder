import { NextRequest, NextResponse } from "next/server";
import { searchGroceries } from "@/lib/scraper";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json(
      { error: "Missing required query parameter: q" },
      { status: 400 }
    );
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length > 100) {
    return NextResponse.json(
      { error: "Query too long (max 100 characters)" },
      { status: 400 }
    );
  }

  try {
    const { results, errors } = await searchGroceries(trimmedQuery);

    return NextResponse.json({
      query: trimmedQuery,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
