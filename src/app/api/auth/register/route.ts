import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // console.log(req.body);
    return NextResponse.json({ message: 'User created' });
  } catch (e) {
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
