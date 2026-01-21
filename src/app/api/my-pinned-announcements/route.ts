import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {


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
"http://localhost:8003/api/my-pinned-announcements/",

      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log(response.data)
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
