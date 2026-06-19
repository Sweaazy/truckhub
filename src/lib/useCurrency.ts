'use client';
import { useState, useEffect } from 'react';

export interface Currency { code: string; symbol: string; name: string }

const TZ_MAP: Record<string, string> = {
  'Asia/Almaty': 'KZT', 'Asia/Qyzylorda': 'KZT', 'Asia/Aqtau': 'KZT',
  'Asia/Aqtobe': 'KZT', 'Asia/Oral': 'KZT',
  'Europe/Moscow': 'RUB', 'Europe/Kaliningrad': 'RUB', 'Europe/Samara': 'RUB',
  'Asia/Yekaterinburg': 'RUB', 'Asia/Omsk': 'RUB', 'Asia/Novosibirsk': 'RUB',
  'Asia/Krasnoyarsk': 'RUB', 'Asia/Irkutsk': 'RUB', 'Asia/Yakutsk': 'RUB',
  'Asia/Vladivostok': 'RUB', 'Asia/Magadan': 'RUB', 'Asia/Kamchatka': 'RUB',
  'Asia/Tashkent': 'UZS', 'Asia/Samarkand': 'UZS',
  'Europe/Kiev': 'UAH', 'Europe/Uzhgorod': 'UAH', 'Europe/Zaporozhye': 'UAH',
  'Europe/Minsk': 'BYN',
  'Asia/Baku': 'AZN',
  'Asia/Tbilisi': 'GEL',
  'Asia/Yerevan': 'AMD',
  'Asia/Bishkek': 'KGS',
  'Asia/Dushanbe': 'TJS',
  'Asia/Ashgabat': 'TMT',
  'Europe/Chisinau': 'MDL',
};

export const ALL_CURRENCIES: Currency[] = [
  { code: 'KZT', symbol: '₸',   name: 'Тенге (KZT)' },
  { code: 'RUB', symbol: '₽',   name: 'Рубль (RUB)' },
  { code: 'UZS', symbol: 'сум', name: 'Сум (UZS)' },
  { code: 'UAH', symbol: '₴',   name: 'Гривна (UAH)' },
  { code: 'BYN', symbol: 'Br',  name: 'Рубль бел. (BYN)' },
  { code: 'AZN', symbol: '₼',   name: 'Манат (AZN)' },
  { code: 'GEL', symbol: '₾',   name: 'Лари (GEL)' },
  { code: 'AMD', symbol: '֏',   name: 'Драм (AMD)' },
  { code: 'KGS', symbol: 'с',   name: 'Сом (KGS)' },
  { code: 'TJS', symbol: 'SM',  name: 'Сомони (TJS)' },
  { code: 'TMT', symbol: 'T',   name: 'Манат туркм. (TMT)' },
  { code: 'MDL', symbol: 'L',   name: 'Лей (MDL)' },
  { code: 'USD', symbol: '$',   name: 'Доллар (USD)' },
];

const DEFAULT: Currency = { code: 'USD', symbol: '$', name: 'Доллар (USD)' };

function detect(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TZ_MAP[tz];
    return ALL_CURRENCIES.find((c) => c.code === code) ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT);

  useEffect(() => {
    const stored = localStorage.getItem('truckhub_currency');
    if (stored) {
      const found = ALL_CURRENCIES.find((c) => c.code === stored);
      if (found) { setCurrencyState(found); return; }
    }
    setCurrencyState(detect());
  }, []);

  function setCurrency(code: string) {
    const found = ALL_CURRENCIES.find((c) => c.code === code);
    if (!found) return;
    localStorage.setItem('truckhub_currency', code);
    setCurrencyState(found);
  }

  return { currency, setCurrency };
}
