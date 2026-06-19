import { NextRequest, NextResponse } from 'next/server';

// Telegram login as standalone auth is disabled.
// Telegram is used only to verify existing accounts via /api/auth/telegram/link
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/login?error=tg_disabled', req.url));
}
