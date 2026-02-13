create table public.chat_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  room_id uuid not null default gen_random_uuid(),
  partner_id uuid,
  partner_username text,
  status text not null default 'waiting' check (status in ('waiting', 'matched', 'expired')),
  created_at timestamptz not null default now(),
  matched_at timestamptz
);

create index idx_chat_queue_status on public.chat_queue(status);
create index idx_chat_queue_user_id on public.chat_queue(user_id);

alter table public.chat_queue enable row level security;

create policy "Users can view all queue entries"
  on public.chat_queue for select
  to authenticated
  using (true);

create policy "Users can insert own queue entries"
  on public.chat_queue for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update entries they are part of"
  on public.chat_queue for update
  to authenticated
  using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can delete own waiting entries"
  on public.chat_queue for delete
  to authenticated
  using (auth.uid() = user_id and status = 'waiting');

create or replace function public.claim_chat_queue_entry(
  claiming_user_id uuid,
  claiming_username text
)
returns public.chat_queue
language plpgsql
security definer
as $$
declare
  claimed_row public.chat_queue;
begin
  select * into claimed_row
  from public.chat_queue
  where status = 'waiting'
    and user_id != claiming_user_id
  order by created_at asc
  limit 1
  for update skip locked;

  if claimed_row.id is null then
    return null;
  end if;

  update public.chat_queue
  set
    status = 'matched',
    partner_id = claiming_user_id,
    partner_username = claiming_username,
    matched_at = now()
  where id = claimed_row.id
  returning * into claimed_row;

  return claimed_row;
end;
$$;
