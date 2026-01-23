import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 

    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await axios.delete(
      `http://127.0.0.1:8005/api/group/post/${id}/delete/`,
 
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
      { error: "Failed to delete post" },
      { status: error.response?.status || 500 }
    );
  }
}