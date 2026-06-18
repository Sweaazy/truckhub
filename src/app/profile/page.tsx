import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProfileView } from '@/components/ProfileView';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Мой профиль — TruckHUB',
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login?from=/profile');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { _count: { select: { responses: true } } },
      },
      driverProfile: {
        select: {
          id: true,
          city: true,
          truck: true,
          capacity: true,
          priceKm: true,
          rating: true,
          reviews: true,
          trips: true,
          verified: true,
          pro: true,
          online: true,
          responses: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
              order: {
                include: { client: { select: { name: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect('/login');

  return (
    <main>
      <Navbar />
      <ProfileView user={user} />
    </main>
  );
}
