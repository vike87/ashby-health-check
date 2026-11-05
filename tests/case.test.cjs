const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
global.Health=require('../dist/engine.js');const E=require('../dist/case-engine.js'),data=require('../dist/case-history.json');
test('fictional history is linked to all existing demo IDs, has no identifiers, and preserves event order',()=>{
 const p=Health.parseCSV(fs.readFileSync('dist/demo.csv','utf8')),ids=new Set(p.rows.map(r=>r[0]));assert.equal(ids.size,240);assert.equal(new Set(data.events.map(e=>e.applicationId)).size,240);
 const seen=new Set();for(const e of data.events){assert.ok(ids.has(e.applicationId));const key=e.applicationId+'|'+e.stage;assert.ok(!seen.has(key));seen.add(key);assert.ok(!('email' in e)&&!('candidate' in e));if(e.entered)assert.ok(E.timestamp(e.entered)<=E.timestamp(data.asOf));if(e.exited){assert.ok(E.timestamp(e.exited)<=E.timestamp(data.asOf));if(e.entered)assert.ok(E.timestamp(e.exited)>=E.timestamp(e.entered));}}
 assert.equal(Health.parseCSV(fs.readFileSync('dist/case-history.csv','utf8')).rows.length,data.events.length);
});
test('completed durations, active ages and progression use separate denominators',()=>{
 const d={asOf:'2026-10-30',stages:['Screen'],events:[
  {applicationId:'a',stage:'Screen',entered:'2026-10-01',exited:'2026-10-03',outcome:'progressed'},
  {applicationId:'b',stage:'Screen',entered:'2026-10-01',exited:'2026-10-07',outcome:'rejected'},
  {applicationId:'c',stage:'Screen',entered:'2026-10-20',exited:'',outcome:'active'},
  {applicationId:'d',stage:'Screen',entered:'',exited:'2026-10-09',outcome:'withdrawn'}]};
 const m=E.analyse(d,{sla:7}),r=m.rows[0];assert.equal(r.median,4);assert.equal(r.completed,2);assert.equal(r.active,1);assert.equal(r.waitingMedian,10);assert.equal(r.overdue,1);assert.equal(r.excluded,1);assert.equal(r.resolved,3);assert.equal(r.progressed,1);assert.equal(r.progression,100/3);assert.equal(m.coverage,75);assert.equal(m.bottleneck,null);
});
test('invalid and future timestamps cannot create durations or imply clean data',()=>{
 const m=E.analyse({asOf:'2026-10-30',stages:['Screen'],events:[{applicationId:'a',stage:'Screen',entered:'2026-10-31',exited:'',outcome:'active'},{applicationId:'b',stage:'Screen',entered:'2026-10-03',exited:'2026-10-01',outcome:'rejected'},{applicationId:'c',stage:'Screen',entered:'2026-02-30',exited:'2026-10-01',outcome:'hired'}]});assert.equal(m.coverage,0);assert.equal(m.excluded,3);assert.equal(m.rows[0].median,null);assert.equal(m.rows[0].waitingMedian,null);
 assert.throws(()=>E.analyse(data,{sla:0}),/1–30/);assert.throws(()=>E.analyse(data,{sla:'bad'}),/1–30/);
});
test('team, role, cohort and stage filters are intersectional and exported metrics agree',()=>{
 const m=E.analyse(data,{team:'Engineering',role:'job-12',cohort:'October',stage:'Technical / functional interview',sla:10});assert.ok(m.eventCount>0);assert.equal(m.rows.length,1);assert.ok(m.rows[0].items.every(e=>e.team==='Engineering'&&e.roleId==='job-12'&&e.cohort==='October'));
 const csv=Health.parseCSV(E.metricsCSV(m));assert.equal(csv.rows.length,1);assert.equal(+csv.rows[0][1],m.rows[0].entered);assert.equal(+csv.rows[0][12],10);
 const empty=E.analyse(data,{role:'no-such-role'});assert.equal(empty.coverage,null);assert.equal(empty.bottleneck,null);assert.equal(empty.applications,0);
});
test('reports preserve proposed scope, selected evidence and explicit limits without pretending to be real results',()=>{
 const m=E.analyse(data,{team:'Engineering',cohort:'October'}),text=E.report(m,{objective:'Validate the technical interview clock.',owner:'People Analytics',target:'Agree a baseline first.',review:'2026-12-01'});
 for(const s of ['Validate the technical interview clock.','People Analytics','Agree a baseline first.','2026-12-01','October',m.applications+' applications','no achieved customer results','not a verified cause','Quality of Hire'])assert.ok(text.includes(s),s);
 assert.ok(!text.includes('@example.com'));assert.ok(!text.includes('Demo Candidate'));
});
