import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ Read multipart form data
    const incomingFormData = await request.formData();

    // ✅ Rebuild FormData for backend
    const backendFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      backendFormData.append(key, value);
    }

    const backendResponse = await axios.post(
      "http://127.0.0.1:8005/api/groups/",
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json(
      { success: true, data: backendResponse.data },
      { status: 201 }
    );

  } catch (error: any) {
    console.error(
      "Community creation error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: error.response?.data || "Backend communication failed" },
      { status: error.response?.status || 500 }
    );
  }
}
