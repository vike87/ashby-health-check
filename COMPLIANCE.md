# Privacy and AI governance notes — v0.1

Prepared 30 October 2026. Engineering safeguards, not a legal opinion or compliance certificate. Live official legal sources could not be retrieved during this build; the references below are provided for review, and legal interpretation and current commencement dates must be verified before production use.

## Intended purpose and boundaries

A deterministic data-quality checker for application records. No candidate evaluation, profiling, ranking, selection, rejection, emotion recognition, biometric analysis or automated employment decisions. Findings prioritise repairs, not people. Human operators verify the evidence and make all changes outside the tool. The optional AI workflow exports only fixed, aggregate categories and bucketed counts for manual review; it runs no AI model.

## GDPR design mapping

- Articles 5 and 25: purpose limitation and minimisation; optional identifiers, no CV ingestion, no persistence or analytics, no external scripts. Users must still minimise their export and determine retention.
- Article 6: the employer/controller must identify and document an appropriate lawful basis. Consent is not assumed to be appropriate in employment contexts.
- Articles 9 and 10: do not include special-category data or criminal-conviction data. Do not infer these attributes.
- Articles 12–22: the controller remains responsible for notices and handling data-subject rights. A local-only tool does not remove those obligations. This tool does not perform automated decisions under Article 22.
- Articles 28 and 44–49: evaluate hosting, any chosen AI provider, processor terms, sub-processors and international transfers before sharing data. No inference provider is integrated by this app. Access logs may still be processed by hosting/authentication providers.
- Article 32: browser-only processing, restrictive content security policy, escaped HTML, CSV formula mitigation, no embedded secrets. Production hosting still needs TLS, access controls, patching and endpoint security.
- Article 35: the controller must assess whether the proposed deployment needs a DPIA. A DPIA is not automatically mandatory or unnecessary just because this app is local-first.

## EU AI Act assessment boundary

The core rule engine does not use machine learning or inference to assess people. The optional generated prompt is not an integrated model. An external assistant used with that prompt must be assessed in its own deployment context. Do not make a categorical claim that all recruitment AI is exempt, or that adding a human approval button removes high-risk status.

AI systems intended for recruiting or selecting people, filtering applications or evaluating candidates may fall within Annex III employment categories. Any future extension into such uses needs a fresh intended-purpose/classification assessment and applicable provider/deployer obligations. Document any reliance on Article 6 exceptions and seek qualified review. Do not infer an exemption from the open-source licence. Article 4 AI literacy should be considered where an organisation deploys an AI assistant; verify the current scope and application dates.

## Data flow

1. Hosting provider serves static app assets and may process access metadata.
2. User selects a local CSV. Its contents are read into browser-tab memory and rendered locally.
3. User may download a queue containing personal data; that copy becomes subject to the organisation’s handling and retention controls.
4. Optional brief contains no raw identifiers, titles, dates or free-text source values. Counts below five are suppressed; larger counts use five-wide buckets. This reduces disclosure but is not formal anonymisation or differential privacy. Auxiliary knowledge can still identify small groups.
5. Only the user chooses whether and where to paste the brief. Opening Le Chat does not transmit the brief automatically.
6. Clear data resets in-app references and DOM content; it does not guarantee forensic erasure of browser memory, downloaded files or clipboard contents.

## Before real-data use

Record the purpose and lawful basis; approve the export fields; restrict authorised users; assess DPIA need, notices, rights and retention; review hosting/provider terms and transfers; validate the rules against a representative pseudonymised export; train operators on false positives and AI limitations. Do not use the prototype for employment decisions or public candidate reporting.

## Official references for legal verification

- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- EU AI Act: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng
- European Commission AI Act overview: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- CNIL AI resources: https://www.cnil.fr/en/artificial-intelligence

No assertion is made that these sources were successfully verified live during this build. Obtain a deployment-specific review before advertising GDPR or EU AI Act compliance.
