import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const driver = await prisma.driverProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true, phone: true } } },
  });

  if (!driver) {
    return NextResponse.json({ error: 'Водитель не найден' }, { status: 404 });
  }

  return NextResponse.json({
    ...driver,
    features: driver.features ? driver.features.split(',').filter(Boolean) : [],
  });
}
