import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Footer } from '@/components/Footer';
import './globals.css';
import './components.css';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'TruckHUB — Грузоперевозки по СНГ',
  description:
    'Найдите надёжного перевозчика за минуты. Проверенные водители, переезды, доставка, дальнобой. Договаривайтесь напрямую — без посредников.',
  keywords: ['грузоперевозки', 'газель', 'переезд', 'доставка груза', 'дальнобой', 'перевозчик'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={manrope.variable}>
        <ThemeProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
