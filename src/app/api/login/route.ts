import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {

    const body = await req.json();


    const djangoRes = await axios.post(
      "http://localhost:8007/auth/login/",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { access, refresh } = djangoRes.data;

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // 4️⃣ Set cookies 
    response.cookies.set("access", access, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
       maxAge: 60 * 15, 
    });

    response.cookies.set("refresh", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
       maxAge: 60 * 60 * 24 * 7,
    });
    console.log(response)
    

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.response?.data?.detail ||
          "Invalid username or password",
      },
      { status: 401 }
    );
  }
}

