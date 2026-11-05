# Supabase integration and usage reporting

The dedicated project `txosxqwoxyqborljelsv` (Paris / eu-west-3) is part of the Still Got It organisation. Creation was quoted at $0/month. This is a working integration, not a technology badge.

- `demo_datasets`: public read-only synthetic dataset (240 applications, 20 roles); browser fetches it through Supabase REST. Bundled CSV is the fallback when Supabase is unreachable.
- `usage_events`: private analytics, no anonymous read or direct-write access. The `collect-usage` Edge Function verifies the public JWT, validates an allowlisted payload and inserts using a server-only key. A public JWT is not visitor authentication; events can be forged and should not be used as audited counts.
- Analytics begin only after opt-in. Consent choice lasts six months; each page visit uses a fresh in-memory random session ID. Reject or withdraw stops collection. No candidate records, uploaded content, filenames, search terms or edited recommendations are transmitted as analytics.
- Application IP collection is removed in consent version 2026-11-v2. No forwarded IP header is inspected and the ip_network column has been dropped. Infrastructure still receives connection IPs and may process operational logs.
- Events: view, engagement, action. Views include home, repair queue, check coverage, AI brief, overview, diagnosis, roadmap and report. Actions include demo/import/audit/export/print/clear/template controls.
- Active time is approximate: tab visible and focused, activity within 60 seconds, one-second samples and 15-second delivery. Closed tabs, blocked tracking, dropped requests and visitors who reject analytics cause undercounts. Sessions can include repeated or automated visits.
- Hourly pg_cron job `health-check-analytics-retention` removes events older than 30 days. No retention promise is made for independent provider logs/backups.

## Private reporting

Use the Supabase SQL editor, signed in as the project owner. Never expose these queries through an anonymous client.

```sql
-- Views and active viewing time by section
select view_name,
 count(*) filter (where event_type='view') as views,
 count(distinct session_id) as sessions,
 sum(active_seconds) as active_seconds,
 round(sum(active_seconds)::numeric / nullif(count(distinct session_id),0),1) as seconds_per_session
from public.usage_events where not is_test
group by view_name order by active_seconds desc;

-- Key actions
select action_name,count(*) as actions
from public.usage_events
where event_type='action' and not is_test
group by action_name order by actions desc;

-- Ordered section journeys
select session_id,jsonb_agg(view_name order by received_at,id) as journey
from public.usage_events
where event_type='view' and not is_test
group by session_id;
```

## Portfolio description

“I built a Recruiting Operations Health Check with a browser-based diagnostic engine, a Supabase Postgres database for synthetic recruiting data, and an Edge Function collecting consent-based usage analytics. I configured row-level security, candidate-ID import minimisation and automatic retention. Uploaded recruiting exports are processed locally.”

This describes the deployed architecture. It is independent of Ashby and does not claim access to Ashby's API or customer systems.

## Branding

Palette checked against CSS on https://www.ashbyhq.com on 5 November 2026: primary #483fad, deep purple #251c8c, darkest #080066, light purple #dbd9f1, pale background #f8f7ff. Colour styling does not imply endorsement.
