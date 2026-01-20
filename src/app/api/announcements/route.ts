import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const ANNOUNCEMENT_SERVICE_URL = "http://127.0.0.1:8003";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  try {
    const response = await axios.get(
      `${ANNOUNCEMENT_SERVICE_URL}/api/announcements/`,
      access ? {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      } : {}
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });

  } catch (error: any) {
    console.error(
      "Announcement Fetch Proxy Error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: error.response?.status || 500 }
    );
  }
}