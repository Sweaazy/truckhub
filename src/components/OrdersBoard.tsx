'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Chip } from './Chip';
import { DBOrder } from '@/lib/types';
import { ALL_CURRENCIES } from '@/lib/useCurrency';
import { IconUser, IconBuilding, IconMessageCircle, IconBolt, IconPlus } from '@tabler/icons-react';

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins} мин. назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч. назад`;
  return `${Math.floor(hrs / 24)} дн. назад`;
}

function isNew(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 24 * 60 * 60 * 1000;
}

function isBusiness(name: string): boolean {
  return /тоо|ип|ооо|зао|inc\.|ltd\./i.test(name);
}

function budgetDisplay(order: DBOrder): string {
  if (order.negotiable) return 'Договорная';
  if (order.budget) {
    const sym = ALL_CURRENCIES.find((c) => c.code === order.currency)?.symbol ?? order.currency;
    return `${order.budget.toLocaleString('ru')} ${sym}`;
  }
  return '—';
}

export function OrdersBoard() {
  const [urgency, setUrgency] = useState('Любая');
  const [sort, setSort] = useState('new');

  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders?status=ACTIVE&limit=20');
      const data = await res.json();
      setOrders(data.orders ?? []);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/orders?status=ACTIVE&limit=20&cursor=${nextCursor}`);
      const data = await res.json();
      setOrders((prev) => [...prev, ...(data.orders ?? [])]);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => { load(); }, [load]);

  const filtered = orders
    .filter((o) => urgency === 'Срочные' ? o.urgent : true)
    .sort((a, b) => {
      if (sort === 'budget') return (b.budget ?? 0) - (a.budget ?? 0);
      if (sort === 'date') return a.date.localeCompare(b.date);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <>
      {/* HEADER */}
      <div style={{ padding: '16px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>Доска заявок</h1>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Найдите груз по своему маршруту</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/orders/new" className="btn btn-primary"><IconPlus size={14} /> Разместить заявку</Link>
          </div>
        </div>
      </div>

      <div className="layout-sidebar">
        {/* SIDEBAR */}
        <aside style={{ padding: 16, borderRight: '1px solid var(--border-soft)', background: 'var(--surface)' }}>
          <FilterGroup title="Срочность">
            {['Любая', 'Срочные'].map((u) => (
              <Chip key={u} active={urgency === u} onClick={() => setUrgency(u)}>{u}</Chip>
            ))}
          </FilterGroup>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={load}>
            Обновить список
          </button>
        </aside>

        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
              <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{loading ? '...' : filtered.length}</strong> заявок
            </div>
            <select
              style={{ fontSize: 11, border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="new">Сначала новые</option>
              <option value="budget">По бюджету: больше</option>
              <option value="date">По дате отправки</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: '13px 14px', height: 110, opacity: 0.5 + i * 0.1 }}>
                  <div style={{ height: 14, borderRadius: 4, background: 'var(--surface-2)', width: '60%', marginBottom: 8 }} />
                  <div style={{ height: 11, borderRadius: 4, background: 'var(--surface-2)', width: '40%' }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
                Заявок не найдено
              </div>
            ) : (
              filtered.map((o) => (
                <div key={o.id} className="card" style={{ padding: '13px 14px', cursor: 'pointer', borderLeft: o.urgent ? '3px solid var(--accent)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {o.fromCity} → {o.toCity}
                        {isNew(o.createdAt) && <span className="badge-new">НОВАЯ</span>}
                        {o.urgent && <span className="badge-urgent"><IconBolt size={10} /> СРОЧНО</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>{o.cargo}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{budgetDisplay(o)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{o.date}</div>
                    </div>
                  </div>
                  {o.specs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                      {o.specs.map((s) => <span key={s} className="spec-tag">{s}</span>)}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 9, borderTop: '1px solid var(--border-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
                        {isBusiness(o.client.name) ? <IconBuilding size={11} /> : <IconUser size={11} />}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
                        <strong style={{ fontWeight: 600, color: 'var(--text)' }}>{o.client.name}</strong> · {timeAgo(o.createdAt)}
                      </span>
                    </div>
                    {o.responseCount > 0 ? (
                      <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{o.responseCount} {o.responseCount === 1 ? 'отклик' : o.responseCount < 5 ? 'отклика' : 'откликов'} уже есть</span>
                    ) : (
                      <Link href={`/order/${o.id}`} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 11 }}>
                        <IconMessageCircle size={12} /> Откликнуться
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
            {nextCursor && !loading && (
              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: 4 }}
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Загружаем...' : 'Загрузить ещё'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{children}</div>
    </div>
  );
}
