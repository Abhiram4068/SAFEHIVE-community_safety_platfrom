import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { access } from 'fs';

export async function POST(request: Request) {

    const cookieStore = await cookies();
    const access=cookieStore.get("access")?.value;
    if(!access){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  try {
    // 1. Extract the data sent from the frontend
    const body = await request.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    // 2. (Optional) Get user session/token here
    // Example: const token = request.headers.get('authorization');

    // 3. Forward the request to your Django/Backend server
    // We use the internal URL since the server is performing this action
    const backendResponse = await axios.post(
      `http://127.0.0.1:8005/api/groups/joingroup/${groupId}/`,
      {},
      {
        headers: {
        Authorization: `Bearer ${access}`,
      },
      }, 
      
    );

    // 4. Return the success response back to the frontend
    return NextResponse.json({ 
      success: true, 
      data: backendResponse.data 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Join route error:", error.response?.data || error.message);

    return NextResponse.json(
      { error: "Backend communication failed" },
      { status: error.response?.status || 500 }
    );
  }
}