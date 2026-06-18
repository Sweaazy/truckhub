import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { IconArrowLeft, IconMapPin } from '@tabler/icons-react';

export const metadata = {
  title: '404 — Страница не найдена — TruckHUB',
};

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
        <span style={{ fontSize: 72, fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--surface-2)', lineHeight: 1, marginBottom: 8 }}>404</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <IconMapPin size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Страница не найдена</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 320, lineHeight: 1.6, marginBottom: 28 }}>
          Возможно, ссылка устарела или страница была перемещена.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary" style={{ padding: '11px 20px', fontSize: 13 }}>
            <IconArrowLeft size={14} /> На главную
          </Link>
          <Link href="/orders" className="btn btn-secondary" style={{ fontSize: 13 }}>
            Доска заявок
          </Link>
        </div>
      </div>
    </main>
  );
}
