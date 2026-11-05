const allowedOrigin='https://ashby-recruiting-operations-health-check.holisticrecruiterclub.chatgpt.site';
const views=new Set(['home','repair-queue','checks','ai-brief','overview','diagnosis','roadmap','report','case-discovery','case-funnel','case-teaching','case-scope','case-report']);
const actions=new Set(['load-demo','upload-csv','run-audit','export-queue','download-brief','copy-brief','print-report','clear-data','template-download','case-export-metrics','case-export-guide','case-export-report','case-print-report','case-quiz','case-filter']);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
Deno.serve(async(req:Request)=>{
 const cors={'Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
 const reply=(status:number,body:string)=>new Response(body,{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.headers.get('origin')!==allowedOrigin)return reply(403,'{"error":"origin"}');
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return reply(405,'{"error":"method"}');
 if(Number(req.headers.get('content-length')||0)>12000)return reply(413,'{"error":"size"}');
 try{
  const text=await req.text();if(text.length>12000)return reply(413,'{"error":"size"}');
  const body=JSON.parse(text);if(body.consent!==true||body.version!=='2026-11-v2'||!uuid.test(body.sessionId)||!Array.isArray(body.events)||body.events.length<1||body.events.length>20)return reply(400,'{"error":"payload"}');
  const events=body.events.map((e:any)=>{
   if(!uuid.test(e.id)||!views.has(e.view)||!['view','engagement','action'].includes(e.type)||!Number.isInteger(e.seconds)||e.seconds<0||e.seconds>30||(e.type!=='engagement'&&e.seconds!==0)||(e.type==='action'&&!actions.has(e.action)))throw Error('event');
   return {event_id:e.id,session_id:body.sessionId,event_type:e.type,view_name:e.view,active_seconds:e.seconds,action_name:e.type==='action'?e.action:null,consent_version:body.version};
  });
  const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const base=Deno.env.get('SUPABASE_URL')!;
  // Per-session cap limits event spam; Origin/JWT here do not authenticate a visitor.
  const count=await fetch(base+'/rest/v1/usage_events?select=id&session_id=eq.'+body.sessionId,{headers:{apikey:key,Authorization:'Bearer '+key,Prefer:'count=exact',Range:'0-0'}});
  if(!count.ok)return reply(503,'{"error":"unavailable"}');
  const total=Number((count.headers.get('content-range')||'0/0').split('/')[1]);await count.body?.cancel();
  if(total>2000)return reply(429,'{"error":"limit"}');
  const saved=await fetch(base+'/rest/v1/usage_events?on_conflict=event_id',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(events)});
  return saved.ok?reply(200,'{"ok":true}'):reply(503,'{"error":"unavailable"}');
 }catch{return reply(400,'{"error":"payload"}');}
});
