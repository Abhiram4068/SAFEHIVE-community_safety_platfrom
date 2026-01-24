import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ✅ Read JSON body from frontend
    const body = await request.json();

    const backendResponse = await axios.post(
      "http://127.0.0.1:8008/api/comment/",
      body,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(
      backendResponse.data,
      { status: 201 }
    );

  } catch (error: any) {
    console.error(
      "Comment creation error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: error.response?.data || "Backend communication failed" },
      { status: error.response?.status || 500 }
    );
  }
}
