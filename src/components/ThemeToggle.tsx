'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span style={{ width: 33, height: 31, display: 'inline-block' }} aria-hidden />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '5px 7px',
        color: 'var(--text-2)',
      }}
    >
      {isDark ? <IconSun size={15} /> : <IconMoon size={15} />}
    </button>
  );
}
