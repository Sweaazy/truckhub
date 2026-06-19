'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconUser, IconBolt, IconPlus, IconTruck, IconStar, IconMapPin,
  IconArrowRight, IconMessageCircle, IconPackage, IconShieldCheck, IconAlertTriangle,
} from '@tabler/icons-react';
import { TelegramLinkButton } from './TelegramLinkButton';

const SHIPMENT_STATUSES = [
  { code: 'PREPARING',  label: 'Подготовка к отправке' },
  { code: 'PICKED_UP',  label: 'Груз забран' },
  { code: 'IN_TRANSIT', label: 'В пути' },
  { code: 'DELIVERED',  label: 'Доставлено' },
];

function statusLabel(code: string) {
  return SHIPMENT_STATUSES.find((s) => s.code === code)?.label ?? code;
}

function statusColor(code: string) {
  if (code === 'DELIVERED') return 'var(--verified-text)';
  if (code === 'IN_TRANSIT') return 'var(--accent)';
  return 'var(--text-2)';
}

interface ShipmentData {
  id: string;
  trackingNo: string;
  status: string;
  createdAt: Date;
  order: { fromCity: string; toCity: string; cargo: string; currency: string; budget: number | null; negotiable: boolean };
  driver?: { city: string; truck: string; user: { name: string } };
  client?: { name: string };
}

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
  shipments: ShipmentData[];
}

interface ProfileUser {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: Date;
  phoneVerified: boolean;
  orders: Order[];
  shipments: ShipmentData[];
  driverProfile: DriverProfileData | null;
}

function ShipmentTimeline({ status }: { status: string }) {
  const idx = SHIPMENT_STATUSES.findIndex((s) => s.code === status);
  return (
    <div style={{ display: 'flex', gap: 0, marginTop: 10 }}>
      {SHIPMENT_STATUSES.map((s, i) => (
        <div key={s.code} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {i > 0 && (
            <div style={{
              position: 'absolute', left: '-50%', top: 7, width: '100%', height: 2,
              background: i <= idx ? 'var(--accent)' : 'var(--border-soft)',
            }} />
          )}
          <div style={{
            width: 16, height: 16, borderRadius: '50%', border: '2px solid',
            borderColor: i <= idx ? 'var(--accent)' : 'var(--border-soft)',
            background: i <= idx ? 'var(--accent)' : 'var(--bg)',
            position: 'relative', zIndex: 1, flexShrink: 0,
          }} />
          <div style={{ fontSize: 9, color: i <= idx ? 'var(--accent)' : 'var(--text-3)', textAlign: 'center', marginTop: 4, lineHeight: 1.3, maxWidth: 60 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function DriverShipmentCard({ shipment }: { shipment: ShipmentData }) {
  const [status, setStatus] = useState(shipment.status);
  const [loading, setLoading] = useState(false);

  const currentIdx = SHIPMENT_STATUSES.findIndex((s) => s.code === status);
  const nextStatus = SHIPMENT_STATUSES[currentIdx + 1];

  async function advance() {
    if (!nextStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.trackingNo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus.code }),
      });
      if (res.ok) setStatus(nextStatus.code);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {shipment.order.fromCity} <IconArrowRight size={12} style={{ color: 'var(--text-3)' }} /> {shipment.order.toCity}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{shipment.order.cargo}</div>
          {shipment.client && (
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Клиент: {shipment.client.name}</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 2 }}>
            {shipment.trackingNo}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: statusColor(status) }}>{statusLabel(status)}</div>
        </div>
      </div>
      <ShipmentTimeline status={status} />
      {nextStatus && (
        <button
          className="btn btn-primary"
          style={{ marginTop: 12, fontSize: 11, width: '100%' }}
          onClick={advance}
          disabled={loading}
        >
          {loading ? 'Обновляем...' : `Отметить: ${nextStatus.label}`}
        </button>
      )}
      {status === 'DELIVERED' && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--verified-text)', fontWeight: 700, textAlign: 'center' }}>
          ✓ Груз доставлен
        </div>
      )}
    </div>
  );
}

export function ProfileView({ user }: { user: ProfileUser }) {
  const joinedYear = new Date(user.createdAt).getFullYear();
  const isDriver = user.role === 'DRIVER';
  const driverResponses = user.driverProfile?.responses ?? [];
  const driverShipments = user.driverProfile?.shipments ?? [];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconUser size={22} style={{ color: 'var(--text-3)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            {user.name}
            {user.phoneVerified
              ? <IconShieldCheck size={16} style={{ color: 'var(--verified-text)', flexShrink: 0 }} />
              : <IconAlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {isDriver ? 'Перевозчик' : 'Клиент'} {user.phone ? `· ${user.phone}` : ''} · На TruckHUB с {joinedYear}
          </div>
        </div>
      </div>

      {/* Verification banner */}
      {!user.phoneVerified && (
        <div style={{ marginBottom: 24, padding: '16px 18px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconAlertTriangle size={14} /> Аккаунт не верифицирован
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4, lineHeight: 1.6 }}>
            Без верификации вы не можете {isDriver ? 'откликаться на заявки и ваш профиль не виден в каталоге' : 'создавать заявки'}.
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.6 }}>
            Нажмите кнопку ниже → откроется окно Telegram → войдите через приложение → аккаунт будет подтверждён. Код придёт в Telegram-приложение, не в SMS.
          </div>
          <TelegramLinkButton />
        </div>
      )}

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

      {/* Driver: active shipments */}
      {isDriver && driverShipments.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconPackage size={16} style={{ color: 'var(--accent)' }} />
            Мои перевозки
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)' }}>{driverShipments.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {driverShipments.map((s) => (
              <DriverShipmentCard key={s.id} shipment={s} />
            ))}
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

      {/* Client: shipment tracking */}
      {!isDriver && user.shipments.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconPackage size={16} style={{ color: 'var(--accent)' }} />
            Мои перевозки
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)' }}>{user.shipments.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user.shipments.map((s) => (
              <div key={s.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.order.fromCity} <IconArrowRight size={12} style={{ color: 'var(--text-3)' }} /> {s.order.toCity}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{s.order.cargo}</div>
                    {s.driver && (
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        Водитель: {s.driver.user.name} · {s.driver.truck}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 3 }}>
                      {s.trackingNo}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: statusColor(s.status) }}>
                      {statusLabel(s.status)}
                    </div>
                  </div>
                </div>
                <ShipmentTimeline status={s.status} />
              </div>
            ))}
          </div>
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
