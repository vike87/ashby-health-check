# Recruiting Operations Health Check — consultant portfolio demo

**Built by John Hazelton.** Independent portfolio demonstration using synthetic data. Not affiliated with or endorsed by Ashby.

Tagline: **From recruiting data to better operational decisions.**

## Run and verify

No installation or paid API required. Run `python3 -m http.server 8080 --directory dist`, then open `http://localhost:8080`. Run automated tests with `node --test tests/*.test.cjs` (Node 20+). For GitHub Pages, publish the `dist/` directory.

## Consulting experience

The original CSV diagnostics and repair queue remain in place. The consultant workspace adds four-category scoring, evidence-linked observations and explicitly unverified root-cause hypotheses, recommended owners and success metrics, an editable session-only 30-day plan, and a print/PDF-friendly report. The repair queue export includes suggested owners and derives from current findings.

**Scoring methodology:** Each category starts at 100. For its findings, subtract `100 × sum(severity weights) / (3 × application count)`, with High=3, Medium=2, Low=1; floor at zero. Overall is the rounded arithmetic mean of the four categories. This is an illustrative issue-density index, **not** a validated industry health benchmark. Counts are findings, not necessarily unique people. Score coverage must always be read alongside unavailable checks.

**Evidence limitations:** The existing 37-row fictional application CSV supports stale stages, disposition gaps, potential duplicate applications, incomplete core fields, date anomalies, status/interview conflicts and application-level inactivity for open roles. Additional source-completeness and interview-feedback checks run only if the upload contains columns named `Candidate source` or `Source`, and both `Interview completed at` and `Feedback submitted at`, respectively. Stage-configuration consistency and actual requisition time-to-fill are **not measured** without job-stage configuration and requisition open/close histories. Do not interpret unavailable checks as passing. No real Ashby integration, authentication or backend is included.

**Security:** Local browser CSV parsing, no candidate scoring, no ATS writes, optional consent-based usage analytics and no paid model APIs. CSV exports neutralise spreadsheet formula injection. Use synthetic data for public demonstrations; real recruiting exports require appropriate access controls and retention policies.

---

# Ashby Health Check

An independent, local-first recruiting operations MVP by Holistic Recruiter Club. Inspired by Mistral’s Recruiting Operations Manager brief; not affiliated with Mistral AI or Ashby. Cream, orange and pixel landscape styling references Mistral’s visual language without using its logo.

## Run in two minutes

Requirements: Python 3 to serve the site; Node.js 20+ only for tests. No package install required.

```sh
python3 -m http.server 8080 --directory dist
# Open http://localhost:8080
node --test tests/*.test.cjs
python3 scripts/package.py  # refresh the downloadable source archive
```

Select **Explore the demo** for a fictional 37-application dataset with known issues. The demo uses a fixed audit date of 2026-10-30. Your own uploads default to today. Only synthetic data is included.

## Ashby workflow

Create an application-level report in Ashby and export it to CSV, with one row per application. The fields available and their labels depend on report configuration and permissions; the template is our import contract, not a claim of an official Ashby export schema. Map your columns in Import settings. This MVP has not been validated against a real Mistral export or private Ashby account.

Required: Application ID, Job title, Application status. Optional columns unlock additional checks; see `dist/template.csv`. Dates must be ISO YYYY-MM-DD or ISO timestamps. Accepted statuses (case-insensitive): Active / In process / In progress; Rejected / Archived / Hired / Withdrawn. Other statuses are flagged for manual normalisation. Stage entry must be the date the current stage began, not application creation. Last activity must represent application activity, not an unrelated record update. Job IDs improve grouping when titles repeat.

Checks cover missing core values, date validity, stale applications, missing rejection reasons, future interviews on terminal applications, possible duplicates and inactivity across applications of open roles. Role checks cannot find jobs with zero applications, or activity omitted from the export. `Archived` does not necessarily mean rejected in every workflow: verify local policy before filling reasons. For local imports, duplicate checks use exact Candidate ID plus role, including legitimate reapplications; email is discarded. The synthetic demo can illustrate the legacy email match. No automatic merging or ATS writes.

## What AI does

The audit engine is deterministic. The app creates an optional aggregate-only review prompt for manual use with Le Chat or an approved assistant. It does not call a model, claim to find causes, infer rejection reasons, or score candidates. Small counts are suppressed and larger counts bucketed; aggregation is not a guarantee of anonymity. Review before sharing. A direct AI integration is intentionally outside v0.1.

## Data and security

CSV contents are parsed in browser memory and reduced to approved fields before retained audit state. Uploaded data is never sent to Supabase. Supabase stores only the fictional demo and optional consent-based usage analytics. Clear data or reload removes app-held records. Downloads and clipboard copies remain. Hosting access logs are a separate consideration. Imports discard names, emails, phone numbers, CVs, notes and extra columns. Use opaque candidate and application IDs; IDs remain personal data. Roles and stages become local references, and reason/source retain presence only. Prepare a minimised source export first. CSV exports neutralise formula-leading cells; HTML output is escaped. Application analytics stores no IP addresses or networks. See [safeguards](dist/responsible-use.html) and [compliance notes](COMPLIANCE.md) and [security policy](SECURITY.md).

Limits: 20 MB / 50,000 rows; first 500 matching findings displayed, all exported. CSV parser handles quoted commas, escaped quotes, BOM, CRLF and multiline cells; malformed row widths fail visibly. Health findings are not a measure of candidate quality, recruiter performance, or regulatory compliance.

## Structure

- `dist/engine.js`: pure CSV parsing, audit rules, CSV export and AI brief
- `dist/app.js`: browser interactions
- `dist/index.html`, `dist/style.css`: responsive interface
- `tests/engine.test.cjs`: rule, privacy and boundary tests
- `dist/demo.csv`, `dist/template.csv`: synthetic sample and input contract

MIT licence. See [contribution guide](CONTRIBUTING.md). Never commit real candidate data, API keys or production exports. To host on GitHub Pages, deploy `dist/`; all paths are relative. The source ZIP omits Sites identity metadata.
