import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // 1️⃣ Read data from frontend
    const data = await request.json();
    console.log("Register data:", data);

    // 2️⃣ Send data to Django register API
    const djangoRes = await axios.post(
      "http://127.0.0.1:8007/auth/register/",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 3️⃣ Send success response to frontend
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: djangoRes.data,
      },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data ||
          "Registration failed",
      },
      { status: 400 }
    );
  }
}
