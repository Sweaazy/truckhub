import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setSessionCookie } from '@/lib/auth';
import { LoginSchema } from '@/lib/schemas';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`login:${ip}`, 10, 60_000)) return rateLimitResponse();

  try {
    const body = await req.json();
    const data = LoginSchema.safeParse(body);
    if (!data.success) {
      return NextResponse.json({ error: 'Неверный формат данных' }, { status: 400 });
    }

    const { phone, password } = data.data;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json({ error: 'Неверный номер или пароль' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Неверный номер или пароль' }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ id: user.id, name: user.name, role: user.role });
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
