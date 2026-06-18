import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setSessionCookie } from '@/lib/auth';
import { RegisterSchema } from '@/lib/schemas';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`register:${ip}`, 5, 60_000)) return rateLimitResponse();

  try {
    const body = await req.json();
    const data = RegisterSchema.safeParse(body);
    if (!data.success) {
      return NextResponse.json({ error: data.error.issues[0].message }, { status: 400 });
    }

    const { phone, name, password, role, city, truck, capacity, priceKm } = data.data;

    const exists = await prisma.user.findUnique({ where: { phone } });
    if (exists) {
      return NextResponse.json({ error: 'Этот номер уже зарегистрирован' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        name,
        role,
        passwordHash,
        ...(role === 'DRIVER' && city && truck && capacity ? {
          driverProfile: {
            create: {
              city,
              truck,
              capacity,
              priceKm: priceKm ?? 0,
              features: '',
            },
          },
        } : {}),
      },
    });

    const token = await signToken({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ id: user.id, name: user.name, role: user.role }, { status: 201 });
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
