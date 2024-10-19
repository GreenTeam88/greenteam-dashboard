import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // eslint-disable-next-line no-unused-vars
    console.log(req.body);
    return NextResponse.json({ message: 'User created' });
  } catch (e) {
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
