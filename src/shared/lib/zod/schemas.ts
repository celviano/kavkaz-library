import { z } from 'zod'

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().min(1, 'Введите email').email('Неверный формат email'),
  password: z.string().min(1, 'Введите пароль'),
})

export const signUpSchema = z.object({
  name:     z.string().min(2, 'Минимум 2 символа'),
  email:    z.string().min(1, 'Введите email').email('Неверный формат email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Неверный формат email'),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Минимум 6 символов'),
})

// ─── Add Book ────────────────────────────────────────────────────────────────

export const addBookBaseSchema = z.object({
  title:         z.string().min(1, 'Введите название'),
  author:        z.string().min(1, 'Введите автора'),
  year:          z.string().regex(/^\d{4}$/, 'Введите корректный год'),
  category:      z.string().min(1, 'Выберите категорию'),
  description:   z.string().max(3000, 'Максимум 3000 символов').optional(),
  tags:          z.string().optional(),
  language:      z.string().default('Русский'),
  pages:         z.string().optional(),
  publisherName: z.string().optional(),
  publisherCity: z.string().optional(),
  edition:       z.string().optional(),
})

export const addPhysicalBookSchema = addBookBaseSchema.extend({
  price:     z.string().optional(),
  copies:    z.string().default('1'),
  priceType: z.enum(['fixed', 'negotiable', 'exchange']).default('fixed'),
  condition: z.enum(['new', 'excellent', 'good', 'fair', 'poor']).default('good'),
})

export const addEbookSchema = addBookBaseSchema.extend({
  copyrightType: z.enum(['public_domain', 'own_work', 'permitted']).default('public_domain'),
  copyrightConfirmed: z.literal(true, {
    errorMap: () => ({ message: 'Подтвердите права на распространение' }),
  }),
})

// ─── Order (Request) ─────────────────────────────────────────────────────────

export const requestOrderSchema = z.object({
  fullName:     z.string().min(2, 'Введите ФИО'),
  phone:        z.string().min(5, 'Введите телефон'),
  email:        z.string().min(1, 'Введите email').email('Неверный формат'),
  city:         z.string().min(1, 'Введите город'),
  postalCode:   z.string().min(4, 'Введите индекс'),
  address:      z.string().min(5, 'Введите адрес'),
  apartment:    z.string().optional(),
  deliveryType: z.enum(['sdek', 'pochta']).default('sdek'),
  quantity:     z.number().min(1).default(1),
  comment:      z.string().max(500).optional(),
})

// ─── Quote ───────────────────────────────────────────────────────────────────

export const addQuoteSchema = z.object({
  text:   z.string().min(1, 'Введите текст').max(600, 'Максимум 600 символов'),
  author: z.string().min(1, 'Введите автора').max(150),
  source: z.string().min(1, 'Введите источник').max(200),
})

// ─── Profile Edit ────────────────────────────────────────────────────────────

export const profileEditSchema = z.object({
  firstName:   z.string().optional(),
  lastName:    z.string().optional(),
  displayName: z.string().optional(),
  bornYear:    z.string().optional(),
  bio:         z.string().max(500).optional(),
  city:        z.string().optional(),
  country:     z.string().optional(),
  website:     z.string().url('Неверный формат URL').optional().or(z.literal('')),
})

// ─── Organization ────────────────────────────────────────────────────────────

export const createOrganizationSchema = z.object({
  name:        z.string().min(2, 'Введите название'),
  description: z.string().max(1000).optional(),
  email:       z.string().email('Неверный формат email').optional().or(z.literal('')),
  phone:       z.string().optional(),
  website:     z.string().url('Неверный формат URL').optional().or(z.literal('')),
  city:        z.string().optional(),
  inn:         z.string().optional(),
  address:     z.string().optional(),
})

// ─── Inferred types ──────────────────────────────────────────────────────────

export type LoginValues            = z.infer<typeof loginSchema>
export type SignUpValues            = z.infer<typeof signUpSchema>
export type ForgotPasswordValues   = z.infer<typeof forgotPasswordSchema>
export type UpdatePasswordValues   = z.infer<typeof updatePasswordSchema>
export type AddPhysicalBookValues  = z.infer<typeof addPhysicalBookSchema>
export type AddEbookValues         = z.infer<typeof addEbookSchema>
export type RequestOrderValues     = z.infer<typeof requestOrderSchema>
export type AddQuoteValues         = z.infer<typeof addQuoteSchema>
export type ProfileEditValues      = z.infer<typeof profileEditSchema>
export type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>
