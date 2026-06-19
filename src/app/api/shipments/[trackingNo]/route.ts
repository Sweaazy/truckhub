import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

const STATUSES = ['PREPARING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ trackingNo: string }> }) {
  const { trackingNo } = await params;
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const shipment = await prisma.shipment.findUnique({
    where: { trackingNo },
    include: {
      order: { select: { fromCity: true, toCity: true, cargo: true, currency: true, budget: true, negotiable: true } },
      driver: { select: { city: true, truck: true, user: { select: { name: true } } } },
    },
  });

  if (!shipment) return NextResponse.json({ error: 'Перевозка не найдена' }, { status: 404 });

  const isClient = shipment.clientId === session.userId;
  const isDriver = shipment.driverProfileId !== null;

  const driverUser = await prisma.driverProfile.findUnique({
    where: { id: shipment.driverProfileId },
    select: { userId: true },
  });
  const isDriverUser = driverUser?.userId === session.userId;

  if (!isClient && !isDriverUser) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
  }

  void isDriver;
  return NextResponse.json(shipment);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ trackingNo: string }> }) {
  const { trackingNo } = await params;
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const shipment = await prisma.shipment.findUnique({ where: { trackingNo } });
  if (!shipment) return NextResponse.json({ error: 'Перевозка не найдена' }, { status: 404 });

  const driverUser = await prisma.driverProfile.findUnique({
    where: { id: shipment.driverProfileId },
    select: { userId: true },
  });
  if (driverUser?.userId !== session.userId) {
    return NextResponse.json({ error: 'Только водитель может обновлять статус' }, { status: 403 });
  }

  const { status } = await req.json();
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Недопустимый статус' }, { status: 400 });
  }

  const updated = await prisma.shipment.update({ where: { trackingNo }, data: { status } });
  return NextResponse.json(updated);
}
