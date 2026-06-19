import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

const COOKIE = 'truckhub_token';
const MAX_AGE = 60 * 60 * 24 * 7;

function verify(params: Record<string, string>): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;

  const { hash, ...rest } = params;
  if (!hash) return false;

  const authDate = Number(rest.auth_date);
  if (Date.now() / 1000 - authDate > 86400) return false;

  const dataStr = Object.keys(rest).sort().map((k) => `${k}=${rest[k]}`).join('\n');
  const key = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', key).update(dataStr).digest('hex');

  return hmac === hash;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  if (!verify(params)) {
    return NextResponse.redirect(new URL('/login?error=tg_invalid', req.url));
  }

  const telegramId = params.id;
  const name = [params.first_name, params.last_name].filter(Boolean).join(' ') || 'Пользователь';

  let user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    user = await prisma.user.create({
      data: { telegramId, name, role: 'CLIENT', phoneVerified: true },
    });
  } else if (!user.phoneVerified) {
    await prisma.user.update({ where: { id: user.id }, data: { phoneVerified: true } });
  }

  const token = await signToken({ userId: user.id, role: user.role });
  const origin = new URL(req.url).origin;
  const res = NextResponse.redirect(new URL('/', origin));

  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
