create table public.demo_datasets (
 id text primary key check (id = 'consultant-demo'),
 label text not null,
 headers jsonb not null check (jsonb_typeof(headers) = 'array'),
 rows jsonb not null check (jsonb_typeof(rows) = 'array'),
 updated_at timestamptz not null default now()
);
alter table public.demo_datasets enable row level security;
revoke all on public.demo_datasets from anon, authenticated;
grant select on public.demo_datasets to anon, authenticated;
create policy "Fictional demo is readable" on public.demo_datasets for select to anon, authenticated using (id = 'consultant-demo');
create table public.usage_events (
 id uuid primary key default gen_random_uuid(),
 received_at timestamptz not null default now(),
 session_id uuid not null,
 event_id uuid not null unique,
 event_type text not null check (event_type in ('view','engagement','action')),
 view_name text not null check (view_name in ('home','repair-queue','checks','ai-brief','overview','diagnosis','roadmap','report','case-discovery','case-funnel','case-teaching','case-scope','case-report')),
 action_name text check (action_name is null or action_name in ('load-demo','upload-csv','run-audit','export-queue','download-brief','copy-brief','print-report','clear-data','template-download','case-export-metrics','case-export-guide','case-export-report','case-print-report','case-quiz','case-filter')),
 active_seconds integer not null default 0 check (active_seconds between 0 and 30),
 consent_version text not null check (consent_version in ('2026-11-v1','2026-11-v2')),
 is_test boolean not null default false
);
create index usage_events_received_at_idx on public.usage_events(received_at);
create index usage_events_session_time_idx on public.usage_events(session_id,received_at);
alter table public.usage_events enable row level security;
revoke all on public.usage_events from public,anon,authenticated;
grant all on public.demo_datasets,public.usage_events to service_role;

create policy "Analytics are private" on public.usage_events for all to anon, authenticated using (false) with check (false);
create extension if not exists pg_cron;
select cron.schedule('health-check-analytics-retention','17 * * * *', $$delete from public.usage_events where received_at < now() - interval '30 days'$$);
