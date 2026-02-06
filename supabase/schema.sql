create table if not exists public.drops (
  id uuid primary key,
  user_email text not null,
  recipient_email text not null,
  encrypted_payload_url text not null,
  payload_hash text not null,
  passphrase_hint text,
  checkin_interval_days integer not null,
  grace_days integer not null,
  last_checkin_at timestamptz,
  release_at timestamptz,
  status text not null,
  created_at timestamptz not null,
  is_verified boolean not null default false,
  verify_token text unique,
  checkin_token text unique,
  last_checkin_sent_at timestamptz,
  released_at timestamptz,
  verified_at timestamptz
);

create index if not exists drops_status_idx on public.drops (status);
create index if not exists drops_release_at_idx on public.drops (release_at);
