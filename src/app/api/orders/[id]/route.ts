import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      responses: {
        orderBy: { createdAt: 'desc' },
        include: {
          driverProfile: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    specs: order.specs ? order.specs.split(',').filter(Boolean) : [],
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
  if (order.clientId !== session.userId) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });

  const { status } = await req.json();
  if (!['ACTIVE', 'CLOSED'].includes(status)) {
    return NextResponse.json({ error: 'Недопустимый статус' }, { status: 400 });
  }

  const updated = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}
