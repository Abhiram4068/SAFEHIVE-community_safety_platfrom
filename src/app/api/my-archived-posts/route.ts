import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
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
    const response = await axios.get(
"http://localhost:8003/api/my-archived-posts/",

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

    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch archived posts" },
      { status: error.response?.status || 500 }
    );
  }
}
