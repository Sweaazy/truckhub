export interface ResponseItem {
  id: string;
  price: number;
  message: string;
  createdAt: string;
  driverProfile: {
    id: string;
    city: string;
    rating: number;
    reviews: number;
    user: { name: string };
  };
}

export interface DBDriverProfile {
  id: string;
  userId: string;
  city: string;
  truck: string;
  capacity: string;
  priceKm: number;
  features: string[];
  rating: number;
  reviews: number;
  trips: number;
  verified: boolean;
  pro: boolean;
  online: boolean;
  user: { name: string };
}

export interface DBOrder {
  id: string;
  fromCity: string;
  toCity: string;
  cargo: string;
  description: string | null;
  date: string;
  budget: number | null;
  currency: string;
  negotiable: boolean;
  specs: string[];
  status: string;
  urgent: boolean;
  createdAt: string;
  client: { id: string; name: string };
  responseCount: number;
}
