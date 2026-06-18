import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  IconShieldCheck,
  IconTruck,
  IconMessageCircle,
  IconMapPin,
  IconStar,
  IconCheck,
  IconPhone,
} from '@tabler/icons-react';

export const metadata = {
  title: 'О сервисе — TruckHUB',
  description: 'TruckHUB — платформа грузоперевозок по СНГ. Проверенные водители, прямая связь, без посредников.',
};

const features = [
  {
    icon: <IconShieldCheck size={20} />,
    title: 'Проверенные водители',
    desc: 'Каждый перевозчик проходит верификацию документов перед публикацией в каталоге.',
  },
  {
    icon: <IconMessageCircle size={20} />,
    title: 'Без посредников',
    desc: 'Клиент и водитель общаются напрямую в чате. Никаких диспетчеров, никакой наценки.',
  },
  {
    icon: <IconMapPin size={20} />,
    title: '6 стран СНГ',
    desc: 'Казахстан, Россия, Кыргызстан, Узбекистан, Беларусь, Азербайджан.',
  },
  {
    icon: <IconTruck size={20} />,
    title: 'Любой транспорт',
    desc: 'Газели, рефрижераторы, фуры, манипуляторы — от 500 кг до 20 тонн.',
  },
];

const steps = [
  { n: '01', t: 'Проверка удостоверения', d: 'Водительское удостоверение и паспорт верифицируются при регистрации.' },
  { n: '02', t: 'Технический осмотр', d: 'Водитель прикладывает документы на ТС и фото автомобиля.' },
  { n: '03', t: 'Рейтинг и отзывы', d: 'После каждого рейса клиент оставляет оценку. Рейтинг виден всем.' },
  { n: '04', t: 'Служба поддержки', d: 'Сообщения о нарушениях обрабатываются в течение 24 часов.' },
];

const faq = [
  { q: 'Сколько стоит размещение на платформе?', a: 'Регистрация и размещение объявлений бесплатны. Монетизация — PRO-подписка для водителей с расширенными возможностями (скоро).' },
  { q: 'Как оплачивается перевозка?', a: 'Сейчас — напрямую между клиентом и водителем. Эскроу-оплата через платформу запускается в следующей версии.' },
  { q: 'Что делать, если возник спор?', a: 'Напишите в поддержку через чат на сайте. Медиация споров — часть гарантий платформы.' },
  { q: 'Доступна ли платформа для юрлиц?', a: 'Да. ТОО и ИП могут размещать заявки, получать закрывающие документы — функция в разработке.' },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: '52px 24px 44px', textAlign: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, marginBottom: 16, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border-soft)' }}>
          <IconShieldCheck size={12} /> Грузоперевозки без лишних звеньев
        </span>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 14, color: 'var(--text)' }}>
          TruckHUB — прямая связь<br />между грузом и <span style={{ color: 'var(--accent)' }}>водителем</span>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Мы убрали диспетчеров и лишние комиссии. Клиент размещает заявку или находит водителя сам — и сразу договаривается в чате. Никаких звонков посредникам, никакой наценки.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary" style={{ padding: '11px 22px', fontSize: 13 }}>Зарегистрироваться</Link>
          <Link href="/catalog" className="btn btn-secondary" style={{ fontSize: 13 }}>Каталог перевозчиков</Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'flex', borderBottom: '1px solid var(--border-soft)', background: 'var(--bg)' }}>
        {[
          { n: '4 800+', l: 'Перевозчиков' },
          { n: '12 300', l: 'Рейсов выполнено' },
          { n: '6 стран', l: 'Покрытие СНГ' },
          { n: '4.8', l: 'Средний рейтинг', star: true },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '20px 8px', borderRight: i < 3 ? '1px solid var(--border-soft)' : 'none' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {s.n} {s.star && <IconStar size={16} style={{ color: 'var(--star)' }} fill="var(--star)" />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '36px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, color: 'var(--text)' }}>Почему TruckHUB</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '16px 14px', border: '1px solid var(--border-soft)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 9, background: 'var(--accent-bg)', color: 'var(--accent)', marginBottom: 10, border: '1px solid var(--accent)' }}>
                {f.icon}
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY */}
      <section style={{ padding: '36px 24px', background: 'var(--bg)', borderBottom: '1px solid var(--border-soft)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text)' }}>Как мы проверяем водителей</h2>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.5 }}>Значок «Проверен» появляется только после прохождения всех шагов</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ background: 'var(--surface)', borderRadius: 10, padding: 14, border: '1px solid var(--border-soft)', display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', flexShrink: 0, paddingTop: 2 }}>{s.n}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{s.t}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '36px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, color: 'var(--text)' }}>Частые вопросы</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 640 }}>
          {faq.map((item) => (
            <div key={item.q} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border-soft)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6, display: 'flex', gap: 8 }}>
                <IconCheck size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                {item.q}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: 22 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTS */}
      <section style={{ padding: '36px 24px', background: 'var(--bg)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text)' }}>Контакты</h2>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 18, lineHeight: 1.5 }}>Поддержка работает ежедневно с 8:00 до 22:00 (Алматы, UTC+5)</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="mailto:hello@truckhub.kz" className="btn btn-secondary" style={{ fontSize: 12 }}>
            hello@truckhub.kz
          </a>
          <a href="https://t.me/truckhub_support" className="btn btn-secondary" style={{ fontSize: 12 }}>
            <IconPhone size={13} /> Telegram поддержка
          </a>
        </div>
      </section>
    </main>
  );
}
