# README_AI.md — Навигатор для ИИ

Маркетплейс исторических книг о Кавказе: продажа, избранное, запросы на покупку, события.

**Точка входа:** `app/layout.tsx` → `src/app/providers/QueryProvider.tsx`

## Ключевые модули

```
src/pages/          ← page-оркестраторы (клиентские, memo)
src/widgets/        ← переиспользуемые секции
src/features/       ← бизнес-логика, мутации, actions
src/entities/       ← domain types, read-хуки, базовый UI
src/shared/         ← ui-kit, supabase queries, утилиты
```

## Команды

```bash
npm run dev          # dev-сервер
npm run build        # production build
npm run lint         # ESLint
npx tsc --noEmit     # typecheck
```

## Навигация

- Стили/токены: `src/app/styles/globals.css`
- Supabase запросы: `src/shared/lib/supabase/queries/`
- Query keys: `src/shared/lib/supabase/queries/queryKeys.ts`
- UI компоненты: `src/shared/ui/` (barrel: `index.ts`)
- Auth: `src/features/auth/actions/auth.actions.ts`
- Route guard: `middleware.ts`

## Главный документ

→ [AGENTS.md](AGENTS.md)
