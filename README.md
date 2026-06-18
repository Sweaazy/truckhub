# TruckHUB

Платформа грузоперевозок по СНГ. Next.js 14 (App Router) + TypeScript + Prisma + SQLite/PostgreSQL.

## Запуск локально

Нужен Node.js 18.18+.

```bash
npm install
npx prisma migrate dev
npm run db:seed   # тестовые данные
npm run dev
```

Откройте http://localhost:3000

**Тестовые аккаунты** (пароль: `password123`):
- Клиент: `+77001234567`
- Водитель: `+77771001001` (Артём Власов)

## Деплой на Vercel + Neon (PostgreSQL)

SQLite не работает на Vercel (эфемерная файловая система). Используйте [Neon](https://neon.tech) — бесплатный PostgreSQL.

### 1. Переключить БД на PostgreSQL

В `prisma/schema.prisma` изменить:
```prisma
datasource db {
  provider = "postgresql"   // было "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Создать БД на Neon

1. Зарегистрируйтесь на [neon.tech](https://neon.tech)
2. Создайте проект → скопируйте строку подключения вида:
   `postgresql://user:password@host/truckhub?sslmode=require`

### 3. Накатить миграции

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npm run db:seed
```

### 4. Задеплоить на Vercel

1. Залейте проект на GitHub
2. [vercel.com](https://vercel.com) → Add New → Project → выберите репозиторий
3. В настройках Environment Variables добавьте:
   - `DATABASE_URL` — строка подключения Neon
   - `JWT_SECRET` — случайная строка 64 символа (`openssl rand -base64 48`)
4. Deploy

### Альтернативы PostgreSQL

- [Supabase](https://supabase.com) — бесплатный план
- [Railway](https://railway.app) — $5/мес, удобен для Node.js + БД вместе
- Любой VPS с PostgreSQL

## Переменные окружения

| Переменная | Пример | Описание |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | Строка подключения к БД |
| `JWT_SECRET` | `random-64-chars` | Секрет для JWT-токенов |

## Структура проекта

```
src/
  app/                    # страницы (App Router)
    page.tsx              # главная
    catalog/              # каталог перевозчиков
    orders/               # доска заявок
    order/[id]/           # страница заявки
    driver/[id]/          # профиль водителя
    profile/              # личный кабинет
    register/             # регистрация
    login/                # вход
    forgot-password/      # восстановление пароля
    about/                # о сервисе
    api/                  # API routes
  components/             # React-компоненты
  lib/
    auth.ts               # JWT-сессии
    prisma.ts             # Prisma client
    schemas.ts            # Zod-схемы валидации
    types.ts              # TypeScript типы
prisma/
  schema.prisma           # схема БД
  seed.ts                 # тестовые данные
```

## Темы

Светлая и тёмная. Переключатель в шапке, автоопределение по системной теме. Все цвета через CSS-переменные в `globals.css`.

## Дорожная карта

- [ ] Чат между клиентом и водителем (WebSocket)
- [ ] Загрузка фото автомобиля (Cloudinary/S3)
- [ ] SMS-авторизация (OTP) вместо пароля
- [ ] Эскроу-оплата через платформу
- [ ] Мобильное приложение (React Native)
