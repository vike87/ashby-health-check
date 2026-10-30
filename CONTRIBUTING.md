# Contributing

Use synthetic fixtures only. Describe the operational problem and expected behaviour. Add meaningful tests for rule changes, particularly missing columns, dates, false positives and privacy boundaries. Run `node --test tests/*.test.cjs`. Keep dependencies out unless clearly justified. Never add candidate scoring, sensitive-trait inference, automatic ATS changes, telemetry or external data sharing without revisiting the intended purpose and governance assessment. Do not present Mistral or Ashby as sponsors.
