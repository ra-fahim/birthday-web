-- Social chat: authenticated 1-to-1 conversations between members.
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (participant_a <> participant_b)
);
create unique index if not exists conversations_pair_idx on public.conversations (least(participant_a,participant_b), greatest(participant_a,participant_b));
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) between 1 and 5000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages(conversation_id,created_at desc);
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
drop policy if exists conversations_member on public.conversations;
drop policy if exists messages_member on public.messages;
drop policy if exists messages_insert_member on public.messages;
create policy conversations_member on public.conversations for select using(auth.uid()=participant_a or auth.uid()=participant_b);
create policy messages_member on public.messages for select using(exists(select 1 from public.conversations c where c.id=conversation_id and (c.participant_a=auth.uid() or c.participant_b=auth.uid())));
create policy messages_insert_member on public.messages for insert with check(sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and (c.participant_a=auth.uid() or c.participant_b=auth.uid())));
