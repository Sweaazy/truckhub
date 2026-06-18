import { Navbar } from '@/components/Navbar';
import { OrdersBoard } from '@/components/OrdersBoard';

export const metadata = {
  title: 'Доска заявок — TruckHUB',
  description: 'Найдите груз по своему маршруту. Свежие заявки на перевозку по СНГ.',
};

export default function OrdersPage() {
  return (
    <main>
      <Navbar />
      <OrdersBoard />
    </main>
  );
}
