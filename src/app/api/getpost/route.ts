import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

const POST_SERVICE_URL = "http://127.0.0.1:8000";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = await axios.get(
      `${POST_SERVICE_URL}/api/post/all/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
