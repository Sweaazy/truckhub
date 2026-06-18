import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  const hash = (p: string) => bcrypt.hash(p, 10);

  // Client
  const irina = await prisma.user.upsert({
    where: { phone: '+77001234567' },
    update: {},
    create: {
      phone: '+77001234567',
      name: 'Ирина М.',
      role: 'CLIENT',
      passwordHash: await hash('password123'),
    },
  });

  const company = await prisma.user.upsert({
    where: { phone: '+77002234567' },
    update: {},
    create: {
      phone: '+77002234567',
      name: 'ТОО СтройСнаб',
      role: 'CLIENT',
      passwordHash: await hash('password123'),
    },
  });

  // Drivers
  const artem = await prisma.user.upsert({
    where: { phone: '+77771001001' },
    update: {},
    create: {
      phone: '+77771001001',
      name: 'Артём Власов',
      role: 'DRIVER',
      passwordHash: await hash('password123'),
      driverProfile: {
        create: {
          city: 'Алматы',
          truck: 'Газель Бизнес · Термобудка',
          capacity: 'до 1.5 т',
          priceKm: 25,
          features: 'Грузчики,Термо,Межгород',
          rating: 4.9,
          reviews: 84,
          trips: 210,
          verified: true,
          pro: true,
          online: true,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { phone: '+77771002002' },
    update: {},
    create: {
      phone: '+77771002002',
      name: 'Нурлан Сейткали',
      role: 'DRIVER',
      passwordHash: await hash('password123'),
      driverProfile: {
        create: {
          city: 'Астана',
          truck: 'Газель Next · Тент',
          capacity: 'до 1.5 т',
          priceKm: 22,
          features: 'Межгород',
          rating: 4.7,
          reviews: 41,
          trips: 98,
          verified: true,
          online: false,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { phone: '+77771003003' },
    update: {},
    create: {
      phone: '+77771003003',
      name: 'Дмитрий Ким',
      role: 'DRIVER',
      passwordHash: await hash('password123'),
      driverProfile: {
        create: {
          city: 'Алматы',
          truck: 'Газель Фермер · Борт',
          capacity: 'до 2 т',
          priceKm: 28,
          features: 'Гидроборт',
          rating: 4.8,
          reviews: 27,
          trips: 65,
          verified: true,
          online: true,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { phone: '+77771004004' },
    update: {},
    create: {
      phone: '+77771004004',
      name: 'Асет Омаров',
      role: 'DRIVER',
      passwordHash: await hash('password123'),
      driverProfile: {
        create: {
          city: 'Алматы',
          truck: 'Газель · Изотерм',
          capacity: 'до 1 т',
          priceKm: 20,
          features: 'Грузчики',
          rating: 4.5,
          reviews: 12,
          trips: 33,
          verified: false,
          online: false,
        },
      },
    },
  });

  // Orders
  await prisma.order.createMany({
    data: [
      {
        clientId: irina.id,
        fromCity: 'Алматы',
        toCity: 'Бишкек',
        cargo: 'Мебель, 3-комн. квартира · Требуется упаковка',
        date: 'Завтра',
        budget: 45000,
        specs: '~4×2×2 м,до 1.5 т,Грузчики нужны,Хрупкое',
        urgent: true,
      },
      {
        clientId: company.id,
        fromCity: 'Алматы',
        toCity: 'Талдыкорган',
        cargo: 'Стройматериалы, паллеты',
        date: 'Через 2 дня',
        budget: 28000,
        specs: '~2 т,Гидроборт желателен',
      },
      {
        clientId: irina.id,
        fromCity: 'Алматы',
        toCity: 'Капчагай',
        cargo: 'Диван и шкаф',
        date: 'Через 4 дня',
        budget: 15000,
        specs: 'Хрупкое,~2.5×1.5×1 м',
      },
      {
        clientId: company.id,
        fromCity: 'Алматы',
        toCity: 'Шымкент',
        cargo: 'Оборудование, паллеты · Дальнобой',
        date: 'Через неделю',
        negotiable: true,
        specs: 'до 5 т,700 км,Фура',
      },
    ],
  });

  console.log('Seed done.');
  console.log('Test accounts (password: password123):');
  console.log('  Client: +77001234567');
  console.log('  Driver: +77771001001 (Артём Власов)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
