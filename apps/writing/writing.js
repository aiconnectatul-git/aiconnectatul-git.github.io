const {tiles,card,table,outbox,empty,nf,esc}=U;
const lines=s=>s.split(/\r?\n/);
const STOP=new Set("the and for that with this from have are was were but not you your all can will has had its it's they them their there what when which who how into than then out our about also been more would could should just over some any one two".split(" "));

U.Suite({slug:"writing",name:"Writing & Text",kicker:"TEXT",ico:"Aa",tools:[

{id:"count",ico:"123",name:"Word & Character Counter",desc:"Words, characters, sentences, reading time and top keywords as you type.",stack:true,
 fields:[{id:"t",type:"area",label:"Your text",rows:9,ph:"Type or paste text here…",value:"",nosave:true}],
 out(v){const t=v.t;if(!t.trim())return tiles([{k:"WORDS",v:"0",c:"hero"},{k:"CHARACTERS",v:"0"},{k:"READING TIME",v:"0 min"}]);
  const words=t.match(/[\p{L}\p{N}'’-]+/gu)||[],n=words.length,sent=(t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).filter(x=>x.trim()).length,para=t.split(/\n\s*\n/).filter(x=>x.trim()).length;
  const freq={};words.forEach(w=>{w=w.toLowerCase();if(w.length>2&&!STOP.has(w))freq[w]=(freq[w]||0)+1});
  const top=Object.entries(freq).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,8);
  const mins=m=>m<1?"< 1 min":Math.round(m)+" min";
  return tiles([{k:"WORDS",v:nf(n,0),c:"hero"},{k:"CHARACTERS",v:nf(t.length,0),s:nf(t.replace(/\s/g,"").length,0)+" without spaces"},{k:"SENTENCES",v:nf(sent,0)},{k:"PARAGRAPHS",v:nf(para,0)},{k:"LINES",v:nf(lines(t).length,0)},{k:"READING TIME",v:mins(n/200),s:"speaking: "+mins(n/130)}])
   +(top.length?card("TOP KEYWORDS",table(["WORD","COUNT","SHARE"],top.map(([w,c])=>[esc(w),c,nf(c/n*100,1)+"%"]))):"")}},

{id:"lorem",ico:"Lo",name:"Lorem Ipsum Generator",desc:"Placeholder text for designs and mock-ups.",stack:true,
 fields:[{id:"u",type:"choice",label:"Generate",value:"p",options:[["p","Paragraphs"],["s","Sentences"],["w","Words"]]},{id:"n",type:"num",label:"How many",value:3,step:1},{id:"cl",type:"choice",label:"Start with “Lorem ipsum”",value:"y",options:[["y","Yes"],["n","No"]]}],
 out(v){const n=Math.min(500,Math.max(1,Math.round(v.n)));
  const W="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
  let seed=n*7919+(v.u==="p"?1:v.u==="s"?2:3);const rnd=()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296;
  const word=()=>W[Math.floor(rnd()*W.length)],cap=s=>s[0].toUpperCase()+s.slice(1);
  const sentence=()=>{const k=7+Math.floor(rnd()*10),a=Array.from({length:k},word);let s=cap(a.join(" "));const c=3+Math.floor(rnd()*4);if(k>8){const w=s.split(" ");w[c]+=",";s=w.join(" ")}return s+"."};
  let out;
  if(v.u==="w"){out=Array.from({length:n},word);if(v.cl==="y"){out[0]="lorem";if(n>1)out[1]="ipsum"}out=cap(out.join(" "))+"."}
  else if(v.u==="s"){out=Array.from({length:n},sentence);if(v.cl==="y")out[0]="Lorem ipsum dolor sit amet, consectetur adipiscing elit.";out=out.join(" ")}
  else{out=Array.from({length:n},()=>Array.from({length:3+Math.floor(rnd()*4)},sentence).join(" "));if(v.cl==="y")out[0]="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "+out[0].split(". ").slice(1).join(". ");out=out.join("\n\n")}
  return outbox("RESULT",out)}},

{id:"dedupe",ico:"≠",name:"Remove Duplicate Lines",desc:"Keep the first copy of every line and drop the repeats.",stack:true,
 fields:[{id:"t",type:"area",label:"Lines",rows:8,ph:"One item per line…",value:"",nosave:true},{id:"cs",type:"choice",label:"Match",value:"i",options:[["s","Case-sensitive"],["i","Ignore case"]]},{id:"tr",type:"choice",label:"Trim spaces",value:"y",options:[["y","Yes"],["n","No"]]},{id:"em",type:"choice",label:"Drop empty lines",value:"y",options:[["y","Yes"],["n","No"]]}],
 out(v){if(!v.t.trim())return empty("Paste some lines above.");const seen=new Set(),out=[];let total=0;
  for(let l of lines(v.t)){total++;if(v.tr==="y")l=l.trim();if(v.em==="y"&&!l)continue;const k=v.cs==="i"?l.toLowerCase():l;if(seen.has(k))continue;seen.add(k);out.push(l)}
  return tiles([{k:"UNIQUE LINES",v:nf(out.length,0),c:"hero"},{k:"REMOVED",v:nf(total-out.length,0),c:total-out.length?"warn":""},{k:"ORIGINAL",v:nf(total,0)}])+outbox("RESULT",out.join("\n"))}},

{id:"sort",ico:"A↓",name:"Sort & Clean Lines",desc:"Sort, reverse or shuffle lines, with optional trimming and numbering.",stack:true,
 fields:[{id:"t",type:"area",label:"Lines",rows:8,ph:"One item per line…",value:"",nosave:true},
  {id:"m",type:"sel",label:"Order",value:"az",options:[["az","A → Z"],["za","Z → A"],["lenA","Shortest first"],["lenD","Longest first"],["numA","Numeric ascending"],["numD","Numeric descending"],["rev","Reverse order"],["shuf","Shuffle"]]},
  {id:"tr",type:"choice",label:"Trim spaces",value:"y",options:[["y","Yes"],["n","No"]]},{id:"em",type:"choice",label:"Drop empty lines",value:"y",options:[["y","Yes"],["n","No"]]},{id:"nu",type:"choice",label:"Number lines",value:"n",options:[["n","No"],["y","Yes"]]}],
 out(v){if(!v.t.trim())return empty("Paste some lines above.");let a=lines(v.t);if(v.tr==="y")a=a.map(x=>x.trim());if(v.em==="y")a=a.filter(Boolean);
  const num=x=>{const m=parseFloat(x.replace(/,/g,""));return isNaN(m)?Infinity:m},cmp=(x,y)=>x.localeCompare(y,undefined,{numeric:true,sensitivity:"base"});
  switch(v.m){case"az":a.sort(cmp);break;case"za":a.sort((x,y)=>cmp(y,x));break;case"lenA":a.sort((x,y)=>x.length-y.length||cmp(x,y));break;case"lenD":a.sort((x,y)=>y.length-x.length||cmp(x,y));break;
   case"numA":a.sort((x,y)=>num(x)-num(y));break;case"numD":a.sort((x,y)=>(num(y)===Infinity?-1:num(y))-(num(x)===Infinity?-1:num(x)));break;case"rev":a.reverse();break;
   case"shuf":for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}}
  if(v.nu==="y")a=a.map((x,i)=>`${i+1}. ${x}`);
  return tiles([{k:"LINES",v:nf(a.length,0),c:"hero"}])+outbox("RESULT",a.join("\n"))}}
]});
