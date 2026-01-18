import { cookies } from "next/headers";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await axios.get(
      `http://127.0.0.1:8005/api/groups/${params.id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Backend error" },
      { status: err.response?.status || 500 }
    );
  }
}
