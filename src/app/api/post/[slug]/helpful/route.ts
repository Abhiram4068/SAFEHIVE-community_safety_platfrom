import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const POST_SERVICE_URL = "http://127.0.0.1:8000";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Next.js 15 requires awaiting params, and your folder is named [slug]
  const { slug } = await params;
  const postId = slug; 
  
  if (!postId || postId === 'undefined') {
    console.error("Invalid postId received:", postId);
    return NextResponse.json(
      { error: "Invalid post ID" },
      { status: 400 }
    );
  }
  
  // Fetch cookies from the current request
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  console.log("Access token kkkkkkk:", !!access);

  if (!access) {
    return NextResponse.json(
      { error: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  try {
    
    
    // Forward the request with the cookies in the headers
    const response = await axios.patch(
      `${POST_SERVICE_URL}/api/post/${postId}/helpful/`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    console.log("Django response:", response.data);

    // Return the backend response to your frontend
    return NextResponse.json(response.data, { status: response.status });
    
  } catch (error: any) {
    console.error(`Save Proxy Error [Post ${postId}]:`, error.response?.data || error.message);

    return NextResponse.json(
      { error: error.response?.data || "Failed to communicate with post service" },
      { status: error.response?.status || 500 }
    );
  }
}