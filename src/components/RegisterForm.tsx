'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  IconPackage, IconTruck, IconCheck, IconArrowLeft, IconArrowRight, IconMapPin, IconEye, IconEyeOff,
} from '@tabler/icons-react';

type Role = 'client' | 'driver';
type ClientType = 'person' | 'ip' | 'too';
type Step = 1 | 2 | 3;

const CITIES_BY_COUNTRY: { country: string; cities: string[] }[] = [
  { country: 'Армения', cities: ['Ереван', 'Гюмри', 'Ванадзор'] },
  { country: 'Азербайджан', cities: ['Баку', 'Гянджа', 'Сумгаит', 'Мингечевир', 'Нахчыван'] },
  { country: 'Беларусь', cities: ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест', 'Бобруйск', 'Барановичи'] },
  { country: 'Грузия', cities: ['Тбилиси', 'Кутаиси', 'Батуми', 'Рустави', 'Зугдиди'] },
  { country: 'Казахстан', cities: ['Алматы', 'Астана', 'Шымкент', 'Актобе', 'Атырау', 'Актау', 'Павлодар', 'Усть-Каменогорск', 'Тараз', 'Семей', 'Кызылорда', 'Петропавловск', 'Талдыкорган', 'Темиртау', 'Костанай', 'Уральск'] },
  { country: 'Кыргызстан', cities: ['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Токмок', 'Нарын'] },
  { country: 'Молдова', cities: ['Кишинёв', 'Тирасполь', 'Бельцы', 'Бендеры'] },
  { country: 'Россия', cities: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Красноярск', 'Омск', 'Самара', 'Ростов-на-Дону', 'Уфа', 'Краснодар', 'Волгоград', 'Пермь', 'Воронеж', 'Тюмень', 'Саратов', 'Тольятти', 'Ставрополь', 'Хабаровск', 'Владивосток', 'Иркутск', 'Барнаул', 'Томск'] },
  { country: 'Таджикистан', cities: ['Душанбе', 'Худжанд', 'Куляб', 'Бохтар', 'Истаравшан'] },
  { country: 'Туркменистан', cities: ['Ашхабад', 'Туркменабат', 'Дашогуз', 'Мары', 'Балканабат'] },
  { country: 'Узбекистан', cities: ['Ташкент', 'Самарканд', 'Наманган', 'Андижан', 'Фергана', 'Бухара', 'Нукус', 'Карши', 'Коканд', 'Термез'] },
  { country: 'Украина', cities: ['Киев', 'Харьков', 'Одесса', 'Днепр', 'Запорожье', 'Львов', 'Николаев', 'Чернигов'] },
];
const TRUCKS = [
  'Фургон',
  'Тентованный',
  'Бортовой',
  'Рефрижератор',
  'Изотерм',
  'Самосвал',
  'Цистерна',
  'Контейнеровоз',
  'Автовоз',
  'Манипулятор',
  'Длинномер',
  'Полуприцеп',
  'Прицеп',
];
const CAPACITIES = ['до 500 кг', 'до 1 т', 'до 1.5 т', 'до 3 т', 'до 5 т', 'до 10 т', '20 т и более'];

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>('client');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [clientType, setClientType] = useState<ClientType>('person');

  const [city, setCity] = useState('');
  const [truck, setTruck] = useState('');
  const [capacity, setCapacity] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canProceedStep2 =
    name.trim().length > 1 &&
    phone.trim().length > 6 &&
    password.length >= 6 &&
    (role === 'client' || (city !== '' && truck !== '' && capacity !== ''));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canProceedStep2) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          name: name.trim(),
          password,
          role: role === 'client' ? 'CLIENT' : 'DRIVER',
          city: city || undefined,
          truck: truck || undefined,
          capacity: capacity || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ошибка регистрации');
        setLoading(false);
        return;
      }

      setStep(3);
    } catch {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  }

  if (step === 3) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 24px', textAlign: 'center' }}>
        <span style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--verified-bg)', border: '2px solid var(--verified-border)', marginBottom: 20 }}>
          <IconCheck size={32} color="var(--verified-text)" strokeWidth={2.5} />
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Вы зарегистрированы!
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 320, lineHeight: 1.6, marginBottom: 28 }}>
          {role === 'client'
            ? 'Теперь вы можете разместить заявку на перевозку или сразу выбрать перевозчика из каталога.'
            : 'Ваш профиль создан. Найдите первый груз по своему маршруту на доске заявок.'}
        </p>
        {role === 'driver' && (
          <div style={{ width: '100%', maxWidth: 360, background: 'var(--accent)', borderRadius: 14, padding: '18px 20px', marginBottom: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Оформите профиль — это повышает шансы найти груз</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)', marginBottom: 14, lineHeight: 1.5 }}>
              Клиенты доверяют водителям с фото, описанием и заполненными данными. Займёт 2 минуты.
            </div>
            <Link href="/profile" className="btn" style={{ background: '#fff', color: 'var(--accent)', fontSize: 12, padding: '8px 16px', fontWeight: 700, borderRadius: 8 }}>
              Оформить профиль
            </Link>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {role === 'client' ? (
            <>
              <Link href="/orders/new" className="btn btn-primary" style={{ padding: '11px 20px', fontSize: 13 }}>
                Разместить заявку
              </Link>
              <Link href="/catalog" className="btn btn-secondary" style={{ fontSize: 13 }}>
                Каталог перевозчиков
              </Link>
            </>
          ) : (
            <>
              <Link href="/orders" className="btn btn-primary" style={{ padding: '11px 20px', fontSize: 13 }}>
                Найти грузы
              </Link>
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => router.push('/')}>
                На главную
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        {[1, 2].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: step >= s ? 'var(--accent)' : 'var(--surface-2)', color: step >= s ? '#fff' : 'var(--text-3)', border: `1.5px solid ${step >= s ? 'var(--accent)' : 'var(--border-soft)'}` }}>
              {s < step ? <IconCheck size={12} strokeWidth={3} /> : s}
            </span>
            <span style={{ fontSize: 11, color: step === s ? 'var(--text)' : 'var(--text-3)', fontWeight: step === s ? 700 : 500 }}>
              {s === 1 ? 'Роль' : 'Данные'}
            </span>
            {s < 2 && <div style={{ width: 32, height: 1, background: 'var(--border-soft)' }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 6 }}>Регистрация</h1>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.5 }}>Выберите, кем вы являетесь на платформе</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            <RoleCard active={role === 'client'} onClick={() => setRole('client')} icon={<IconPackage size={20} />} title="Клиент" sub="Ищу перевозчика или хочу разместить заявку" />
            <RoleCard active={role === 'driver'} onClick={() => setRole('driver')} icon={<IconTruck size={20} />} title="Перевозчик" sub="Ищу грузы по своему маршруту" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: 12, fontSize: 14 }} onClick={() => setStep(2)}>
            Далее <IconArrowRight size={15} />
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 16 }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Войти</Link>
          </p>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 6 }}>
            {role === 'client' ? 'Ваши данные' : 'Данные перевозчика'}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 24 }}>
            {role === 'client' ? 'Заполните для создания аккаунта' : 'Расскажите о себе и своём авто'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-field">
              <label className="form-label">{role === 'client' ? 'ФИО или название компании' : 'ФИО водителя'}</label>
              <input className="form-input" placeholder={role === 'client' ? 'Иван Иванов' : 'Артём Власов'} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-field">
              <label className="form-label">Номер телефона</label>
              <input className="form-input" type="tel" placeholder="+7 700 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="form-field">
              <label className="form-label">Пароль</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: 40 }}
                  required
                />
                <button type="button" onClick={() => setShowPass((p) => !p)} tabIndex={-1} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            {role === 'client' && (
              <div className="form-field">
                <label className="form-label">Тип</label>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {([['person', 'Физлицо'], ['ip', 'ИП'], ['too', 'ТОО / Компания']] as [ClientType, string][]).map(([val, label]) => (
                    <button key={val} type="button" className={`chip${clientType === val ? ' is-active' : ''}`} onClick={() => setClientType(val)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {role === 'driver' && (
              <>
                <div className="form-field">
                  <label className="form-label"><IconMapPin size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Город базирования</label>
                  <select className="form-input" value={city} onChange={(e) => setCity(e.target.value)} required>
                    <option value="">Выберите город</option>
                    {CITIES_BY_COUNTRY.map(({ country, cities }) => (
                      <optgroup key={country} label={country}>
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Тип грузовика</label>
                  <select className="form-input" value={truck} onChange={(e) => setTruck(e.target.value)} required>
                    <option value="">Выберите тип</option>
                    {TRUCKS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Грузоподъёмность</label>
                  <select className="form-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} required>
                    <option value="">Выберите</option>
                    {CAPACITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-text)', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: 'var(--danger-text)', marginTop: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" style={{ padding: '11px 16px', fontSize: 13 }} onClick={() => setStep(1)}>
              <IconArrowLeft size={14} /> Назад
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 12, fontSize: 14, opacity: canProceedStep2 && !loading ? 1 : 0.5 }} disabled={!canProceedStep2 || loading}>
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-3)', marginTop: 12, lineHeight: 1.5 }}>
            Нажимая кнопку, вы принимаете условия пользовательского соглашения
          </p>
        </form>
      )}
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button type="button" onClick={onClick} style={{ position: 'relative', border: `2px solid ${active ? 'var(--accent)' : 'var(--border-soft)'}`, borderRadius: 12, padding: '18px 14px', cursor: 'pointer', textAlign: 'left', background: 'var(--surface-2)', transition: 'border-color 0.15s ease', width: '100%' }}>
      {active && <span style={{ position: 'absolute', inset: 0, borderRadius: 11, background: 'var(--accent)', opacity: 0.07, pointerEvents: 'none' }} />}
      <span style={{ position: 'absolute', top: 10, right: 10, width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && <IconCheck size={9} color="#fff" />}
      </span>
      <span style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, background: active ? 'var(--accent)' : 'var(--surface)', color: active ? '#fff' : 'var(--text-2)', border: '1px solid var(--border-soft)' }}>
        {icon}
      </span>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{sub}</div>
    </button>
  );
}
