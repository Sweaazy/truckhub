import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

let webhookSet = false;

async function ensureWebhook(host: string) {
  if (webhookSet) return;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  const webhookUrl = `https://${host}/api/bot/webhook`;
  await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
  webhookSet = true;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const host = req.headers.get('host') ?? 'truckhub.vercel.app';
  await ensureWebhook(host);

  const token = Math.random().toString(36).substring(2, 10).toUpperCase();

  await prisma.user.update({
    where: { id: session.userId },
    data: { verifyToken: token },
  });

  const deepLink = `https://t.me/teoriginalbot?start=verify_${token}`;
  return NextResponse.json({ deepLink });
}
