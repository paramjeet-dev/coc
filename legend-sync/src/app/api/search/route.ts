import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { searchClans, searchPlayers } from "@/lib/api/endpoints";

/** Proxy for client-side search so the browser never calls the ClashKing API directly. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") === "clan" ? "clan" : "player";
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 3) return NextResponse.json({ items: [] });

  try {
    const result =
      kind === "clan"
        ? await searchClans(q, 8, request.signal)
        : await searchPlayers(q, 8, request.signal);
    return NextResponse.json({ items: result.items });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 502;
    return NextResponse.json({ items: [], error: "search_failed" }, { status });
  }
}
