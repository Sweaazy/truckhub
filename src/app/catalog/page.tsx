import { Navbar } from '@/components/Navbar';
import { CatalogView } from '@/components/CatalogView';

export const metadata = {
  title: 'Каталог перевозчиков — TruckHUB',
  description: 'Проверенные водители и грузовой транспорт по СНГ. Фильтры по типу ТС, рейтингу, цене.',
};

export default function CatalogPage() {
  return (
    <main>
      <Navbar />
      <CatalogView />
    </main>
  );
}
