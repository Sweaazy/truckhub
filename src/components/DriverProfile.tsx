'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DBDriverProfile } from '@/lib/types';
import { IconUser, IconShieldCheck, IconMapPin, IconCalendar, IconClock, IconStar, IconStarFilled, IconMessageCircle, IconHeart, IconTruck, IconFilePlus, IconCircleFilled, IconArrowRight } from '@tabler/icons-react';

type Tab = 'trucks' | 'reviews' | 'routes';

export function DriverProfile({ driver }: { driver: DBDriverProfile }) {
  const [tab, setTab] = useState<Tab>('trucks');
  const [me, setMe] = useState<{ role: string } | null | undefined>(undefined);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  return (
    <>
      {/* BREADCRUMB */}
      <div style={{ padding: '9px 20px', borderBottom: '1px solid var(--border-soft)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href="/" style={{ fontSize: 11, color: 'var(--text-3)' }}>Главная</Link>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/</span>
        <Link href="/catalog" style={{ fontSize: 11, color: 'var(--text-3)' }}>Перевозчики</Link>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/</span>
        <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>{driver.user.name}</span>
      </div>

      {/* HERO */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{ width: 68, height: 68, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
            <IconUser size={26} style={{ color: 'var(--text-3)' }} />
            {driver.online && (
              <div style={{ position: 'absolute', bottom: 3, right: 3, width: 11, height: 11, borderRadius: '50%', background: 'var(--online)', border: '2px solid var(--surface)' }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
              {driver.user.name}
              {driver.verified && <span className="badge-verified"><IconShieldCheck size={10} /> Проверен</span>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 7 }}>
              <Meta icon={<IconMapPin size={11} />}>{driver.city}</Meta>
              <Meta icon={<IconCalendar size={11} />}>На TruckHUB с 2023</Meta>
              {driver.online && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}><IconClock size={11} /> Онлайн</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)' }}>{driver.rating}</span>
              <span style={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((i) => <IconStarFilled key={i} size={13} style={{ color: 'var(--star)' }} />)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{driver.reviews} {driver.reviews === 1 ? 'отзыв' : driver.reviews < 5 ? 'отзыва' : 'отзывов'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
            {me === null ? (
              <Link href={`/login?from=/driver/${driver.id}`} className="btn btn-primary"><IconMessageCircle size={13} /> Написать</Link>
            ) : me?.role === 'CLIENT' ? (
              <button className="btn btn-primary" disabled title="Чат — скоро"><IconMessageCircle size={13} /> Написать</button>
            ) : me?.role === 'DRIVER' ? (
              <Link href="/orders" className="btn btn-secondary">Найти грузы</Link>
            ) : null}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid var(--border-soft)', borderRadius: 10, overflow: 'hidden' }}>
          {[[String(driver.reviews), 'Отзывов'], [String(driver.trips), 'Рейсов'], ['1 авто', 'В парке'], ['< 1 ч', 'Ответ']].map(([n, l], i) => (
            <div key={i} style={{ textAlign: 'center', padding: '9px 6px', borderRight: i < 3 ? '1px solid var(--border-soft)' : 'none', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{n}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS + CONTENT */}
      <div className="layout-driver">
        <div>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-soft)', background: 'var(--surface)' }}>
            {([['trucks', 'Автомобили'], ['reviews', `Отзывы (${driver.reviews})`], ['routes', 'Маршруты']] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '11px 15px', fontSize: 12, fontWeight: 600, color: tab === t ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, background: 'transparent' }}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'trucks' && (
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Автопарк</div>
              <div className="card" style={{ overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: 76, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-soft)' }}>
                  <IconTruck size={26} style={{ color: 'var(--text-3)' }} />
                </div>
                <div style={{ padding: '11px 13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{driver.truck}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>{driver.priceKm} ₸/км</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 9 }}>
                    {[['Грузоподъём.', driver.capacity]].map(([l, v]) => (
                      <div key={l} style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)', borderRadius: 6, padding: '6px 9px' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-3)', marginBottom: 1 }}>{l}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {driver.features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {driver.features.map((f) => <span key={f} className="spec-tag">{f}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Отзывы клиентов</div>
              {driver.reviews === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>Отзывов пока нет</div>
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
                  Система отзывов скоро появится
                </div>
              )}
            </div>
          )}

          {tab === 'routes' && (
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Регулярные маршруты</div>
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
                Водитель ещё не добавил регулярные маршруты
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside style={{ borderLeft: '1px solid var(--border-soft)', background: 'var(--surface)', padding: 14 }}>
          <div className="card" style={{ padding: 14, marginBottom: 10, background: 'var(--surface-2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Стоимость перевозки</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>от</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.03em' }}>{driver.priceKm}</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)' }}>₸/км</span>
              </div>
            </div>
            {me === null ? (
              <Link href={`/login?from=/driver/${driver.id}`} className="btn btn-primary" style={{ width: '100%', marginBottom: 7 }}><IconMessageCircle size={13} /> Написать водителю</Link>
            ) : me?.role === 'CLIENT' ? (
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: 7, opacity: 0.6, cursor: 'not-allowed' }} disabled>
                <IconMessageCircle size={13} /> Чат — скоро
              </button>
            ) : null}
            <Link href="/orders/new" className="btn btn-secondary" style={{ width: '100%' }}><IconFilePlus size={12} /> Создать заявку</Link>
            <div style={{ height: 1, background: 'var(--border-soft)', margin: '11px 0' }} />
            {[['Статус', driver.online ? 'Онлайн' : 'Офлайн'], ['Рейсов', String(driver.trips)]].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{l}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: i === 0 && driver.online ? 'var(--online)' : 'var(--text)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i === 0 && driver.online && <IconCircleFilled size={8} style={{ color: 'var(--online)' }} />}{v}
                </span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Безопасность TruckHUB</div>
            {['Документы проверены', `Рейтинг ${driver.rating} · ${driver.reviews} отзывов`, 'Чат внутри платформы'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 11, color: 'var(--text-2)' }}>
                <IconShieldCheck size={13} style={{ color: 'var(--verified-text)' }} /> {t}
              </div>
            ))}
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, paddingLeft: 19 }}>Оплата через эскроу — скоро</div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-2)' }}>{icon} {children}</span>;
}
