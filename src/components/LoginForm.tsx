'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconEye, IconEyeOff, IconArrowRight, IconPhone } from '@tabler/icons-react';
import { TelegramLoginButton } from './TelegramLoginButton';

const COUNTRY_CODES = [
  { flag: '🇰🇿', code: '+7',   label: 'KZ +7',   placeholder: '700 000 00 00' },
  { flag: '🇷🇺', code: '+7',   label: 'RU +7',   placeholder: '900 000 00 00' },
  { flag: '🇺🇿', code: '+998', label: 'UZ +998', placeholder: '90 000 00 00' },
  { flag: '🇺🇦', code: '+380', label: 'UA +380', placeholder: '50 000 00 00' },
  { flag: '🇧🇾', code: '+375', label: 'BY +375', placeholder: '29 000 00 00' },
  { flag: '🇦🇿', code: '+994', label: 'AZ +994', placeholder: '50 000 00 00' },
  { flag: '🇬🇪', code: '+995', label: 'GE +995', placeholder: '555 00 00 00' },
  { flag: '🇦🇲', code: '+374', label: 'AM +374', placeholder: '77 00 00 00' },
  { flag: '🇰🇬', code: '+996', label: 'KG +996', placeholder: '700 00 00 00' },
  { flag: '🇹🇯', code: '+992', label: 'TJ +992', placeholder: '900 00 00 00' },
  { flag: '🇹🇲', code: '+993', label: 'TM +993', placeholder: '65 00 00 00' },
  { flag: '🇲🇩', code: '+373', label: 'MD +373', placeholder: '60 000 000' },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/';
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const countryCode = selectedCountry.code;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = phone.trim().length > 6 && password.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `${countryCode}${phone.trim().replace(/^0/, '')}`, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ошибка входа');
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError('Не удалось подключиться к серверу');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '48px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'var(--accent-bg)', border: '1px solid var(--accent)', marginBottom: 14 }}>
          <IconPhone size={22} style={{ color: 'var(--accent)' }} />
        </span>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 6 }}>Вход в TruckHUB</h1>
        <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Введите номер телефона и пароль</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="form-field">
          <label className="form-label">Номер телефона</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <select className="form-input" value={selectedCountry.label} onChange={(e) => setSelectedCountry(COUNTRY_CODES.find(c => c.label === e.target.value)!)} style={{ width: 110, flexShrink: 0 }}>
              {COUNTRY_CODES.map((c) => (
                <option key={c.label} value={c.label}>{c.flag} {c.label}</option>
              ))}
            </select>
            <input
              className="form-input"
              type="tel"
              placeholder={selectedCountry.placeholder}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              autoComplete="tel"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span className="form-label" style={{ marginBottom: 0 }}>Пароль</span>
            <Link href="/forgot-password" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Забыли пароль?</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 2, display: 'flex' }}
              tabIndex={-1}
            >
              {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-text)', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: 'var(--danger-text)', lineHeight: 1.4 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!canSubmit || loading}
          style={{ padding: 13, fontSize: 14, marginTop: 4, opacity: canSubmit && !loading ? 1 : 0.5 }}
        >
          {loading ? 'Входим...' : <><span>Войти</span> <IconArrowRight size={15} /></>}
        </button>
      </form>

      <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>или войдите через</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
      </div>

      <TelegramLoginButton />

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
          Нет аккаунта?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
