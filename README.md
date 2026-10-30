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

Checks cover missing core values, date validity, stale applications, missing rejection reasons, future interviews on terminal applications, possible duplicates and inactivity across applications of open roles. Role checks cannot find jobs with zero applications, or activity omitted from the export. `Archived` does not necessarily mean rejected in every workflow: verify local policy before filling reasons. Duplicate checks flag same email + job, including legitimate reapplications. No automatic merging or ATS writes.

## What AI does

The audit engine is deterministic. The app creates an optional aggregate-only review prompt for manual use with Le Chat or an approved assistant. It does not call a model, claim to find causes, infer rejection reasons, or score candidates. Small counts are suppressed and larger counts bucketed; aggregation is not a guarantee of anonymity. Review before sharing. A direct AI integration is intentionally outside v0.1.

## Data and security

CSV contents are parsed in memory in the browser; no app database, storage, analytics, third-party scripts or automatic uploads. Clear data or reload removes app-held records. Downloads and clipboard copies remain. Hosting access logs are a separate consideration. Names and emails are optional. Use pseudonyms and minimise data. CSV exports neutralise formula-leading cells; HTML output is escaped. See [compliance notes](COMPLIANCE.md) and [security policy](SECURITY.md).

Limits: 20 MB / 50,000 rows; first 500 matching findings displayed, all exported. CSV parser handles quoted commas, escaped quotes, BOM, CRLF and multiline cells; malformed row widths fail visibly. Health findings are not a measure of candidate quality, recruiter performance, or regulatory compliance.

## Structure

- `dist/engine.js`: pure CSV parsing, audit rules, CSV export and AI brief
- `dist/app.js`: browser interactions
- `dist/index.html`, `dist/style.css`: responsive interface
- `tests/engine.test.cjs`: rule, privacy and boundary tests
- `dist/demo.csv`, `dist/template.csv`: synthetic sample and input contract

MIT licence. See [contribution guide](CONTRIBUTING.md). Never commit real candidate data, API keys or production exports. To host on GitHub Pages, deploy `dist/`; all paths are relative. The source ZIP omits Sites identity metadata.
