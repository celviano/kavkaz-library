# ONBOARDING.md — Типовые задачи пошагово

## Добавить новую страницу

1. Создать маршрут в App Router: `app/<route>/page.tsx` (тонкий, просто импортирует Page-компонент)
2. Создать Page-компонент: `src/pages/<name>/ui/<Name>Page.tsx` — клиентский, `memo()`
3. При необходимости: `app/<route>/loading.tsx` → `<PageLoader />`
4. При необходимости: `app/<route>/error.tsx`
5. Создать barrel: `src/pages/<name>/index.ts`
6. Если страница защищённая — добавить маршрут в `middleware.ts` в `PROTECTED_ROUTES`

**Файлы, которые затрагиваются:**
- `app/<route>/page.tsx` (новый)
- `src/pages/<name>/ui/<Name>Page.tsx` (новый)
- `middleware.ts` (если защищённый маршрут)
- `src/widgets/header/` (если нужна ссылка в навигации)

---

## Добавить новый запрос к Supabase

1. Написать функцию в `src/shared/lib/supabase/queries/<entity>.ts`
2. Добавить query key в `src/shared/lib/supabase/queries/queryKeys.ts`
3. Создать хук в `src/entities/<entity>/model/use<Entity>.ts`:
   ```tsx
   export function useMyEntity(id: string) {
     return useQuery({
       queryKey: queryKeys.<entity>.detail(id),
       queryFn: () => fetchMyEntity(id),
       enabled: !!id,
     })
   }
   ```
4. Экспортировать из `src/entities/<entity>/index.ts`

**Файлы, которые затрагиваются:**
- `src/shared/lib/supabase/queries/<entity>.ts`
- `src/shared/lib/supabase/queries/queryKeys.ts`
- `src/entities/<entity>/model/use<Entity>.ts`
- `src/entities/<entity>/index.ts`

---

## Добавить мутацию (создать/обновить/удалить данные)

1. Написать SQL-функцию в `src/shared/lib/supabase/queries/<entity>.ts`
2. Создать хук с `useMutation` в `src/features/<feature>/model/use<Feature>.ts`:
   ```tsx
   export function useCreateEntity() {
     const queryClient = useQueryClient()
     return useMutation({
       mutationFn: createEntity,
       onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.<entity>.all }),
     })
   }
   ```
3. Использовать хук в `features/<feature>/ui/` или `pages/<name>/ui/`

---

## Добавить новый базовый компонент

1. Создать `src/shared/ui/<Name>.tsx` — именованный экспорт, без бизнес-логики
2. Добавить экспорт в `src/shared/ui/index.ts`
3. Следовать паттерну Button.tsx или Select.tsx (см. `CODING_RULES.md`)

---

## Добавить новую entity (доменная модель)

1. Создать структуру:
   ```
   src/entities/<name>/
     model/
       types.ts       ← <Name>Row + <Name> + map<Name>Row()
       use<Name>.ts   ← TanStack Query read-хуки
     ui/
       <Name>Card.tsx ← базовый UI
     index.ts         ← barrel export
   ```
2. Добавить запросы в `src/shared/lib/supabase/queries/<name>.ts`
3. Добавить query keys в `queryKeys.ts`

---

## Добавить feature (бизнес-логика, форма, модалка)

1. Создать структуру:
   ```
   src/features/<name>/
     model/
       use<Name>.ts   ← useMutation хуки
     ui/
       <Name>Modal.tsx или <Name>Form.tsx
     index.ts
   ```
2. Добавить экспорт в `index.ts`
3. Использовать из `widgets/` или `pages/`

---

## Изменить схему БД

<!-- TODO: уточнить у команды — нет CI-миграций, только ручной SQL -->
1. Написать SQL-миграцию (по образцу файлов `supabase-*.sql` в корне)
2. Применить через Supabase Dashboard → SQL Editor
3. Обновить типы в `src/entities/<entity>/model/types.ts`
4. Обновить `CLAUDE.md` (раздел Database Schema)

---

## Workflow: от задачи до PR

1. Изучить `AGENTS.md` и `CLAUDE.md` (контекст)
2. Определить слой FSD, куда идёт код
3. Создать/изменить файлы
4. Проверить:
   ```bash
   npx tsc --noEmit   # typecheck
   npm run lint        # ESLint
   npm run build       # production build
   ```
5. Убедиться: нет `console.log`, нет `any`, есть `displayName` у `memo`
6. Создать PR в `main` или `dev`

---

## Частые ошибки

| Ошибка | Решение |
|---|---|
| Импорт из внутреннего файла FSD-слайса | Импортировать только из `index.ts` |
| Cross-import между слоями одного уровня | Вынести общее в `shared/` или реорганизовать |
| `any` в типах | Явно типизировать или использовать `unknown` |
| `console.log` в коде | Удалить перед коммитом |
| Нет `displayName` у `memo`-компонента | Добавить `Component.displayName = 'Component'` |
| Inline `#hex` цвет | Заменить на Tailwind utility класс с токеном |
| Нет обработки `isLoading` / `error` | Добавить guard в начало компонента |
| Импорт из `lucide-react` в Dropzone | Dropzone использует inline SVG — не добавлять lucide |
| Хук с мутацией в `entities/` | Мутации только в `features/` |
| Server Action вне `features/auth/` | Server Actions только в `features/auth/actions/` |

---

## Как проверить результат

```bash
# Типы
npx tsc --noEmit

# Линтер
npm run lint

# Визуально
npm run dev
# Открыть localhost:3000, проверить страницу
# Проверить Network в DevTools — нет лишних запросов
# Проверить Console — нет ошибок и console.log

# Production build
npm run build
```
