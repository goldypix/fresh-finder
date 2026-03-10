import { NextRequest, NextResponse } from "next/server";
import { getResults } from "@/data/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const postcode = searchParams.get("postcode") ?? "";

  if (!q.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  // Simulate network latency so the loading state is visible during demo
  await new Promise((resolve) => setTimeout(resolve, 350));

  const results = getResults(q, postcode);
  return NextResponse.json({ results, query: q.trim(), postcode });
}
