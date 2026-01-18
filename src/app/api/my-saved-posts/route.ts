import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await axios.get(
    "http://127.0.0.1:8000/api/my-saved-posts/",
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );

  return NextResponse.json(res.data);
}
