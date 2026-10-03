alter table public.profiles add column if not exists approved boolean not null default true;
create index if not exists profiles_approved_idx on public.profiles(approved);

