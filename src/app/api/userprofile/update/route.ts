import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // REPLACE THIS URL with your actual Django/Backend URL
    const BACKEND_URL = "http://127.0.0.1:8012/api/profile/me/";

    const backendResponse = await fetch(BACKEND_URL, {
      method: 'PUT',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: formData, // Sending the file to the backend
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}