import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const res = await axios.get(
      `http://127.0.0.1:8005/api/groups/${params.id}/announcements/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Announcements error:", error.response?.data || error);

    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: error.response?.status || 500 }
    );
  }
}
