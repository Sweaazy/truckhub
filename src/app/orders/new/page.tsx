import { Navbar } from '@/components/Navbar';
import { CreateOrderForm } from '@/components/CreateOrderForm';

export const metadata = {
  title: 'Разместить заявку — TruckHUB',
  description: 'Опишите груз и маршрут — перевозчики откликнутся сами.',
};

export default function NewOrderPage() {
  return (
    <main>
      <Navbar />
      <CreateOrderForm />
    </main>
  );
}
