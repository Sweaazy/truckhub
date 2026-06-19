import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ verified: false });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { phoneVerified: true },
  });

  return NextResponse.json({ verified: user?.phoneVerified ?? false });
}
