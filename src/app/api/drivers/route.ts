import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') ?? undefined;
  const minRating = parseFloat(searchParams.get('minRating') ?? '0');

  const drivers = await prisma.driverProfile.findMany({
    where: {
      user: { phoneVerified: true },
      ...(city ? { city } : {}),
      ...(minRating > 0 ? { rating: { gte: minRating } } : {}),
    },
    include: { user: { select: { name: true } } },
    orderBy: { rating: 'desc' },
  });

  return NextResponse.json(
    drivers.map((d) => ({
      ...d,
      features: d.features ? d.features.split(',').filter(Boolean) : [],
    }))
  );
}
