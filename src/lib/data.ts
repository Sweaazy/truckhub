export interface Driver {
  id: string;
  name: string;
  truck: string;
  rating: number;
  reviews: number;
  price: string;
  city: string;
  verified: boolean;
  pro?: boolean;
  features: string[];
  capacity: string;
}

export interface Order {
  id: string;
  from: string;
  to: string;
  cargo: string;
  budget: string;
  date: string;
  posted: string;
  client: string;
  isBusiness: boolean;
  specs: string[];
  isNew?: boolean;
  urgent?: boolean;
  responses?: number;
}

export const drivers: Driver[] = [
  { id: 'artem-vlasov', name: 'Артём Власов', truck: 'Газель Бизнес · Термобудка', rating: 4.9, reviews: 84, price: '25 ₸/км', city: 'Алматы', verified: true, pro: true, features: ['Грузчики', 'Термо', 'Межгород'], capacity: 'до 1.5 т' },
  { id: 'nurlan-seitkali', name: 'Нурлан Сейткали', truck: 'Газель Next · Тент', rating: 4.7, reviews: 41, price: '22 ₸/км', city: 'Астана', verified: true, features: ['Межгород'], capacity: 'до 1.5 т' },
  { id: 'dmitry-kim', name: 'Дмитрий Ким', truck: 'Газель Фермер · Борт', rating: 4.8, reviews: 27, price: '28 ₸/км', city: 'Алматы', verified: true, features: ['Гидроборт'], capacity: 'до 2 т' },
  { id: 'aset-omarov', name: 'Асет Омаров', truck: 'Газель · Изотерм', rating: 4.5, reviews: 12, price: '20 ₸/км', city: 'Алматы', verified: false, features: ['Грузчики'], capacity: 'до 1 т' },
];

export const orders: Order[] = [
  { id: '2481', from: 'Алматы', to: 'Бишкек', cargo: 'Мебель, 3-комн. квартира · Требуется упаковка', budget: '45 000 ₸', date: 'Завтра, 26 мая', posted: '5 минут назад', client: 'Ирина М.', isBusiness: false, specs: ['~4×2×2 м', 'до 1.5 т', 'Грузчики нужны', 'Хрупкое'], isNew: true, urgent: true },
  { id: '2480', from: 'Алматы', to: 'Талдыкорган', cargo: 'Стройматериалы, паллеты', budget: '28 000 ₸', date: '28 мая', posted: '22 минуты назад', client: 'ТОО СтройСнаб', isBusiness: true, specs: ['~2 т', 'Гидроборт желателен'], isNew: true },
  { id: '2479', from: 'Алматы', to: 'Капчагай', cargo: 'Диван и шкаф', budget: '15 000 ₸', date: '30 мая', posted: '1 час назад', client: 'Светлана К.', isBusiness: false, specs: ['Хрупкое', '~2.5×1.5×1 м'], responses: 3 },
  { id: '2478', from: 'Алматы', to: 'Шымкент', cargo: 'Оборудование, паллеты · Дальнобой', budget: 'Договорная', date: '2 июня', posted: '3 часа назад', client: 'ИП Жанбеков', isBusiness: true, specs: ['до 5 т', '700 км', 'Фура'] },
];
