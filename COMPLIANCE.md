# Safeguards and deployment assessment — 5 November 2026

This records implemented controls, not legal certification. See dist/responsible-use.html for the public notice.

## Intended purpose
Fixed-rule operational data-quality diagnostics. No model runs within the site. No candidate suitability scoring, ranking, shortlisting, profiling, rejection, protected-trait inference or automated ATS changes. Finding severity prioritises repairs. Human review is required; a human approval step is not a general exemption from recruitment AI law.

## Import minimisation
Imported CSVs pass through an allowlist before retained application state exists. Names, emails, phone numbers, notes, CVs and unrecognised columns are discarded. IDs are limited to 100 letters, digits, underscores or hyphens; this rejects common direct identifiers but cannot prove semantic anonymity. Users must prepare opaque ATS IDs and minimise their source export. Raw selected file text is read transiently in browser memory, and no forensic erasure is guaranteed.

Candidate and application IDs remain linkable personal data. Roles and stages become per-import references. Recognised operational statuses and timestamps are retained. Source and rejection reason become presence indicators. Duplicate checks use exact candidate ID and role; missing Candidate ID leaves the check unavailable. No email matching for imports. Synthetic demo data is clearly labelled and may retain fictional names for illustration.

## Storage, exports and AI
Uploaded records never leave the browser through application code. No CSV data is persisted to browser storage. Clearing or reloading removes working app references, not files or clipboard data. Repair queues retain pseudonymous IDs and operational evidence; organisations control their storage and retention. Reports correctly label real imports separately from the fictional demo. Recommendation notes must not contain personal data.

The optional external AI prompt contains fixed categories and aggregate totals only, excluding identifiers and raw values. Counts below five are suppressed; larger counts are bucketed. This is disclosure reduction, not a guarantee of anonymity. External AI use requires its own provider and purpose assessment.

## Optional visitor analytics
Consent version 2026-11-v2 invalidates old preferences and requires a fresh choice. No application analytics requests before allow or after reject. Reject and allow have equal styling. Preferences last six months; random journey identifiers last only for the current page visit. Events are allowlisted and contain no CSV values or typed text. Application IP network collection has been removed, including its database column. Infrastructure may still process full IPs in operational logs, outside application retention. Private RLS-protected usage events expire after 30 days via an hourly database job. Public access is limited to the fictional dataset. Revoking consent stops future collection; it does not promise retroactive removal of events already received.

## Deployment-specific work remains
The controller must establish lawful basis, privacy information, rights handling, authorised users, retention and incident handling, processor terms and transfer safeguards, and DPIA necessity. Assess actual functionality and use under EU AI Act definitions and Annex III. US federal anti-discrimination and jurisdiction-specific rules, including NYC and Illinois, require separate assessment where applicable. Reassess before adding AI recommendations about people or using the tool to influence employment decisions. No claim of all-jurisdiction compliance is supported by this demonstration.

Official primary sources:
- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- EU AI Act: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng
- NYC DCWP: https://www.nyc.gov/site/dca/businesses/faq-automated-employment-decision-tools.page
- Illinois: https://ilga.gov/legislation/PublicActs/View/103-0804
- CNIL analytics: https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience
