import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    

    const backendResponse = await axios.post(
      `http://127.0.0.1:8005/api/groups/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json({ 
      success: true, 
      data: backendResponse.data 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Community creation error:", error.response?.data || error.message);

    return NextResponse.json(
      { error: error.response?.data?.message || "Backend communication failed" },
      { status: error.response?.status || 500 }
    );
  }
}