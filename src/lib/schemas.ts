import { z } from 'zod';

export const RegisterSchema = z.object({
  phone: z.string().min(10, 'Введите номер телефона'),
  name: z.string().min(2, 'Введите имя'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
  role: z.enum(['CLIENT', 'DRIVER']),
  // Driver-only fields
  city: z.string().optional(),
  truck: z.string().optional(),
  capacity: z.string().optional(),
  priceKm: z.coerce.number().optional(),
});

export const LoginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(1),
});

export const CreateOrderSchema = z.object({
  fromCity: z.string().min(2),
  toCity: z.string().min(2),
  cargo: z.string().min(2),
  description: z.string().optional(),
  date: z.string().min(1),
  budget: z.coerce.number().nullable().optional(),
  currency: z.string().default('USD'),
  negotiable: z.boolean().default(false),
  specs: z.array(z.string()).default([]),
  urgent: z.boolean().default(false),
});

export const CreateResponseSchema = z.object({
  price: z.coerce.number().positive('Укажите цену'),
  message: z.string().min(10, 'Сообщение минимум 10 символов'),
});
