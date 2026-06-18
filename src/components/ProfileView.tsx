'use client';

import Link from 'next/link';
import { IconUser, IconBolt, IconPlus, IconTruck, IconStar, IconMapPin, IconArrowRight, IconMessageCircle } from '@tabler/icons-react';

interface Order {
  id: string;
  fromCity: string;
  toCity: string;
  cargo: string;
  status: string;
  urgent: boolean;
  createdAt: Date;
  budget: number | null;
  negotiable: boolean;
  _count: { responses: number };
}

interface DriverResponse {
  id: string;
  price: number;
  message: string;
  createdAt: Date;
  order: {
    id: string;
    fromCity: string;
    toCity: string;
    cargo: string;
    status: string;
    urgent: boolean;
    client: { name: string };
  };
}

interface DriverProfileData {
  id: string;
  city: string;
  truck: string;
  capacity: string;
  priceKm: number;
  rating: number;
  reviews: number;
  trips: number;
  verified: boolean;
  pro: boolean;
  online: boolean;
  responses: DriverResponse[];
}

interface ProfileUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: Date;
  orders: Order[];
  driverProfile: DriverProfileData | null;
}

export function ProfileView({ user }: { user: ProfileUser }) {
  const joinedYear = new Date(user.createdAt).getFullYear();
  const isDriver = user.role === 'DRIVER';
  const driverResponses = user.driverProfile?.responses ?? [];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconUser size={22} style={{ color: 'var(--text-3)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 3 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {isDriver ? 'Перевозчик' : 'Клиент'} · {user.phone} · На TruckHUB с {joinedYear}
          </div>
        </div>
      </div>

      {/* Driver profile card */}
      {isDriver && user.driverProfile && (
        <div className="card" style={{ padding: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconTruck size={15} style={{ color: 'var(--accent)' }} /> Профиль перевозчика
            </div>
            <Link href={`/driver/${user.driverProfile.id}`} className="btn btn-secondary" style={{ fontSize: 11, padding: '5px 12px' }}>
              Открытый профиль
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
            {[
              ['Рейтинг', <span key="r" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconStar size={12} style={{ color: 'var(--star)' }} />{user.driverProfile.rating}</span>],
              ['Рейсов', user.driverProfile.trips],
              ['Отзывов', user.driverProfile.reviews],
            ].map(([label, value]) => (
              <div key={String(label)} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border-soft)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconMapPin size={12} /> {user.driverProfile.city}</span>
            <span>{user.driverProfile.truck}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{user.driverProfile.priceKm} ₸/км</span>
          </div>
        </div>
      )}

      {/* Driver: responded orders */}
      {isDriver && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
              Мои отклики
              {driverResponses.length > 0 && (
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: 'var(--text-3)' }}>{driverResponses.length}</span>
              )}
            </div>
            <Link href="/orders" className="btn btn-primary" style={{ fontSize: 12 }}>
              <IconMessageCircle size={12} /> Найти грузы
            </Link>
          </div>

          {driverResponses.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>Вы ещё не откликались на заявки</div>
              <Link href="/orders" className="btn btn-primary">Открыть доску заявок</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {driverResponses.map((r) => (
                <Link key={r.id} href={`/order/${r.order.id}`} className="card" style={{ padding: '12px 14px', display: 'block', borderLeft: r.order.urgent ? '3px solid var(--accent)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                        {r.order.fromCity} <IconArrowRight size={12} style={{ color: 'var(--text-3)' }} /> {r.order.toCity}
                        {r.order.urgent && <span className="badge-urgent"><IconBolt size={9} /> СРОЧНО</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{r.order.cargo}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
                        {r.price.toLocaleString('ru')} ₸
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                        {r.order.status === 'CLOSED' ? (
                          <span style={{ color: 'var(--text-3)' }}>Заявка закрыта</span>
                        ) : (
                          <span style={{ color: 'var(--verified-text)' }}>Активна</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    Клиент: {r.order.client.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Client: their orders */}
      {!isDriver && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Мои заявки</div>
            <Link href="/orders/new" className="btn btn-primary" style={{ fontSize: 12 }}>
              <IconPlus size={12} /> Новая заявка
            </Link>
          </div>

          {user.orders.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>У вас пока нет заявок</div>
              <Link href="/orders/new" className="btn btn-primary">Разместить первую заявку</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {user.orders.map((o) => (
                <Link key={o.id} href={`/order/${o.id}`} className="card" style={{ padding: '12px 14px', display: 'block', borderLeft: o.urgent ? '3px solid var(--accent)' : undefined, opacity: o.status === 'CLOSED' ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                        {o.fromCity} → {o.toCity}
                        {o.urgent && <span className="badge-urgent"><IconBolt size={9} /> СРОЧНО</span>}
                        {o.status === 'CLOSED' && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border-soft)' }}>ЗАКРЫТА</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{o.cargo}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>
                        {o.negotiable ? 'Договорная' : o.budget ? `${o.budget.toLocaleString('ru')} ₸` : '—'}
                      </div>
                      <div style={{ fontSize: 10, color: o._count.responses > 0 ? 'var(--accent)' : 'var(--text-3)', marginTop: 2 }}>
                        {o._count.responses} {o._count.responses === 1 ? 'отклик' : o._count.responses < 5 ? 'отклика' : 'откликов'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
