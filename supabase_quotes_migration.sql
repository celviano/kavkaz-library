-- ============================================================
-- MIGRATION: quotes table
-- Выполнить в Supabase → SQL Editor
-- ============================================================

-- 1. Таблица цитат
create table if not exists quotes (
  id           uuid primary key default gen_random_uuid(),
  text         text not null check (char_length(text) between 1 and 600),
  author       text not null check (char_length(author) between 1 and 150),
  source       text not null check (char_length(source) between 1 and 200),
  user_id      uuid references auth.users(id) on delete cascade not null,
  status       text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  queue_date   date,          -- дата показа на главной (заполняет админ при апруве)
  created_at   timestamptz default now() not null
);

-- 2. Индексы
create index if not exists quotes_status_idx      on quotes(status);
create index if not exists quotes_user_id_idx     on quotes(user_id);
create index if not exists quotes_queue_date_idx  on quotes(queue_date);

-- 3. RLS
alter table quotes enable row level security;

-- Авторизованный пользователь может добавлять цитаты
create policy "users can insert own quotes"
  on quotes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Пользователь видит свои цитаты (любой статус)
create policy "users can view own quotes"
  on quotes for select
  to authenticated
  using (auth.uid() = user_id);

-- Одобренные цитаты видны всем (для главной страницы)
create policy "approved quotes are public"
  on quotes for select
  to anon, authenticated
  using (status = 'approved');

-- Админ видит все цитаты
create policy "admin can view all quotes"
  on quotes for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Только админ может обновлять статус и queue_date
create policy "admin can update quotes"
  on quotes for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- Готово. Вставить в SQL Editor и нажать Run.
-- ============================================================
