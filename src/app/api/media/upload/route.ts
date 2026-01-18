import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const res = await axios.post(
      "http://127.0.0.1:8001/media/upload/",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return NextResponse.json(res.data);
    
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.response?.data || "Failed to upload image" },
      { status: error.response?.status || 500 }
    );
  }
}