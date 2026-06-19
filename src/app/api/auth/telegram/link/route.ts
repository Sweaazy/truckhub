import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

function verify(params: Record<string, string>): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;
  const { hash, ...rest } = params;
  if (!hash) return false;
  if (Date.now() / 1000 - Number(rest.auth_date) > 86400) return false;
  const dataStr = Object.keys(rest).sort().map((k) => `${k}=${rest[k]}`).join('\n');
  const key = crypto.createHash('sha256').update(botToken).digest();
  return crypto.createHmac('sha256', key).update(dataStr).digest('hex') === hash;
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const params = Object.fromEntries(new URL(req.url).searchParams.entries());

  if (!verify(params)) {
    return NextResponse.redirect(new URL('/profile?error=tg_invalid', req.url));
  }

  const telegramId = params.id;

  const existing = await prisma.user.findUnique({ where: { telegramId } });
  if (existing && existing.id !== session.userId) {
    return NextResponse.redirect(new URL('/profile?error=tg_taken', req.url));
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { telegramId, phoneVerified: true },
  });

  return NextResponse.redirect(new URL('/profile?verified=1', req.url));
}
