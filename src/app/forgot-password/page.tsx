import { Navbar } from '@/components/Navbar';
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';

export const metadata = {
  title: 'Восстановление пароля — TruckHUB',
  description: 'Восстановите доступ к аккаунту TruckHUB по номеру телефона.',
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <Navbar />
      <ForgotPasswordForm />
    </main>
  );
}
