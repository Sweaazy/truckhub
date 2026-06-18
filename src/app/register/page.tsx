import { Navbar } from '@/components/Navbar';
import { RegisterForm } from '@/components/RegisterForm';

export const metadata = {
  title: 'Регистрация — TruckHUB',
  description: 'Создайте аккаунт клиента или перевозчика на платформе TruckHUB.',
};

export default function RegisterPage() {
  return (
    <main>
      <Navbar />
      <RegisterForm />
    </main>
  );
}
