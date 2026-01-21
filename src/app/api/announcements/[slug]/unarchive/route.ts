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
  const postId = slug; // slug contains the announcement ID
  
  console.log("Announcement save route called with slug/postId:", postId);
  
  if (!postId || postId === 'undefined') {
    console.error("Invalid announcement ID received:", postId);
    return NextResponse.json(
      { error: "Invalid announcement ID" },
      { status: 400 }
    );
  }
  
  // Fetch cookies from the current request
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  console.log("Access token found:", !!access);

  if (!access) {
    return NextResponse.json(
      { error: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  try {
    
    
    // Forward the request with the cookies in the headers
    const response = await axios.patch(
      `${ANNOUNCEMENT_SERVICE_URL}/api/announcements/${postId}/unarchive/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    

    // Return the backend response to your frontend
    return NextResponse.json(response.data, { status: response.status });
    
  } catch (error: any) {
    console.error(`Announcement Save Proxy Error [${postId}]:`, error.response?.data || error.message);

    return NextResponse.json(
      { error: error.response?.data || "Failed to communicate with announcement service" },
      { status: error.response?.status || 500 }
    );
  }
}