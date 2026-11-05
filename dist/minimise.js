(function(root){
'use strict';
// Import allowlist: discard every unrecognised column before application state exists.
// IDs are pseudonyms, not anonymous data. Callers must supply opaque ATS IDs.
function minimise(input){
 const map=Health.autoMap(input.headers), extras={source:input.headers.find(h=>/^(candidate source|source)$/i.test(h)),completed:input.headers.find(h=>/^interview completed at$/i.test(h)),feedback:input.headers.find(h=>/^feedback submitted at$/i.test(h))};
 const columns=[['id','Application ID'],['candidateId','Candidate ID'],['job','Job title'],['status','Application status'],['stage','Current stage'],['entered','Stage entered at'],['activity','Last activity at'],['reason','Rejection reason'],['interview','Next interview at'],['jobStatus','Job status'],['jobId','Job ID'],['source','Candidate source'],['completed','Interview completed at'],['feedback','Feedback submitted at']].filter(([k])=>map[k]||extras[k]);
 const roles=new Map(),stages=new Map();
 const alias=(lookup,value,prefix)=>{if(!value)return '';if(!lookup.has(value))lookup.set(value,prefix+' '+String(lookup.size+1).padStart(3,'0'));return lookup.get(value);};
 const value=(row,k)=>String(row[input.headers.indexOf(map[k]||extras[k])]||'').trim();
 const opaque=(v,k,row)=>{if(v&&!/^[A-Za-z0-9_-]{1,100}$/.test(v))throw Error('Row '+row+': '+k+' must contain an opaque ATS ID (letters, digits, hyphens or underscores), never a name, email or phone number. Prepare a minimised export before importing.');return v;};
 const rows=input.rows.map((row,i)=>columns.map(([k])=>{
  const v=value(row,k);
  if(['id','candidateId','jobId'].includes(k))return opaque(v,k,i+2);
  if(k==='job')return v?alias(roles,value(row,'jobId')||v,'Role'):'';
  if(k==='stage')return alias(stages,v,'Stage');
  if(['reason','source'].includes(k))return v?'Present':'';
  if(['entered','activity','interview','completed','feedback'].includes(k))return !v?'':Health.date(v)?v:'Invalid date';
  if(k==='status')return ['active','in process','in progress','rejected','archived','hired','withdrawn'].includes(v.toLowerCase())?v.toLowerCase():v?'Unrecognised':'';
  if(k==='jobStatus')return ['open','published','closed','paused','draft','archived'].includes(v.toLowerCase())?v.toLowerCase():v?'Unrecognised':'';
  return '';
 }));
 return {headers:columns.map(([,label])=>label),rows};
}
const api={minimise};if(typeof module!=='undefined')module.exports=api;root.Privacy=api;
})(typeof window!=='undefined'?window:globalThis);
