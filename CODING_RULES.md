# CODING_RULES.md — Правила написания кода

## Naming conventions

| Что | Формат | Пример |
|---|---|---|
| Файл компонента | PascalCase | `BookCard.tsx` |
| Файл хука | camelCase, prefix `use` | `useBooks.ts` |
| Файл типов | camelCase | `types.ts` |
| Файл запросов | camelCase | `books.ts` |
| Папка FSD-слайса | kebab-case | `book-filter/` |
| Компонент | PascalCase | `const BookCard` |
| Хук | camelCase, prefix `use` | `function useBooks()` |
| Тип/Interface | PascalCase | `interface Book`, `type BookStatus` |
| Константа | UPPER_SNAKE_CASE | `STATUS_LABELS` |
| Локальная переменная | camelCase | `const bookId` |
| CSS-класс (Tailwind) | нет кастомных — только утилиты | `bg-accent text-ink` |

---

## Структура React-компонента

```tsx
// 1. Импорты: react → внешние → внутренние FSD (по убыванию слоя) → типы
import { memo, useState } from 'react'
import { useBook } from '@/entities/book'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib'

// 2. Локальные типы (только если нужны)
interface Props {
  bookId: string
  className?: string
}

// 3. Компонент — memo() для тяжёлых компонентов, FC только если нужен children
export const BookDetail = memo<Props>(({ bookId, className }) => {
  // 3a. Хуки данных
  const { data: book, isLoading, error } = useBook(bookId)

  // 3b. Локальный state
  const [open, setOpen] = useState(false)

  // 3c. Производные значения

  // 3d. Обработчики

  // 3e. Loading / Error guards
  if (isLoading) return <BookDetailSkeleton />
  if (error || !book) return <EmptyState title="Книга не найдена" />

  // 3f. Рендер
  return (
    <div className={cn('...', className)}>
      ...
    </div>
  )
})

BookDetail.displayName = 'BookDetail'
// 4. Export — именованный (не default)
```

**Правила:**
- Всегда `memo()` у компонентов уровня widgets/features/pages
- `FC` не использовать (не нужен без `children`)
- `displayName` обязателен для `memo`-компонентов
- Экспорт — именованный, не `export default`
- `'use client'` только когда нужны hooks/events, не ставить везде

---

## Хуки

- Хуки только для чтения данных → `entities/<name>/model/use<Name>.ts`
- Хуки с мутациями → `features/<name>/model/use<Name>.ts`
- Хуки без FSD-зависимостей → `shared/hooks/use<Name>.ts`
- Не создавать хук, если логика используется в одном месте — держать в компоненте

```tsx
// entities/book/model/useBooks.ts — эталон read-хука
export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => fetchBookById(id),
    enabled: !!id,
  })
}
```

---

## TypeScript

- `strict: true` — всегда, никаких `any`
- `type` для union-типов и примитивных алиасов: `type BookStatus = 'active' | 'sold'`
- `interface` для объектов с возможным расширением: `interface Book { ... }`
- `BookRow` — тип строки из БД (snake_case), `Book` — тип домена (camelCase)
- Маппинг через `mapBookRow(row: BookRow): Book` — обязателен, не обходить
- Типы-параметры именовать осмысленно: `<TData>` а не `<T>`
- Не использовать `as` для обхода типов; `!` только когда существование гарантировано

---

## Форматирование (Prettier `.prettierrc.json`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 90,
  "tabWidth": 2
}
```

- Без точек с запятой
- Одинарные кавычки
- Trailing comma везде (функции, массивы, объекты)
- Отступ — 2 пробела

---

## ESLint (`.eslintrc.json`) — критичные правила

| Правило | Уровень | Что значит |
|---|---|---|
| `no-console` | error | `console.log` запрещён |
| `@typescript-eslint/no-explicit-any` | error | `any` запрещён |
| `@typescript-eslint/no-unused-vars` | error | Неиспользуемые переменные запрещены |
| `react/display-name` | error | `displayName` обязателен у `memo`-компонентов |

Переменные с префиксом `_` игнорируются (`argsIgnorePattern: "^_"`).

---

## Запрещено менять без явного запроса

- `.eslintrc.json`, `.prettierrc.json`, `tsconfig.json`
- `next.config.mjs` (security headers)
- `.github/workflows/ci.yml`
- `middleware.ts` (auth/routing)
- `src/app/styles/globals.css` (токены темы)
- `src/shared/lib/supabase/middleware.ts`
- `.env.local`, `.env.example`

---

## Примеры: правильно / неправильно

### Импорты

```tsx
// ПРАВИЛЬНО — из barrel index
import { BookCard, useBook } from '@/entities/book'
import { Button, Select } from '@/shared/ui'

// НЕПРАВИЛЬНО — из внутреннего файла
import { BookCard } from '@/entities/book/ui/BookCard'
```

### Типы

```tsx
// ПРАВИЛЬНО
type BookStatus = 'active' | 'sold' | 'archived'
interface BookCardProps { book: Book; className?: string }
const status: BookStatus = 'active'

// НЕПРАВИЛЬНО
const status: any = 'active'
interface Props { book: any }
```

### Цвета

```tsx
// ПРАВИЛЬНО — CSS-токен
<div className="bg-accent text-bg" />

// НЕПРАВИЛЬНО — inline hex
<div style={{ background: '#2a5c45', color: '#f2ede6' }} />
```

### Комментарии

```tsx
// ПРАВИЛЬНО — только когда WHY неочевиден
// Supabase RLS блокирует запрос если owner_id не совпадает — не убирать фильтр
.eq('owner_id', userId)

// НЕПРАВИЛЬНО — объясняет WHAT
// Фильтруем по owner_id
.eq('owner_id', userId)
```

### Loading/Error

```tsx
// ПРАВИЛЬНО
const { data, isLoading, error } = useBook(id)
if (isLoading) return <BookPageSkeleton />
if (error || !data) return <EmptyState title="Книга не найдена" />

// НЕПРАВИЛЬНО — нет обработки состояний
const { data } = useBook(id)
return <div>{data.title}</div>
```
