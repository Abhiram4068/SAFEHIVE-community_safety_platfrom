import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8002/api/announcements/`
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch platform announcements' },
      { status: 500 }
    );
  }
}