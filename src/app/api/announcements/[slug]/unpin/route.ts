import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const ANNOUNCEMENT_SERVICE_URL = "http://127.0.0.1:8003";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Next.js 15 requires awaiting params
  const { slug } = await params;
  const announcementId = slug;

  if (!announcementId || announcementId === "undefined") {
    return NextResponse.json(
      { error: "Invalid announcement ID" },
      { status: 400 }
    );
  }

  // ✅ cookies() is synchronous
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.patch(
      `${ANNOUNCEMENT_SERVICE_URL}/api/announcements/${announcementId}/pin/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error(
      `Announcement Unpin Proxy Error [${announcementId}]:`,
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        error:
          error.response?.data ||
          "Failed to unpin announcement",
      },
      { status: error.response?.status || 500 }
    );
  }
}
