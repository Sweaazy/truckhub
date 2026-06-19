'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResponseItem } from '@/lib/types';
import {
  IconArrowRight, IconBolt, IconCalendar, IconCheck,
  IconCurrencyTenge, IconLock, IconMapPin, IconMessageCircle,
  IconStar, IconUser, IconX,
} from '@tabler/icons-react';

interface OrderDetailProps {
  id: string;
  clientId: string;
  fromCity: string;
  toCity: string;
  cargo: string;
  date: string;
  budget: number | null;
  negotiable: boolean;
  specs: string[];
  clientName: string;
  initialResponseCount: number;
  initialResponses: ResponseItem[];
  initialStatus: string;
  createdAt: string;
  urgent: boolean;
}

interface Me { id: string; role: string }

export function OrderDetail(props: OrderDetailProps) {
  const { id, clientId, fromCity, toCity, cargo, date, budget, negotiable, specs, clientName, initialResponseCount, initialResponses, initialStatus, createdAt, urgent } = props;

  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [responses, setResponses] = useState<ResponseItem[]>(initialResponses);
  const [responseCount, setResponseCount] = useState(initialResponseCount);
  const [status, setStatus] = useState(initialStatus);
  const [closeLoading, setCloseLoading] = useState(false);
  const [trackingNo, setTrackingNo] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const isOwner = me !== null && me !== undefined && me.id === clientId;
  const canSubmit = price.trim() !== '' && message.trim().length > 9;

  const budgetDisplay = negotiable ? 'Договорная' : budget ? `${budget.toLocaleString('ru')} ₸` : '—';

  const postedAgo = (() => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} мин. назад`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ч. назад`;
    return `${Math.floor(hrs / 24)} дн. назад`;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch(`/api/orders/${id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(price), message }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? 'Ошибка отправки'); return; }
      setSubmitted(true);
      setResponseCount((c) => c + 1);
    } catch {
      setFormError('Не удалось подключиться к серверу');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleClose(driverProfileId?: string) {
    setCloseLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CLOSED', driverProfileId }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus('CLOSED');
        if (data.trackingNo) setTrackingNo(data.trackingNo);
      }
    } finally {
      setCloseLoading(false);
    }
  }

  async function handleReopen() {
    setCloseLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });
      if (res.ok) setStatus('ACTIVE');
    } finally {
      setCloseLoading(false);
    }
  }

  return (
    <>
      {/* BREADCRUMB */}
      <div style={{ padding: '9px 20px', borderBottom: '1px solid var(--border-soft)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href="/" style={{ fontSize: 11, color: 'var(--text-3)' }}>Главная</Link>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/</span>
        <Link href="/orders" style={{ fontSize: 11, color: 'var(--text-3)' }}>Доска заявок</Link>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/</span>
        <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>Заявка #{id.slice(-6)}</span>
        {status === 'CLOSED' && (
          <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border-soft)' }}>
            ЗАКРЫТА
          </span>
        )}
      </div>

      <div className="layout-sidebar-right">
        {/* MAIN */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border-soft)' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                {fromCity} <IconArrowRight size={18} style={{ color: 'var(--text-3)' }} /> {toCity}
              </h1>
              {urgent && <span className="badge-urgent"><IconBolt size={10} /> СРОЧНО</span>}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{cargo}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <DetailCard icon={<IconCalendar size={14} />} label="Дата отправки" value={date} />
            <DetailCard icon={<IconCurrencyTenge size={14} />} label="Бюджет" value={budgetDisplay} accent />
            <DetailCard icon={<IconMapPin size={14} />} label="Откуда" value={fromCity} />
            <DetailCard icon={<IconMapPin size={14} />} label="Куда" value={toCity} />
          </div>

          {specs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Требования к перевозке</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {specs.map((s) => <span key={s} className="spec-tag" style={{ fontSize: 12, padding: '5px 10px' }}>{s}</span>)}
              </div>
            </div>
          )}

          <div style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)', flexShrink: 0 }}>
              <IconUser size={14} />
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{clientName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Частное лицо · Размещено {postedAgo}</div>
            </div>
            {responseCount > 0 && (
              <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>
                {responseCount} {responseCount === 1 ? 'отклик' : responseCount < 5 ? 'отклика' : 'откликов'}
              </div>
            )}
          </div>

          {/* Tracking banner — shown after driver is selected */}
          {isOwner && trackingNo && (
            <div style={{ marginTop: 20, padding: '16px 18px', background: 'var(--verified-bg)', border: '1px solid var(--verified-border)', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--verified-text)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                Перевозка создана
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.08em', color: 'var(--verified-text)', marginBottom: 4 }}>
                {trackingNo}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                Номер для отслеживания. Водитель будет обновлять статус — следи в личном кабинете.
              </div>
            </div>
          )}

          {/* Responses list — visible to order owner */}
          {isOwner && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Отклики перевозчиков
                {responses.length > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: 'var(--text-3)' }}>{responses.length}</span>
                )}
              </div>

              {responses.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
                  Откликов пока нет. Перевозчики увидят вашу заявку и напишут сами.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {responses.map((r) => (
                    <div key={r.id} className="card" style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{r.driverProfile.user.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <IconStar size={11} style={{ color: 'var(--star)' }} fill="var(--star)" />
                              {r.driverProfile.rating}
                              <span style={{ color: 'var(--text-3)' }}>({r.driverProfile.reviews})</span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <IconMapPin size={10} /> {r.driverProfile.city}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>{r.price.toLocaleString('ru')} ₸</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 12, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
                        {r.message}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/driver/${r.driverProfile.id}`} className="btn btn-secondary" style={{ fontSize: 11 }}>
                          Профиль водителя
                        </Link>
                        {status === 'ACTIVE' && (
                          <button
                            className="btn btn-primary"
                            style={{ fontSize: 11 }}
                            onClick={() => handleClose(r.driverProfile.id)}
                            disabled={closeLoading}
                          >
                            <IconCheck size={12} /> Выбрать этого водителя
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside style={{ padding: '20px 16px', background: 'var(--surface)' }}>
          {/* Owner controls */}
          {isOwner && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Управление заявкой</div>
              {status === 'ACTIVE' ? (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: 12 }}
                  onClick={handleClose}
                  disabled={closeLoading}
                >
                  <IconX size={13} /> {closeLoading ? 'Закрываем...' : 'Закрыть заявку'}
                </button>
              ) : (
                <>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    Заявка закрыта и не отображается в поиске
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: 12 }}
                    onClick={handleReopen}
                    disabled={closeLoading}
                  >
                    {closeLoading ? 'Открываем...' : 'Открыть заново'}
                  </button>
                </>
              )}
              <div style={{ height: 1, background: 'var(--border-soft)', margin: '16px 0' }} />
            </div>
          )}

          {/* Non-authenticated */}
          {me === null && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border-soft)', marginBottom: 12 }}>
                <IconLock size={20} style={{ color: 'var(--text-3)' }} />
              </span>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Нужна авторизация</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 18 }}>
                Чтобы откликнуться на заявку, войдите как водитель
              </p>
              <Link href={`/login?from=/order/${id}`} className="btn btn-primary" style={{ width: '100%', marginBottom: 8, fontSize: 13 }}>
                Войти
              </Link>
              <Link href="/register" className="btn btn-secondary" style={{ width: '100%', fontSize: 13 }}>
                Зарегистрироваться
              </Link>
            </div>
          )}

          {/* Client who is NOT the owner */}
          {me?.role === 'CLIENT' && !isOwner && (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Вы вошли как клиент</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                На заявки могут откликаться только перевозчики
              </p>
            </div>
          )}

          {/* Driver response form */}
          {(me === undefined || me?.role === 'DRIVER') && !isOwner && (submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: 'var(--verified-bg)', border: '2px solid var(--verified-border)', marginBottom: 14 }}>
                <IconCheck size={26} color="var(--verified-text)" strokeWidth={2.5} />
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Отклик отправлен!</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 18 }}>
                Клиент получит уведомление и свяжется с вами в чате.
              </p>
              <Link href="/orders" className="btn btn-secondary" style={{ width: '100%', fontSize: 12 }}>
                Вернуться к заявкам
              </Link>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Откликнуться на заявку</div>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16, lineHeight: 1.5 }}>
                Предложите свою цену и расскажите почему именно вы
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">Ваша цена</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="40 000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ paddingRight: 32 }}
                      required
                    />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text-3)', pointerEvents: 'none' }}>₸</span>
                  </div>
                  {!negotiable && budget && (
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>Клиент готов: {budget.toLocaleString('ru')} ₸</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Сообщение клиенту</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Здравствуйте! Готов выполнить перевозку. Машина подходит под ваши параметры..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ minHeight: 96 }}
                    required
                  />
                </div>

                {formError && (
                  <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-text)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--danger-text)' }}>
                    {formError}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={!canSubmit || formLoading} style={{ padding: '11px 16px', fontSize: 13, opacity: canSubmit && !formLoading ? 1 : 0.5 }}>
                  <IconMessageCircle size={14} /> {formLoading ? 'Отправляем...' : 'Отправить отклик'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
                  Заполните цену и сообщение, чтобы отправить отклик
                </p>
              </form>

              <div style={{ height: 1, background: 'var(--border-soft)', margin: '16px 0' }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Безопасность TruckHUB</div>
              {['Личность клиента подтверждена', 'Чат внутри платформы', 'Эскроу-оплата — скоро'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 11, color: 'var(--text-2)' }}>
                  <IconCheck size={12} style={{ color: 'var(--verified-text)', flexShrink: 0 }} /> {t}
                </div>
              ))}
            </>
          ))}
        </aside>
      </div>
    </>
  );
}

function DetailCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 10, padding: '11px 13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: accent ? 'var(--accent)' : 'var(--text)', letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}
