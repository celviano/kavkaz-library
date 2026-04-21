# DESIGN.md — UI/UX и дизайн-система

## UI-библиотека

Кастомная. Нет shadcn/ui, MUI, Chakra. Все компоненты в `src/shared/ui/`.
`lucide-react` — иконки (импортировать именованно).

---

## Цветовые токены (`src/app/styles/globals.css`)

### Фоны
| Токен | Hex | Использование |
|---|---|---|
| `bg-bg` | `#f2ede6` | Фон страницы |
| `bg-surface` | `#e8e0d4` | Карточки, панели |
| `bg-surface2` | `#d6ccbf` | Borders, бейджи, dividers |
| `bg-surface3` | `#c4b9aa` | Hover на surface2 |

### Текст
| Токен | Hex | Использование |
|---|---|---|
| `text-ink` | `#1B2212` | Основной заголовочный текст |
| `text-text` | `#50433D` | Основной body текст |
| `text-ash` | `#7D7060` | Вторичный текст, labels |
| `text-dim` | `#a8998a` | Placeholder, неактивное |

### Акцент (forest green)
| Токен | Hex | Использование |
|---|---|---|
| `bg-accent` / `text-accent` | `#2a5c45` | Primary actions, ссылки |
| `bg-accent2` / `text-accent2` | `#3d7a5e` | Hover accent |
| `bg-accent3` / `text-accent3` | `#6abf99` | Light accent, highlights |

### Дополнительные
| Токен | Hex | Использование |
|---|---|---|
| `text-gold` / `bg-gold` | `#8B6914` | Pending статус, цены |
| `text-steel2` | `#4a6e7a` | Geography badges |
| `bg-dark` | `#1B2212` | CTA-блоки (тёмный фон) |

### Тени (применять через className)
```
shadow-card        ← карточки в нормальном состоянии
shadow-accent-sm   ← кнопки primary
shadow-accent      ← hover кнопки, фокус
shadow-accent-lg   ← попапы, модалки
```

**Правило:** никаких inline `#hex` в JSX. Только Tailwind utility классы с токенами.

---

## Типографика

| Font | CSS var | Использование | JSX |
|---|---|---|---|
| Cormorant Garamond | `--font-display` | Заголовки, логотип, цены | `style={{ fontFamily: 'var(--font-display)' }}` |
| Inter | `--font-sans` | Весь основной текст | default (body) |

Шрифты подключены через `next/font` в `app/layout.tsx`.
`--font-display` всегда через `style={{ fontFamily: 'var(--font-display)' }}`, не через Tailwind-класс.

---

## Breakpoints

| Breakpoint | Значение |
|---|---|
| `sm` | `20rem` (320px) |
| `md` | `40rem` (640px) |
| `lg` | `58.75rem` (940px) |
| `xl` | `75rem` (1200px) |
| `2xl` | `90rem` (1440px) |

---

## Layout

- **Container:** `src/shared/ui/Container.tsx` — `max-w-7xl`, `px-6 md:px-10 lg:px-16`. Всегда использовать для ограничения ширины.
- **Flex/Grid:** стандартный Tailwind. Нет CSS Modules, нет styled-components.
- **Spacing:** шаг 4px (Tailwind default). Секции страницы — `py-12` или `py-16`.

---

## Компоненты `src/shared/ui/`

| Компонент | Пропсы / особенности |
|---|---|
| `Button` | `variant: primary\|outline\|ghost`, `size: sm\|md\|lg` |
| `Select` | Полностью кастомный accessible dropdown (Arrow/Enter/Escape) |
| `Input` | Обёртка `<input>` с токенами |
| `Textarea` | Обёртка `<textarea>` с токенами |
| `FormField` | Label + Input/Select + error message |
| `FormActions` | Кнопки формы (Submit + Cancel) |
| `Badge` | Цветные бейджи категорий книг |
| `Dropzone` | Supabase upload (react-dropzone) |
| `Pagination` | URL-driven с ellipsis |
| `SectionHeading` | `eyebrow` + `h2` |
| `PageHeading` | `eyebrow` + `h1` + `subtitle` |
| `Skeleton` + `BookCardSkeleton` | Loading placeholders |
| `PageLoader` | Full-page skeleton для `loading.tsx` |
| `EmptyState` | Пустое состояние с опц. иконкой + CTA |
| `Breadcrumb` | Хлебные крошки |
| `SegmentedControl` | Таб-переключатель (dashboard) |
| `ErrorBanner` | Баннер ошибки формы |
| `AuthGateModal` | Модалка "нужна авторизация" |
| `Container` | Ограничитель ширины |

Импорт из barrel: `import { Button, Select } from '@/shared/ui'`

---

## Формы

- Валидация через `src/shared/lib/validation.ts` + `useFormValidation` хук
- Ошибка показывается только после `touchField()` (не при первом рендере)
- Структура: `<FormField>` оборачивает `<Input>` / `<Select>` / `<Textarea>`
- Кнопки формы — `<FormActions>` (Submit + Cancel)
- Загрузка файлов — `<Dropzone>` + `useSupabaseUpload`

---

## Модалки

- `RequestModal` (features/book-request) — открывается из `book-purchase` widget
- `AuthGateModal` (shared/ui) — показывается неавторизованным при попытке действия
- Паттерн: `useState(false)` → `onClose={() => setOpen(false)}`

---

## Состояния загрузки и ошибок

**Обязательные для каждого компонента с данными:**
```tsx
if (isLoading) return <BookCardSkeleton />          // или кастомный skeleton
if (error || !data) return <EmptyState title="..." /> // не рендерить null
```

Skeleton-компоненты: `<Skeleton />`, `<BookCardSkeleton />`, `<PageLoader />`

---

## Чеклист — как избежать визуальных несоответствий

- [ ] Цвета — только через Tailwind utility классы с токенами (`bg-accent`, `text-ash`), никаких `#hex`
- [ ] Заголовки в `--font-display` — через `style={{ fontFamily: 'var(--font-display)' }}`
- [ ] Кнопки — только `<Button variant="..." size="...">`, не кастомный `<button>`
- [ ] Dropdown — `<Select>` из `shared/ui`, не `<select>` нативный
- [ ] Ширина страницы — обёрнута в `<Container>`
- [ ] Отступы секций — `py-12` или `py-16` (не произвольные)
- [ ] Все `memo`-компоненты имеют `displayName`
- [ ] Есть skeleton при `isLoading`, есть `<EmptyState>` при ошибке/пустом
- [ ] `aria-*`, `role`, `aria-label` у интерактивных элементов
- [ ] `lucide-react` иконки — через именованный импорт (нет инлайн SVG без причины)
