'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconPackage,
  IconTruck,
  IconCheck,
  IconSearch,
  IconShieldCheck,
  IconStar,
  IconPlus,
} from '@tabler/icons-react';

type Role = 'client' | 'driver';

const driverSteps = [
  { n: '01', t: 'Добавьте авто', d: 'Фото, габариты, цена — 5 минут' },
  { n: '02', t: 'Найдите груз', d: 'Заявки по вашему маршруту' },
  { n: '03', t: 'Договоритесь и едьте', d: 'Связывайтесь с клиентом в чате' },
];

const clientPaths = {
  post: [
    { n: '01', t: 'Опишите маршрут и груз', d: 'Откуда, куда, что везёте — за 2 минуты' },
    { n: '02', t: 'Водители откликнутся', d: 'Получите предложения с ценами' },
    { n: '03', t: 'Выберите лучшее', d: 'Договоритесь в чате напрямую' },
  ],
  browse: [
    { n: '01', t: 'Откройте каталог', d: 'Тысячи проверенных перевозчиков' },
    { n: '02', t: 'Сравните и выберите', d: 'Рейтинг, отзывы, цены и фото авто' },
    { n: '03', t: 'Напишите напрямую', d: 'Без посредников — только вы и водитель' },
  ],
};

export function HomeContent() {
  const [role, setRole] = useState<Role>('client');

  return (
    <>
      {/* HERO */}
      <section style={{ padding: '48px 24px 40px', textAlign: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600,
            padding: '4px 12px', borderRadius: 20, marginBottom: 16,
            background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border-soft)',
          }}
        >
          <IconShieldCheck size={12} /> Проверенные перевозчики по СНГ
        </span>

        {/* Фиксированная высота — блок не прыгает при смене роли */}
        <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, color: 'var(--text)', margin: 0 }}>
            {role === 'client' ? (
              <>Найдите надёжного<br />перевозчика <span style={{ color: 'var(--accent)' }}>за минуты</span></>
            ) : (
              <>Найдите грузы<br />по <span style={{ color: 'var(--accent)' }}>своему маршруту</span></>
            )}
          </h1>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 360, margin: '0 auto 32px', lineHeight: 1.6 }}>
          {role === 'client'
            ? 'Тысячи проверенных водителей. Переезды, доставка, дальнобой. Договаривайтесь напрямую — без посредников.'
            : 'Найдите грузы по своему маршруту. Клиенты уже ждут. Регистрация бесплатная — без комиссии на старте.'}
        </p>

        {/* ROLE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480, margin: '0 auto 28px' }}>
          <RoleCard active={role === 'client'} onClick={() => setRole('client')} icon={<IconPackage size={18} />} title="Мне нужна перевозка" sub="Размещу заявку или найду перевозчика" />
          <RoleCard active={role === 'driver'} onClick={() => setRole('driver')} icon={<IconTruck size={18} />} title="Я водитель / перевозчик" sub="Размещу авто и найду грузы" />
        </div>

        {/* CTA — для клиента два пути, для водителя один */}
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', gap: 10 }}>
          {role === 'client' ? (
            <>
              <Link href="/orders/new" className="btn btn-primary" style={{ flex: 1, padding: 12, fontSize: 13 }}>
                <IconPlus size={15} /> Разместить заявку
              </Link>
              <Link href="/catalog" className="btn btn-secondary" style={{ flex: 1, padding: 12, fontSize: 13 }}>
                <IconSearch size={15} /> Найти перевозчика
              </Link>
            </>
          ) : (
            <Link href="/orders" className="btn btn-primary" style={{ flex: 1, padding: 12, fontSize: 14 }}>
              <IconSearch size={16} /> Найти подходящие грузы
            </Link>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-row" style={{ display: 'flex', borderBottom: '1px solid var(--border-soft)', background: 'var(--bg)' }}>
        {[
          { n: '4 800+', l: 'Перевозчиков' },
          { n: '12 300', l: 'Рейсов выполнено' },
          { n: '6 стран', l: 'Покрытие СНГ' },
          { n: '4.8', l: 'Средний рейтинг', star: true },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '20px 8px', borderRight: i < 3 ? '1px solid var(--border-soft)' : 'none' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {s.n} {s.star && <IconStar size={15} style={{ color: 'var(--star)' }} fill="var(--star)" />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '32px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)' }}>
        {role === 'driver' ? (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text)' }}>
              Как найти груз
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {driverSteps.map((s) => (
                <div key={s.n} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 14, border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, letterSpacing: '0.04em' }}>{s.n}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text)' }}>
              Два способа организовать перевозку
            </h2>
            <div className="paths-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'start' }}>
              {/* Путь 1 */}
              <PathCard
                icon={<IconPlus size={16} />}
                title="Разместить заявку"
                sub="Опишите груз — водители откликнутся сами"
                steps={clientPaths.post}
                href="/orders/new"
                cta="Разместить заявку"
              />

              {/* Разделитель */}
              <div className="paths-divider" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 40 }}>
                <div style={{ width: 1, height: 32, background: 'var(--border-soft)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em' }}>ИЛИ</span>
                <div style={{ width: 1, height: 32, background: 'var(--border-soft)' }} />
              </div>

              {/* Путь 2 */}
              <PathCard
                icon={<IconSearch size={16} />}
                title="Найти перевозчика"
                sub="Выберите водителя из каталога сами"
                steps={clientPaths.browse}
                href="/catalog"
                cta="Открыть каталог"
              />
            </div>
          </>
        )}
      </section>
    </>
  );
}

function PathCard({
  icon, title, sub, steps, href, cta,
}: {
  icon: React.ReactNode; title: string; sub: string;
  steps: { n: string; t: string; d: string }[];
  href: string; cta: string;
}) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, border: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{title}</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4 }}>{sub}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {steps.map((s) => (
          <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', paddingTop: 2, flexShrink: 0 }}>{s.n}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{s.t}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
      <Link href={href} className="btn btn-primary" style={{ padding: '9px 14px', fontSize: 12, marginTop: 'auto' }}>
        {cta} →
      </Link>
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative', border: `2px solid ${active ? 'var(--accent)' : 'var(--border-soft)'}`,
        borderRadius: 12, padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
        background: 'var(--surface-2)', transition: 'border-color 0.15s ease',
      }}
    >
      {active && <span style={{ position: 'absolute', inset: 0, borderRadius: 11, background: 'var(--accent)', opacity: 0.07, pointerEvents: 'none' }} />}
      <span
        style={{
          position: 'absolute', top: 10, right: 10, width: 16, height: 16, borderRadius: '50%',
          border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          background: active ? 'var(--accent)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {active && <IconCheck size={9} color="#fff" />}
      </span>
      <span
        style={{
          width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 10, background: active ? 'var(--accent)' : 'var(--surface)',
          color: active ? '#fff' : 'var(--text-2)', border: '1px solid var(--border-soft)',
        }}
      >
        {icon}
      </span>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{sub}</div>
    </button>
  );
}
