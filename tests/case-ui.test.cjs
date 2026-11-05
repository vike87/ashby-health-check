const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
async function setup(){
 const nodes={},blobs=[],classes=new Set(),tabs=['discover','investigate','teach','scope','report'].map(id=>({dataset:{caseview:id},setAttribute(k,v){this[k]=v;},focus(){}})),go=['investigate','teach','scope','report'].map(id=>({dataset:{casego:id}}));
 const el=id=>nodes[id]??={value:({'case-team':'Engineering','case-sla':'7','case-objective':'Validate stage delays.','case-target':'Confirm coverage first.','case-owner':'Recruiting Operations','case-review':'2026-11-30'})[id]||'',innerHTML:'',textContent:'',hidden:false,disabled:false,querySelectorAll(){return [];},focus(){}};
 const document={getElementById:el,querySelectorAll:s=>s==='[data-caseview]'?tabs:s==='[data-casego]'?go:[],querySelector:()=>null,createElement:()=>({click(){}}),body:{classList:{add:s=>classes.add(s),remove:s=>classes.delete(s)}}};
 let printed=0;const ctx=vm.createContext({document,console,Blob,URL:{createObjectURL:b=>{blobs.push(b);return 'blob:case'},revokeObjectURL(){}},setTimeout(){},fetch:async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('dist/case-history.json','utf8'))}),window:null});ctx.window=ctx;ctx.print=()=>{assert.ok(classes.has('case-print'));printed++;};
 for(const f of ['engine.js','case-engine.js','case-ui.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx,{filename:f});await new Promise(setImmediate);
 return {el,tabs,go,blobs,classes,printed:()=>printed};
}
test('case loads, filters update evidence, and report scope follows current selection',async()=>{
 const a=await setup();assert.match(a.el('case-analysis').innerHTML,/11.0 days/);assert.match(a.el('case-status').textContent,/Engineering/);
 a.el('case-team').value='Commercial';a.el('case-team').onchange();assert.match(a.el('case-status').textContent,/Commercial/);assert.match(a.el('case-analysis').innerHTML,/4.0 days/);
 a.el('case-objective').value='<script>private</script>';a.el('case-objective').oninput();assert.ok(!a.el('case-report-content').innerHTML.includes('<script>'));assert.ok(a.el('case-report-content').innerHTML.includes('&lt;script&gt;'));
 a.el('case-target').value='Agreed metric definition before targets.';a.el('case-target').oninput();a.el('case-report-download').onclick();assert.match(await a.blobs[0].text(),/Commercial/);assert.match(await a.blobs[0].text(),/Agreed metric definition before targets/);
});
test('invalid thresholds and dates disable stale exports, then recover',async()=>{
 const a=await setup();a.el('case-sla').value='0';a.el('case-sla').onchange();assert.equal(a.el('case-metrics').disabled,true);assert.equal(a.el('case-print').disabled,true);assert.equal(a.el('case-report-download').disabled,true);
 a.el('case-sla').value='7';a.el('case-sla').onchange();assert.equal(a.el('case-metrics').disabled,false);a.el('case-review').value='2026-02-30';a.el('case-review').oninput();assert.equal(a.el('case-report-download').disabled,true);a.el('case-review').value='2026-11-30';a.el('case-review').oninput();assert.equal(a.el('case-report-download').disabled,false);
});
test('case steps, keyboard navigation, learning feedback, print and downloads work',async()=>{
 const a=await setup();a.go[0].onclick();assert.equal(a.el('case-investigate-panel').hidden,false);assert.equal(a.el('case-discover-panel').hidden,true);a.tabs[1].onkeydown({key:'ArrowRight',preventDefault(){}});assert.equal(a.el('case-teach-panel').hidden,false);
 a.el('case-check-answer').onclick();assert.match(a.el('case-quiz-feedback').textContent,/Choose a response/);
 a.el('case-metrics').onclick();assert.match(await a.blobs[0].text(),/Median completed days/);a.el('case-guide').onclick();assert.match(await a.blobs[1].text(),/missing dates into zero/);
 a.tabs[4].onclick();a.el('case-print').onclick();assert.equal(a.printed(),1);assert.equal(a.classes.size,0);
});
