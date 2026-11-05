const {test}=require('node:test');const assert=require('node:assert/strict');
global.Health=require('../dist/engine.js');const {minimise}=require('../dist/minimise.js');const Ops=require('../dist/ops.js');
test('import allowlist strips direct identifiers, free text and hidden columns before diagnostics and exports',()=>{
 const input=Health.parseCSV('Application ID,Candidate ID,Candidate name,Email,Phone,CV,Notes,Job title,Application status,Current stage,Rejection reason,Candidate source,Last activity at\na-1,c-1,Alice Example,alice@example.test,0123456789,Secret CV,Private note,Secret Role,Active,Manager Alice,Personal rejection,Private source,not-a-date');
 const safe=minimise(input),json=JSON.stringify(safe);
 for(const privateValue of ['Alice','alice@','0123456789','Secret','Private','Personal','not-a-date'])assert.ok(!json.includes(privateValue),privateValue);
 assert.ok(json.includes('c-1'));assert.ok(json.includes('Role 001'));assert.ok(json.includes('Stage 001'));assert.ok(json.includes('Present'));assert.ok(json.includes('Invalid date'));
 const map=Health.autoMap(safe.headers),r=Health.audit(safe,map,{asOf:'2026-10-30'}),queue=Ops.queue(Ops.analyse(r,safe,map));
 assert.ok(queue.includes('c-1'));assert.ok(!queue.includes('Alice'));assert.ok(!queue.includes('alice@'));
 assert.ok(!Health.brief(r).includes('c-1'));
});
test('duplicate detection uses exact candidate IDs and roles; no email is needed or retained',()=>{
 const p=minimise(Health.parseCSV('Application ID,Candidate ID,Job title,Application status,Email\na,c1,Engineer,Active,a@example.test\nb,c1,Engineer,Active,b@example.test\nc,c2,Engineer,Active,a@example.test\nd,c1,Designer,Active,a@example.test'));
 const r=Health.audit(p,Health.autoMap(p.headers));assert.equal(r.issues.filter(x=>x.rule==='Possible duplicate').length,2);assert.ok(r.issues.filter(x=>x.rule==='Possible duplicate').every(x=>x.candidate==='c1'));
 assert.equal(r.checks.find(x=>x.name==='Possible duplicate applications').supported,true);
});
test('email-only input cannot enable duplicates; ID fields reject emails and free text',()=>{
 const p=minimise(Health.parseCSV('Application ID,Job title,Application status,Email\na,Engineer,Active,a@example.test\nb,Engineer,Active,a@example.test'));
 assert.equal(Health.audit(p,Health.autoMap(p.headers)).checks.find(x=>x.name==='Possible duplicate applications').supported,false);
 assert.throws(()=>minimise(Health.parseCSV('Application ID,Job title,Application status\na@example.test,Engineer,Active')),/opaque ATS ID/);
 assert.throws(()=>minimise(Health.parseCSV('Application ID,Candidate ID,Job title,Application status\na,Alice Example,Engineer,Active')),/opaque ATS ID/);
});
