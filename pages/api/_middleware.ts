import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization');

  if (token === process.env.AUTH_TOKEN) {
    return NextResponse.next();
  }

  return new Response('Auth required', {
    status: 401,
  });
}
