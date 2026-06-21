import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-soft)', background: 'var(--surface)', padding: '24px 24px 20px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 6 }}>TruckHUB</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6 }}>Грузоперевозки по СНГ.<br />Без посредников.</div>
        </div>

        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 10 }}>Сервис</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Link href="/catalog" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Каталог перевозчиков</Link>
              <Link href="/orders" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Заявки на перевозку</Link>
              <Link href="/orders/new" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Разместить заявку</Link>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 10 }}>Компания</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Link href="/about" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>О сервисе</Link>
              <a href="mailto:hello@truckhub.kz" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Поддержка</a>
              <a href="https://t.me/truckhub_support" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Telegram поддержка</a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 10 }}>Аккаунт</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Link href="/login" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Войти</Link>
              <Link href="/register" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Регистрация</Link>
              <Link href="/profile" style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Личный кабинет</Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '20px auto 0', paddingTop: 16, borderTop: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>© {new Date().getFullYear()} TruckHUB. Все права защищены.</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Казахстан · Россия · СНГ</span>
      </div>
    </footer>
  );
}
