import csv,datetime,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
with (root/'tests/fixtures/original-demo.csv').open() as f:
    rows=list(csv.DictReader(f)); headers=list(rows[0])
roles=['Senior Product Designer','Platform Engineer','Customer Success Manager','Recruiting Coordinator','Data Analyst','Product Manager','Finance Business Partner','Security Engineer','Growth Marketing Manager','Solutions Engineer','Talent Acquisition Partner','Sales Development Representative','Engineering Manager','People Partner','Implementation Consultant','Revenue Operations Manager']
stages=['Application review','Recruiter screen','Hiring manager interview','Technical interview','Final interview','Offer']
sources=['Careers site','Employee referral','LinkedIn','Agency','Direct sourcing']
asof=datetime.date(2026,10,30)
for n in range(38,241):
    role=(n-38)%len(roles);age=(n*7)%48;status=['Active']*6+['Rejected','Hired','Withdrawn','Archived']
    status=status[n%len(status)];r={k:'' for k in headers}
    r.update({'Application ID':f'app-{n:03}','Candidate name':f'Demo Candidate {n:03}','Candidate email':f'candidate{n:03}@example.com','Job ID':f'job-{role+5:02}','Job title':roles[role],'Application status':status,'Current interview stage':stages[n%6],'Stage entered at':str(asof-datetime.timedelta(days=age)),'Last activity at':str(asof-datetime.timedelta(days=n%12)),'Job status':'Open' if role%5 else 'Paused','Candidate source':sources[n%5] if n%13 else '', 'Recruiter':['Morgan Lee','Taylor Brooks','Alex Rivers','Charlie Ellis'][n%4], 'Hiring manager':['Sam Patel','Jordan Ellis','Casey Martin','Robin Chen'][role%4]})
    if status in ['Rejected','Archived'] and n%4:r['Rejection reason']=['Role requirements','Candidate withdrew','Position closed'][n%3]
    if n%4==0:
        r['Interview completed at']='2026-10-20';r['Feedback submitted at']='2026-10-24' if n%12==0 else '2026-10-21'
    if n%29==0:r['Interview completed at']='2026-10-20';r['Feedback submitted at']=''
    if n%41==0:r['Stage entered at']='30/10/2026'
    if n%43==0 and status=='Active':r['Stage entered at']=''
    if n%47==0:r['Next interview at']='2026-11-06'
    rows.append(r)
with (root/'dist/demo.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=headers);w.writeheader();w.writerows(rows)
(root/'supabase/demo-seed.json').write_text(json.dumps({'headers':headers,'rows':[[r[k] for k in headers] for r in rows]}))
print(f'{len(rows)} fictional applications / {len(set(r["Job ID"] for r in rows))} roles')
