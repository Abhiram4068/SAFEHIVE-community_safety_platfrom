import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  try {
    const { id } = await params; // ✅ await params

    console.log("API ID:", id);

    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;

    const body = await req.json();
    console.log("BODY:", body);

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await axios.post(
      `http://127.0.0.1:8005/api/group/${id}/announcements/create/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Announcement error:", error.response?.data || error);

    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: error.response?.status || 500 }
    );
  }
}