import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { DriverProfile } from '@/components/DriverProfile';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await prisma.driverProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  if (!driver) return { title: 'Перевозчик не найден — TruckHUB' };
  return {
    title: `${driver.user.name} — ${driver.truck} — TruckHUB`,
    description: `${driver.user.name}, ${driver.city}. ${driver.truck}, ${driver.capacity}. Рейтинг ${driver.rating}.`,
  };
}

export default async function DriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const driver = await prisma.driverProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });

  if (!driver) notFound();

  const parsed = {
    ...driver,
    features: driver.features ? driver.features.split(',').filter(Boolean) : [],
  };

  return (
    <main>
      <Navbar />
      <DriverProfile driver={parsed} />
    </main>
  );
}
