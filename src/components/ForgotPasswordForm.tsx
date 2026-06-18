'use client';

import Link from 'next/link';
import { IconArrowLeft, IconTool } from '@tabler/icons-react';

export function ForgotPasswordForm() {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-soft)', marginBottom: 18 }}>
        <IconTool size={22} style={{ color: 'var(--text-2)' }} />
      </span>
      <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 8 }}>
        Восстановление пароля
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
        Функция сброса пароля находится в разработке.
      </p>
      <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 28 }}>
        Если вы забыли пароль — напишите нам напрямую, и мы поможем восстановить доступ.
      </p>
      <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
        <IconArrowLeft size={14} /> Вернуться ко входу
      </Link>
    </div>
  );
}
