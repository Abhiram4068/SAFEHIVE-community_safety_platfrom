import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;
    //  console.log("Access token:", access ? "Found" : "Not found"); 
    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // console.log(access)
    // console.log(body)

    const res = await axios.post(
      "http://127.0.0.1:8000/api/post/",
      body,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(res.data);
    
  } catch (error: any) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: error.response?.data || "Failed to create post" },
      { status: error.response?.status || 500 }
    );
  }
}