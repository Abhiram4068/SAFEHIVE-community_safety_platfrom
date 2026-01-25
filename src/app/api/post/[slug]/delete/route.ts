import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = params.id;

  try {

    const res = await axios.delete(
        
      `http://127.0.0.1:8000/api/post/${postId}/delete/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete post error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
