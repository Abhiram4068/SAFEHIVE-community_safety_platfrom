import { NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8002/api/frequentcat/";

export async function GET() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fresh data
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch frequent categories" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("FrequentCat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
