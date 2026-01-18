import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }  // params is now a Promise
) {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params first!
    const { slug } = await params;
    const postId = parseInt(slug);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const res = await axios.patch(
      `http://127.0.0.1:8000/api/posts/${postId}/helpful/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(res.data);

  } catch (error: any) {
    console.error("Backend error:", error.response?.data);
    return NextResponse.json(
      { error: error.response?.data || "Failed to toggle helpful" },
      { status: error.response?.status || 500 }
    );
  }
}