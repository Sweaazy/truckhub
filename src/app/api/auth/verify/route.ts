import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/auth/verify — generate a token and return the bot deep link
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = Math.random().toString(36).substring(2, 10).toUpperCase();

  await prisma.user.update({
    where: { id: session.userId },
    data: { verifyToken: token },
  });

  const botUsername = 'teoriginalbot';
  const deepLink = `https://t.me/${botUsername}?start=verify_${token}`;

  return NextResponse.json({ deepLink, token });
}

// GET /api/auth/verify?poll=1 — check if current user is now verified
// (we reuse the same route with a query param to keep things simple)
