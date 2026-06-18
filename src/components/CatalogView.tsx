'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Chip } from './Chip';
import { DBDriverProfile } from '@/lib/types';
import { IconSearch, IconTruck, IconStar, IconMapPin, IconCheck } from '@tabler/icons-react';

const TRUCK_TYPES = ['Газель', 'Фура', 'Рефриж.', 'Манипул.', 'Самосвал', 'Эвакуатор'];
const RATING_OPTIONS = ['Любой', '4.0+', '4.5+', '4.8+'];

function parseMinRating(r: string): number {
  if (r === 'Любой') return 0;
  return parseFloat(r);
}

export function CatalogView() {
  const [truckType, setTruckType] = useState('');
  const [rating, setRating] = useState('Любой');
  const [sortBy, setSortBy] = useState('rating');

  const [drivers, setDrivers] = useState<DBDriverProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const minRating = parseMinRating(rating);
      if (minRating > 0) params.set('minRating', String(minRating));
      const res = await fetch(`/api/drivers?${params}`);
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [rating]);

  useEffect(() => { load(); }, [load]);

  const filtered = truckType
    ? drivers.filter((d) => d.truck.toLowerCase().includes(truckType.toLowerCase()))
    : drivers;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.priceKm - b.priceKm;
    if (sortBy === 'price_desc') return b.priceKm - a.priceKm;
    return b.rating - a.rating;
  });

  return (
    <>
      <div className="catalog-search" style={{ padding: '14px 20px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <SearchField label="Откуда" value="Алматы" />
        <SearchField label="Куда" value="Любой город" placeholder />
        <SearchField label="Дата" value="Любая" placeholder />
        <SearchField label="Тип груза" value="Не важно" placeholder />
        <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={load}><IconSearch size={13} /> Обновить</button>
      </div>

      <div className="layout-sidebar">
        <aside style={{ padding: 16, borderRight: '1px solid var(--border-soft)', background: 'var(--surface)' }}>
          <FilterGroup title="Тип ТС">
            {TRUCK_TYPES.map((t) => (
              <Chip key={t} active={truckType === t} onClick={() => setTruckType((prev) => prev === t ? '' : t)}>{t}</Chip>
            ))}
          </FilterGroup>
          <FilterGroup title="Рейтинг">
            {RATING_OPTIONS.map((r) => (
              <Chip key={r} active={rating === r} onClick={() => setRating(r)}>{r}</Chip>
            ))}
          </FilterGroup>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={load}>Применить фильтры</button>
        </aside>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
              <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{loading ? '...' : sorted.length}</strong> перевозчиков найдено
            </div>
            <select
              style={{ fontSize: 11, border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">По рейтингу</option>
              <option value="price_asc">По цене: дешевле</option>
              <option value="price_desc">По цене: дороже</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 14 }}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden', opacity: 0.5 + i * 0.1 }}>
                  <div style={{ height: 80, background: 'var(--surface-2)' }} />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ height: 12, borderRadius: 4, background: 'var(--surface-2)', width: '70%', marginBottom: 6 }} />
                    <div style={{ height: 10, borderRadius: 4, background: 'var(--surface-2)', width: '50%' }} />
                  </div>
                </div>
              ))
            ) : sorted.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '32px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
                Перевозчики не найдены
              </div>
            ) : (
              sorted.map((d) => (
                <Link key={d.id} href={`/driver/${d.id}`} className="card" style={{ overflow: 'hidden', display: 'block', border: d.pro ? '1.5px solid var(--accent)' : undefined }}>
                  <div style={{ height: 80, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--border-soft)' }}>
                    <IconTruck size={28} style={{ color: 'var(--text-3)' }} />
                    <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {d.verified && <span className="badge-verified"><IconCheck size={9} /> Проверен</span>}
                      {d.pro && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: 'var(--accent-bg)', color: 'var(--accent-text)', border: '1px solid var(--accent)' }}>PRO</span>}
                    </div>
                    <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700, color: 'var(--star)', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconStar size={10} fill="var(--star)" /> {d.rating}
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{d.user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6 }}>{d.truck}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span className="spec-tag">{d.capacity}</span>
                      {d.features.slice(0, 2).map((f) => <span key={f} className="spec-tag">{f}</span>)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><IconMapPin size={11} /> {d.city}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{d.priceKm} ₸/км</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SearchField({ label, value, placeholder }: { label: string; value: string; placeholder?: boolean }) {
  return (
    <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-soft)', borderRadius: 8, padding: '8px 12px', flex: 1, maxWidth: 140 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: placeholder ? 400 : 600, color: placeholder ? 'var(--text-3)' : 'var(--text)' }}>{value}</div>
    </div>
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
