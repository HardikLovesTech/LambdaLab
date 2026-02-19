import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = "https://lambdalab.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Simulate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Simulation failed' },
      { status: 500 }
    );
  }
}
