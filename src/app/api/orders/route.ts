import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { CreateOrderSchema } from '@/lib/schemas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'ACTIVE';
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50);
  const cursor = searchParams.get('cursor') ?? undefined;

  const orders = await prisma.order.findMany({
    where: { status },
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { id: true, name: true } },
      _count: { select: { responses: true } },
    },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      ...o,
      specs: o.specs ? o.specs.split(',').filter(Boolean) : [],
      responseCount: o._count.responses,
    })),
    nextCursor: orders.length === limit ? orders[orders.length - 1].id : null,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  if (session.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Только клиенты могут создавать заявки' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { phoneVerified: true } });
  if (!user?.phoneVerified) {
    return NextResponse.json({ error: 'Подтвердите аккаунт через Telegram чтобы создавать заявки', code: 'UNVERIFIED' }, { status: 403 });
  }

  const body = await req.json();
  const data = CreateOrderSchema.safeParse(body);
  if (!data.success) {
    return NextResponse.json({ error: data.error.issues[0].message }, { status: 400 });
  }

  const { specs, currency, ...rest } = data.data;

  const order = await prisma.order.create({
    data: {
      ...rest,
      budget: rest.budget ?? null,
      currency: currency ?? 'USD',
      specs: specs.join(','),
      clientId: session.userId,
    },
  });

  return NextResponse.json({ ...order, specs: order.specs.split(',').filter(Boolean) }, { status: 201 });
}
