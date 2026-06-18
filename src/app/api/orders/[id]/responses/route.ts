import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { CreateResponseSchema } from '@/lib/schemas';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  if (session.role !== 'DRIVER') {
    return NextResponse.json({ error: 'Только водители могут откликаться на заявки' }, { status: 403 });
  }

  const { id: orderId } = await params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
  }
  if (order.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Заявка уже закрыта' }, { status: 409 });
  }

  const driverProfile = await prisma.driverProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!driverProfile) {
    return NextResponse.json({ error: 'Профиль водителя не заполнен' }, { status: 400 });
  }

  const alreadyResponded = await prisma.orderResponse.findFirst({
    where: { orderId, driverProfileId: driverProfile.id },
  });
  if (alreadyResponded) {
    return NextResponse.json({ error: 'Вы уже откликнулись на эту заявку' }, { status: 409 });
  }

  const body = await req.json();
  const data = CreateResponseSchema.safeParse(body);
  if (!data.success) {
    return NextResponse.json({ error: data.error.issues[0].message }, { status: 400 });
  }

  const response = await prisma.orderResponse.create({
    data: {
      orderId,
      driverProfileId: driverProfile.id,
      userId: session.userId,
      price: data.data.price,
      message: data.data.message,
    },
  });

  return NextResponse.json(response, { status: 201 });
}
