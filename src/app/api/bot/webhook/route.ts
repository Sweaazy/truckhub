import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: true });

  const message = body?.message;
  if (!message) return NextResponse.json({ ok: true });

  const text: string = message?.text ?? '';
  const telegramId = String(message?.from?.id ?? '');

  // Handle /start verify_TOKEN
  const match = text.match(/^\/start verify_([A-Z0-9]+)$/);
  if (match) {
    const token = match[1];
    const user = await prisma.user.findUnique({ where: { verifyToken: token } });

    if (user && !user.phoneVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneVerified: true,
          telegramId,
          verifyToken: null,
        },
      });

      // Send confirmation message to user via bot
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramId,
            text: '✅ Ваш аккаунт в сервисе TruckHUB успешно верифицирован!\n\nТеперь вам доступны все функции платформы.',
            reply_markup: {
              inline_keyboard: [[
                { text: 'Вернуться в профиль →', url: 'https://truckhub.vercel.app/profile' },
              ]],
            },
          }),
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
