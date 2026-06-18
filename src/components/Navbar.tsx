'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { IconMenu2, IconX, IconUser, IconLogout } from '@tabler/icons-react';

const links = [
  { href: '/catalog', label: 'Перевозчики' },
  { href: '/orders', label: 'Заявки' },
  { href: '/about', label: 'О сервисе' },
];

interface Me { name: string; role: string }

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null | undefined>(undefined);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, [pathname]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMe(null);
    router.push('/');
    router.refresh();
  }

  const authButtons = me === undefined ? null : me === null ? (
    <>
      <Link href="/login" className="btn btn-secondary">Войти</Link>
      <Link href="/register" className="btn btn-primary">Регистрация</Link>
    </>
  ) : (
    <>
      <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
        <IconUser size={14} style={{ color: 'var(--accent)' }} /> {me.name}
      </Link>
      <button className="btn btn-secondary" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <IconLogout size={13} /> Выйти
      </button>
    </>
  );

  const mobileAuthButtons = me === undefined ? null : me === null ? (
    <div style={{ display: 'flex', gap: 8, paddingTop: 12 }}>
      <Link href="/login" className="btn btn-secondary" style={{ flex: 1, fontSize: 13 }} onClick={() => setOpen(false)}>Войти</Link>
      <Link href="/register" className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => setOpen(false)}>Регистрация</Link>
    </div>
  ) : (
    <div style={{ display: 'flex', gap: 8, paddingTop: 12 }}>
      <Link href="/profile" className="btn btn-secondary" style={{ flex: 1, fontSize: 13 }} onClick={() => setOpen(false)}>
        <IconUser size={13} /> {me.name}
      </Link>
      <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => { setOpen(false); logout(); }}>
        <IconLogout size={13} /> Выйти
      </button>
    </div>
  );

  return (
    <nav style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--border-soft)', background: 'var(--nav-bg)' }}>
      <Logo />

      {/* Desktop */}
      <div className="nav-links">
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={{ fontSize: 12, fontWeight: pathname === l.href ? 700 : 500, color: pathname === l.href ? 'var(--accent)' : 'var(--text-2)' }}>
            {l.label}
          </Link>
        ))}
        {authButtons}
        <ThemeToggle />
      </div>

      {/* Mobile */}
      <div className="nav-mobile-controls">
        <ThemeToggle />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 4, display: 'flex' }}
        >
          {open ? <IconX size={22} /> : <IconMenu2 size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu${open ? ' is-open' : ''}`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`nav-mobile-link${pathname === l.href ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        {mobileAuthButtons}
      </div>
    </nav>
  );
}
