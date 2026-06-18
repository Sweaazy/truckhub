'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  IconArrowRight, IconCheck, IconMapPin, IconPackage, IconCalendar, IconCurrencyTenge, IconStar,
} from '@tabler/icons-react';

const CARGO_TYPES = ['Переезд', 'Доставка', 'Стройматериалы', 'Оборудование', 'Другое'];

const SPECS = [
  { id: 'loaders', label: 'Нужны грузчики' },
  { id: 'fragile', label: 'Хрупкий груз' },
  { id: 'hydro', label: 'Гидроборт' },
  { id: 'thermo', label: 'Термокузов' },
  { id: 'longhaul', label: 'Межгород / дальнобой' },
];

type Spec = typeof SPECS[number]['id'];

export function CreateOrderForm() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [cargoType, setCargoType] = useState('Переезд');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [specs, setSpecs] = useState<Set<Spec>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleSpec(id: Spec) {
    setSpecs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const canSubmit = from.trim().length > 1 && to.trim().length > 1 && description.trim().length > 3 && date !== '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCity: from.trim(),
          toCity: to.trim(),
          cargo: `${cargoType}: ${description.trim()}`,
          description: description.trim(),
          date,
          budget: negotiable ? null : (budget ? Number(budget) : null),
          negotiable,
          specs: Array.from(specs).map((id) => SPECS.find((s) => s.id === id)!.label),
          urgent: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ошибка создания заявки');
        return;
      }

      setOrderId(data.id);
      setSubmitted(true);
    } catch {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 24px', textAlign: 'center' }}>
        <span style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--verified-bg)', border: '2px solid var(--verified-border)', marginBottom: 20 }}>
          <IconCheck size={32} color="var(--verified-text)" strokeWidth={2.5} />
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 8 }}>Заявка размещена!</h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 320, lineHeight: 1.6, marginBottom: 10 }}>
          Маршрут: <strong style={{ color: 'var(--text)' }}>{from} → {to}</strong>
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 320, lineHeight: 1.6, marginBottom: 28 }}>
          Перевозчики уже видят вашу заявку и скоро свяжутся с вами.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {orderId && (
            <Link href={`/order/${orderId}`} className="btn btn-primary" style={{ padding: '11px 20px', fontSize: 13 }}>
              Смотреть заявку
            </Link>
          )}
          <Link href="/orders" className="btn btn-secondary" style={{ fontSize: 13 }}>Все заявки</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 6 }}>Разместить заявку</h1>
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>Опишите груз и маршрут — перевозчики откликнутся сами</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <fieldset style={{ border: '1px solid var(--border-soft)', borderRadius: 12, padding: '14px 16px' }}>
          <legend style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', padding: '0 6px', letterSpacing: '0.04em' }}>
            <IconMapPin size={11} style={{ verticalAlign: -1, marginRight: 3 }} />МАРШРУТ
          </legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center' }}>
            <div className="form-field">
              <label className="form-label">Откуда</label>
              <input className="form-input" placeholder="Алматы" value={from} onChange={(e) => setFrom(e.target.value)} required />
            </div>
            <div style={{ paddingTop: 18, color: 'var(--text-3)', fontWeight: 700, fontSize: 16 }}>→</div>
            <div className="form-field">
              <label className="form-label">Куда</label>
              <input className="form-input" placeholder="Бишкек" value={to} onChange={(e) => setTo(e.target.value)} required />
            </div>
          </div>
        </fieldset>

        <div className="form-field">
          <label className="form-label"><IconPackage size={11} style={{ verticalAlign: -1, marginRight: 3 }} />Тип груза</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {CARGO_TYPES.map((t) => (
              <button key={t} type="button" className={`chip${cargoType === t ? ' is-active' : ''}`} onClick={() => setCargoType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Описание груза</label>
          <textarea className="form-input form-textarea" placeholder="Мебель из 3-комн. квартиры, холодильник, диван, коробки. Требуется аккуратная упаковка." value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-field">
            <label className="form-label"><IconCalendar size={11} style={{ verticalAlign: -1, marginRight: 3 }} />Дата отправки</label>
            <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ colorScheme: 'light dark' }} />
          </div>
          <div className="form-field">
            <label className="form-label"><IconCurrencyTenge size={11} style={{ verticalAlign: -1, marginRight: 3 }} />Бюджет (₸)</label>
            <input className="form-input" type="number" placeholder="45 000" value={budget} onChange={(e) => setBudget(e.target.value)} disabled={negotiable} style={{ opacity: negotiable ? 0.45 : 1 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-2)', marginTop: 5, cursor: 'pointer' }}>
              <input type="checkbox" checked={negotiable} onChange={(e) => { setNegotiable(e.target.checked); if (e.target.checked) setBudget(''); }} style={{ accentColor: 'var(--accent)', width: 13, height: 13 }} />
              Договорная
            </label>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label"><IconStar size={11} style={{ verticalAlign: -1, marginRight: 3 }} />Дополнительные требования</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {SPECS.map(({ id, label }) => (
              <label key={id} className={`form-checkbox-row${specs.has(id) ? ' is-checked' : ''}`}>
                <input type="checkbox" checked={specs.has(id)} onChange={() => toggleSpec(id)} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-text)', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: 'var(--danger-text)' }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ padding: '13px 20px', fontSize: 14, marginTop: 4, opacity: canSubmit && !loading ? 1 : 0.5 }} disabled={!canSubmit || loading}>
          {loading ? 'Размещаем...' : <><span>Разместить заявку</span> <IconArrowRight size={15} /></>}
        </button>

        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-3)', lineHeight: 1.5 }}>
          Размещение бесплатно. Перевозчики откликнутся через чат.
        </p>
      </form>
    </div>
  );
}
