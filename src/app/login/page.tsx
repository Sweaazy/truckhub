import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';

export const metadata = {
  title: 'Вход — TruckHUB',
  description: 'Войдите в аккаунт TruckHUB.',
};

export default function LoginPage() {
  return (
    <main>
      <Navbar />
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
