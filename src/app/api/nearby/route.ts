import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 🔥 REQUIRED

export async function GET(req: Request) {
  const cookieStore = await cookies(); 
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");

  const res = await axios.get(
    "http://127.0.0.1:8000/api/posts/nearby/",
    {
      params: { lat, lng, radius },
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );

  return NextResponse.json(res.data);
}
