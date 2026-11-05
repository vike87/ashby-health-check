"""Reproducible fictional history linked to the existing demo's application IDs.
This is an educational extension, not a reconstruction of the original snapshot.
"""
import csv
import json
from datetime import date, timedelta
from pathlib import Path

root = Path(__file__).resolve().parents[1]
stages = ['Application review', 'Recruiter screen', 'Hiring manager interview', 'Technical / functional interview', 'Offer']
engineering = {'Research Engineer', 'Platform Engineer', 'Security Engineer', 'Engineering Manager', 'Solutions Engineer'}
commercial = {'Enterprise Account Executive', 'Customer Success Manager', 'Sales Development Representative', 'Revenue Operations Manager', 'Implementation Consultant'}
rows = list(csv.DictReader((root/'dist/demo.csv').open(newline='')))
events = []
for i, row in enumerate(rows):
    team = 'Engineering' if row['Job title'] in engineering else 'Commercial' if row['Job title'] in commercial else 'Corporate'
    cohort = 'September' if i < 120 else 'October'
    current = date(2026, 9 if cohort == 'September' else 10, 1 + i % 3)
    depth = min(4, (i * 7 + i // 20) % 5)
    for stage_no in range(depth + 1):
        duration = 1 + (i + stage_no) % 4
        if stage_no == 3:
            duration = (8 + i % 5) if team == 'Engineering' else (3 + i % 4)
            if cohort == 'October' and team == 'Engineering': duration += 2
        outcome = 'progressed' if stage_no < depth else ('hired' if depth == 4 and i % 3 == 0 else 'withdrawn' if i % 7 == 0 else 'rejected')
        if stage_no == depth and cohort == 'October' and i % 4 == 0: outcome = 'active'
        exited = current + timedelta(days=duration)
        events.append({'applicationId': row['Application ID'], 'roleId': row['Job ID'], 'role': row['Job title'], 'team': team, 'cohort': cohort, 'stage': stages[stage_no], 'entered': '' if (i + stage_no * 13) % 19 == 0 else current.isoformat(), 'exited': '' if outcome == 'active' else exited.isoformat(), 'outcome': outcome})
        current = exited

data = {'asOf': '2026-10-30', 'stages': stages, 'events': events, 'provenance': 'Entirely fictional historical exercise linked to the 240 existing demo Application IDs. Synthetic September and October entry cohorts; not a reconstruction of the snapshot or a real customer result.'}
(root/'dist/case-history.json').write_text(json.dumps(data, indent=2) + '\n')
with (root/'dist/case-history.csv').open('w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(events[0])); writer.writeheader(); writer.writerows(events)
print(f'{len(rows)} applications / {len(events)} fictional stage events')
