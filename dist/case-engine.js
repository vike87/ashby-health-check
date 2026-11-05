(function(root){
'use strict';
const DAY=86400000;
function timestamp(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v||''))return null;const n=Date.parse(v+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===v?n:null;}
function median(values){if(!values.length)return null;const a=[...values].sort((a,b)=>a-b),i=Math.floor(a.length/2);return a.length%2?a[i]:(a[i-1]+a[i])/2;}
function analyse(data,filters={}){
 const asOf=timestamp(data.asOf),sla=Number(filters.sla??7);if(asOf===null||!Number.isFinite(sla)||sla<1||sla>30)throw Error('Use a valid reference date and a 1–30 day review threshold.');
 const events=data.events.filter(e=>(!filters.team||e.team===filters.team)&&(!filters.role||e.roleId===filters.role)&&(!filters.cohort||e.cohort===filters.cohort));
 const rows=data.stages.filter(stage=>!filters.stage||stage===filters.stage).map(stage=>{
  const items=events.filter(e=>e.stage===stage),completed=[],waiting=[];let excluded=0;
  items.forEach(e=>{const start=timestamp(e.entered),end=timestamp(e.exited);if(start===null||start>asOf||(e.outcome!=='active'&&(end===null||end<start||end>asOf))){excluded++;return;}if(e.outcome==='active')waiting.push((asOf-start)/DAY);else completed.push((end-start)/DAY);});
  const resolved=items.filter(e=>['progressed','hired','rejected','withdrawn'].includes(e.outcome)),progressed=resolved.filter(e=>['progressed','hired'].includes(e.outcome));
  return {stage,entered:new Set(items.map(e=>e.applicationId)).size,resolved:resolved.length,progressed:progressed.length,progression:resolved.length?100*progressed.length/resolved.length:null,completed:completed.length,median:median(completed),active:items.filter(e=>e.outcome==='active').length,validActive:waiting.length,waitingMedian:median(waiting),overdue:waiting.filter(n=>n>sla).length,excluded,items};
 });
 const selected=rows.flatMap(r=>r.items),validDurations=rows.reduce((n,r)=>n+r.completed+r.validActive,0);
 const bottleneck=[...rows].filter(r=>r.completed>=5).sort((a,b)=>b.median-a.median)[0]||null;
 return {asOf:data.asOf,filters:{...filters,sla},applications:new Set(events.map(e=>e.applicationId)).size,eventCount:selected.length,validDurations,coverage:selected.length?100*validDurations/selected.length:null,excluded:rows.reduce((n,r)=>n+r.excluded,0),rows,bottleneck,provenance:data.provenance};
}
function metricsCSV(model){return root.Health.csv([['Stage','Applications entered','Known outcomes','Moved forward','Moved forward (%)','Completed records with usable dates','Typical completed days','Still in stage','Active records with usable dates','Typical active days','Waiting past review point','Records with date gaps','Review point (days)','As of'],...model.rows.map(r=>[r.stage,r.entered,r.resolved,r.progressed,r.progression===null?'':r.progression.toFixed(1),r.completed,r.median??'',r.active,r.validActive,r.waitingMedian??'',r.overdue,r.excluded,model.filters.sla,model.asOf])]);}
function report(model,scope={}){
 const num=n=>n===null?'Unavailable':Number(n).toFixed(1),b=model.bottleneck;const active=model.rows.reduce((n,r)=>n+r.active,0),validActive=model.rows.reduce((n,r)=>n+r.validActive,0),overdue=model.rows.reduce((n,r)=>n+r.overdue,0);
 return '# Recruiting operations — proposed customer engagement\n\nFICTIONAL CUSTOMER CASE. Proposed targets and actions; no achieved customer results.\n\n'+
 '## Customer objective\n'+(scope.objective||'Understand and reduce avoidable delays in the engineering interview process.')+'\n\n'+
 'Analysis scope: '+(model.filters.team||'All teams')+'; '+(model.filters.role||'all roles')+'; '+(model.filters.cohort||'both entry cohorts')+'; '+(model.filters.stage||'all stages')+'. Reference date: '+model.asOf+'.\n\n'+
 '## What the records show\n1. Date quality: '+model.applications+' applications in this view; '+num(model.coverage)+'% of stage records have usable dates. '+model.excluded+' records need date checks.\n'+
 '2. Stage time: '+(b?b.stage+' has the longest typical completed time in this view: '+num(b.median)+' days, based on '+b.completed+' completed records. Scheduling, feedback and role mix still need checking.':'There are too few completed records to identify a useful stage comparison.')+'\n3. Current work: '+active+' applications are still in a stage; '+overdue+' have waited beyond the '+model.filters.sla+'-day review point. These are separate from completed stage times.\n\n'+
 '## Proposed priorities\n1. Validate stage timestamps and export coverage. Owner: ATS administrator. Acceptance: reconcile a source-record sample and explain missing timestamps.\n2. Investigate interview scheduling and feedback ownership. Owner: TA lead with hiring managers. Acceptance: agree evidence-backed ownership and escalation rules.\n3. Pilot the agreed process and review a comparable cohort. Owner: Recruiting Operations. Acceptance: review duration and feedback completeness without claiming causation from an uncontrolled comparison.\n\n'+
 '## Proposed engagement\nSponsor: Head of Talent. Delivery owner: '+(scope.owner||'Recruiting Operations')+'.\nDeliverables: validated baseline, scoped diagnosis, stage ownership playbook, enablement session and review report.\nSuccess criterion (proposed, not achieved): '+(scope.target||'Confirm a baseline, then agree an improvement target with the customer.')+'\nReview date (proposed): '+(scope.review||'2026-11-30')+'.\nDependencies: authorised export, stakeholder availability and access to source records.\nExclusions: candidate suitability decisions, ATS migration, integrations, custom development and Quality of Hire measurement without agreed performance data.\nChange control: assess new requests against the agreed scope, estimate effort and obtain sponsor agreement.\n\n'+
 '## CSM handover\nCSM: reinforce agreed definitions, routine report use and ownership. Specialist: complex cohort methodology, conflicting timestamps or multi-workflow redesign. Product: document reproducible product gaps only after excluding export and configuration causes.\n\n'+
 '## How to read this\nTypical time is the median time for completed stages with usable dates. Current waits are shown separately. The September and October groups have different time to progress; role mix can also vary. A longer time is not a verified cause. These figures cannot establish time to fill or Quality of Hire.\n'+model.provenance+'\n';
}
const api={timestamp,median,analyse,metricsCSV,report};if(typeof module!=='undefined')module.exports=api;root.CaseEngine=api;
})(typeof window!=='undefined'?window:globalThis);
