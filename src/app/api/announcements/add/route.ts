import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1️⃣ Read body
    const body = await req.json();

    // 2️⃣ Read access token from cookies
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ Forward request to backend
    const response = await axios.post(
      "http://127.0.0.1:8003/api/announcements/add",
      body,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 4️⃣ Return backend response
    return NextResponse.json(response.data, {
      status: response.status,
    });

  } catch (error: any) {
    console.error(
      "Announcement Add Proxy Error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: error.response?.data || "Failed to add announcement" },
      { status: error.response?.status || 500 }
    );
  }
}
