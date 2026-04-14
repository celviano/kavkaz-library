# CaucasusLibrary

Каталог исторических книг по Кавказу и Закавказью.

## Стек

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **FSD** (Feature-Sliced Design)

## Запуск

```bash
npm install
npm run dev
```

Открыть: http://localhost:3000

## Структура (FSD)

```
src/
  app/           — глобальные стили, провайдеры
  pages/         — страницы (HomePage, CatalogPage)
  widgets/       — Header, Footer, Hero, BookGrid
  features/      — BookSearch, BookFilter
  entities/      — Book (типы + BookCard)
  shared/        — UI-kit, утилиты, константы
```

## Палитра (тема E — Известняк)

| Токен          | Цвет      | Назначение        |
|----------------|-----------|-------------------|
| `--color-bg`   | `#f2ede6` | Основной фон      |
| `--color-ink`  | `#1B2212` | Заголовки         |
| `--color-text` | `#50433D` | Основной текст    |
| `--color-accent`| `#2a5c45`| Акцент (зелёный) |
| `--color-steel`| `#B7C9D5` | Сталь (вторичный) |
| `--color-gold` | `#8B6914` | Золото            |
