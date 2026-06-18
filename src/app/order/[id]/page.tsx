import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { OrderDetail } from '@/components/OrderDetail';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return { title: 'Заявка не найдена — TruckHUB' };
  return {
    title: `${order.fromCity} → ${order.toCity} · Заявка — TruckHUB`,
    description: `${order.cargo}. Дата: ${order.date}.`,
  };
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      _count: { select: { responses: true } },
      responses: {
        orderBy: { createdAt: 'desc' },
        include: {
          driverProfile: {
            select: {
              id: true,
              city: true,
              rating: true,
              reviews: true,
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <main>
      <Navbar />
      <OrderDetail
        id={order.id}
        clientId={order.client.id}
        fromCity={order.fromCity}
        toCity={order.toCity}
        cargo={order.cargo}
        date={order.date}
        budget={order.budget}
        negotiable={order.negotiable}
        specs={order.specs ? order.specs.split(',').filter(Boolean) : []}
        clientName={order.client.name}
        initialResponseCount={order._count.responses}
        initialResponses={order.responses.map((r) => ({
          id: r.id,
          price: r.price,
          message: r.message,
          createdAt: r.createdAt.toISOString(),
          driverProfile: r.driverProfile,
        }))}
        initialStatus={order.status}
        createdAt={order.createdAt.toISOString()}
        urgent={order.urgent}
      />
    </main>
  );
}
