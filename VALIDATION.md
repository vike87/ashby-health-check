# Validation — 5 November 2026

- 20 automated tests pass: diagnostic branches, CSV parsing, duplicate scope, date validation, thresholds, optional-column coverage, scoring, export contents and formula neutralisation.
- App integration checks cover fictional demo, local CSV import, malformed input, invalid mappings and thresholds, filters, export content and clearing/invalidation.
- Browser checks passed: demo startup, priority and search filters, nine-check coverage, aggregate brief, CSV and text downloads, editable roadmap, report generation, clear and reload.
- Original JavaScript startup syntax error repaired. Consultant state invalidates when settings change or data is cleared. Extended source and feedback findings now match across overview, queue and exports.
- PDF uses the browser print dialogue; report markup and print stylesheet inspected. Automated PDF rendering and mobile-device browser testing were not performed.
- Fictional data only. No live Ashby integration or representative real export validation. Independent consultant portfolio demonstration, not affiliated with or endorsed by Ashby.

## Supabase, analytics and branding update

- 240 fictional applications across 20 roles; original 37-record fixture retained for deterministic regression tests.
- 23 automated tests pass, including opt-in/rejection, IP masking and expanded dataset consistency.
- Supabase REST demo fetch: 200 with 240 records. Anonymous analytics SELECT and INSERT: 401. Collector: 200; declined-consent payload: 400. Test event read back with masked IP network and 10 engagement seconds, marked as test-only.
- Security advisors: no findings after explicit private analytics policy. Hourly 30-day retention job enabled.
- Preview browser displays 240 records; external Supabase request returns Failed to fetch in preview, so bundled fallback is exercised. Public deployment browser integration is checked separately.
- Ashby purple palette verified against public website stylesheet. Independent portfolio notice retained.

- Published browser checks: Ashby palette, 240 demo applications, all nine checks, allow/reject/reopen/withdraw analytics controls passed. The cloud browser cannot fetch Supabase directly and uses bundled fallback. Supabase CORS preflight and REST endpoints passed direct HTTP tests; browser-to-Supabase collection remains unverified in this environment.

## Candidate-ID and governance update — 5 November 2026

- Import allowlist discards direct identifiers, unrecognised columns and free text before retained audit state. Candidate IDs support duplicate checks; roles/stages are local references. Tests verify removal from retained data, findings and CSV exports, with IDs excluded from external AI briefs.
- Failed imports invalidate previous results. Local imports and synthetic demos are labelled separately in reports. Operational purpose and human verification boundaries are visible in the UI.
- Analytics consent v2 requires a fresh choice; no application IP processing or storage. Existing IP network column removed. Collector v2 live checks: consent=false rejected (400), consent=true accepted (200); 10-second test event read back as v2 and marked test-only.
- Database read-back confirms analytics RLS on, anonymous SELECT/INSERT denied, IP column absent and hourly 30-day retention job active. Supabase security advisors returned no findings.
- Browser preview confirmed Supabase demo loads directly with 240 applications and 9/9 checks after correcting CSP connection allowlist. Import/export minimisation is covered by automated integration tests; production legal compliance has not been certified.
