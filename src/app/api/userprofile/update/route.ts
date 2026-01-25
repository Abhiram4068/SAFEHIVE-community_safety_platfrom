import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request
) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  console.log(access)
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await req.formData();


  try {

    const res = await axios.put(
        
      `http://127.0.0.1:8012/api/profile/me/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return NextResponse.json(
      { message: "Profile Updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile update error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to update Profile" },
      { status: 500 }
    );
  }
}
