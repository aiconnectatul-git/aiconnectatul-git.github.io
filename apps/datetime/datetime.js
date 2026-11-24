const {today,pd,fdate,tiles,card,table,empty,note,esc,nf,toast}=U;
const DAY=864e5,dim=(y,m)=>new Date(Date.UTC(y,m+1,0)).getUTCDate();
const plural=(n,w)=>n+" "+w+(n===1?"":"s");
/* calendar difference a -> b (a <= b) as y/m/d */
function ymdDiff(a,b){let y=b.getUTCFullYear()-a.getUTCFullYear(),m=b.getUTCMonth()-a.getUTCMonth(),d=b.getUTCDate()-a.getUTCDate();
  if(d<0){m--;d+=dim(b.getUTCFullYear(),b.getUTCMonth()-1)}if(m<0){y--;m+=12}return {y,m,d}}
const ymdText=({y,m,d})=>[y&&plural(y,"year"),m&&plural(m,"month"),d&&plural(d,"day")].filter(Boolean).join(", ")||"0 days";
function addMonths(d,n){const t=d.getUTCFullYear()*12+d.getUTCMonth()+n,y=Math.floor(t/12),m=t-y*12;return new Date(Date.UTC(y,m,Math.min(d.getUTCDate(),dim(y,m))))}
const dayDiff=(a,b)=>Math.round((b-a)/DAY);

U.Suite({slug:"datetime",name:"Date & Time",kicker:"CALENDAR",ico:"📅",tools:[

{id:"age",ico:"AGE",name:"Age Calculator",desc:"Exact age in years, months and days — plus your next birthday.",
 fields:[{id:"dob",type:"date",label:"Date of birth",value:"1995-06-15"},{id:"on",type:"date",label:"Age on",value:today,nosave:true}],
 out(v){const a=pd(v.dob),b=pd(v.on);if(!a||!b)return empty("Pick both dates.");if(b<a)return empty("The “age on” date is before the date of birth.");
  const d=ymdDiff(a,b),days=dayDiff(a,b);let nb=new Date(Date.UTC(b.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate()));if(nb<b)nb=new Date(Date.UTC(b.getUTCFullYear()+1,a.getUTCMonth(),a.getUTCDate()));
  const left=dayDiff(b,nb);
  return tiles([{k:"AGE",v:d.y+" years",c:"hero",s:`${plural(d.m,"month")}, ${plural(d.d,"day")}`},{k:"NEXT BIRTHDAY",v:left===0?"Today! 🎂":plural(left,"day"),s:fdate(nb)},{k:"BORN ON",v:a.toLocaleDateString("en-GB",{weekday:"long",timeZone:"UTC"}),s:fdate(a)}])
   +U.card("YOUR LIFE IN NUMBERS",U.rowsHTML([["MONTHS",nf(d.y*12+d.m,0)],["WEEKS",nf(Math.floor(days/7),0)],["DAYS",nf(days,0)],["HOURS",nf(days*24,0)],["MINUTES",nf(days*1440,0)]]))}},

{id:"between",ico:"Δd",name:"Days Between Dates",desc:"How many days, weeks and months lie between two dates.",
 fields:[{id:"a",type:"date",label:"From",value:today,nosave:true},{id:"b",type:"date",label:"To",value:()=>{const d=new Date();d.setDate(d.getDate()+100);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")},nosave:true},
  {id:"inc",type:"choice",label:"End date",value:"no",options:[["no","Exclude"],["yes","Include"]]}],
 out(v){let a=pd(v.a),b=pd(v.b);if(!a||!b)return empty("Pick both dates.");let rev=false;if(b<a){[a,b]=[b,a];rev=true}
  const days=dayDiff(a,b)+(v.inc==="yes"?1:0),w=Math.floor(days/7);
  return tiles([{k:"TOTAL DAYS",v:nf(days,0),c:"hero",s:rev?"“To” is before “From”":""},{k:"WEEKS + DAYS",v:`${w}w ${days%7}d`},{k:"CALENDAR",v:ymdText(ymdDiff(a,b)),s:"years, months, days"}])
   +U.card("DETAIL",U.rowsHTML([["HOURS",nf(days*24,0)],["MINUTES",nf(days*1440,0)],["FROM",fdate(a)],["TO",fdate(b)]]))}},

{id:"add",ico:"±d",name:"Add / Subtract Days",desc:"Find the date that is N days, months or years from a starting date.",
 fields:[{id:"d",type:"date",label:"Start date",value:today,nosave:true},{id:"op",type:"choice",label:"Operation",value:"add",options:[["add","Add"],["sub","Subtract"]]},
  {id:"y",type:"num",label:"Years",value:0,step:1},{id:"m",type:"num",label:"Months",value:0,step:1},{id:"n",type:"num",label:"Days",value:90,step:1}],
 out(v){const s=pd(v.d);if(!s)return empty("Pick a start date.");const k=v.op==="sub"?-1:1;let r=addMonths(s,k*(Math.round(v.y)*12+Math.round(v.m)));r=new Date(r.getTime()+k*Math.round(v.n)*DAY);
  const iso=r.toISOString().slice(0,10);
  return tiles([{k:"RESULT",v:r.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}),c:"hero",s:r.toLocaleDateString("en-GB",{weekday:"long",timeZone:"UTC"})},{k:"ISO DATE",v:iso},{k:"DAYS FROM START",v:nf(Math.abs(dayDiff(s,r)),0)}])}},

{id:"work",ico:"WD",name:"Working Days Counter",desc:"Count business days between two dates, skipping weekends and your holidays.",
 fields:[{id:"a",type:"date",label:"From",value:today,nosave:true},{id:"b",type:"date",label:"To",value:()=>{const d=new Date();d.setDate(d.getDate()+30);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")},nosave:true},
  {id:"we",type:"sel",label:"Weekend",value:"67",options:[["67","Saturday & Sunday"],["7","Sunday only"],["56","Friday & Saturday"]]},
  {id:"h",type:"area",label:"Holidays",hint:"optional, one per line",rows:4,ph:"2026-01-26\n2026-08-15",value:""}],
 out(v){let a=pd(v.a),b=pd(v.b);if(!a||!b)return empty("Pick both dates.");if(b<a)[a,b]=[b,a];if(dayDiff(a,b)>36600)return empty("Please keep the range under 100 years.");
  const wk=new Set(v.we.split("").map(x=>+x%7)),hol=new Set((v.h.match(/\d{4}-\d{2}-\d{2}/g)||[]));let work=0,we=0,ho=0,total=0;
  for(let t=a.getTime();t<=b.getTime();t+=DAY){const d=new Date(t);total++;if(wk.has(d.getUTCDay()))we++;else if(hol.has(d.toISOString().slice(0,10)))ho++;else work++}
  return tiles([{k:"WORKING DAYS",v:nf(work,0),c:"hero",s:"both dates included"},{k:"WEEKEND DAYS",v:nf(we,0)},{k:"HOLIDAYS SKIPPED",v:nf(ho,0)},{k:"CALENDAR DAYS",v:nf(total,0)}])}},

{id:"countdown",ico:"⏳",name:"Countdown",desc:"Live countdowns to the dates that matter. Saved in this browser.",
 render(main,ctx){
  const K="suite:datetime:events";let ev=[];try{ev=JSON.parse(localStorage.getItem(K)||"[]")}catch(e){}
  const save=()=>localStorage.setItem(K,JSON.stringify(ev));
  main.insertAdjacentHTML("beforeend",`<section class="card"><div class="chead"><span class="label">NEW EVENT</span></div><div style="display:flex;gap:10px;padding:14px 18px 18px;flex-wrap:wrap"><input class="field" id="en" placeholder="Event name" style="flex:2;min-width:160px"><input class="field" id="et" type="datetime-local" style="flex:1;min-width:190px;font-family:'DM Sans'"><button class="chip" id="ea" style="padding:10px 18px;font-size:13px">Add</button></div></section><section class="card" id="evl" style="margin-top:18px"></section>`);
  const fmt=ms=>{const a=Math.abs(ms),d=Math.floor(a/DAY),h=Math.floor(a%DAY/36e5),m=Math.floor(a%36e5/6e4),s=Math.floor(a%6e4/1e3);return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`};
  const draw=()=>{const l=document.getElementById("evl");if(!l)return;l.innerHTML=ev.length?ev.slice().sort((x,y)=>x.t-y.t).map(e=>{const ms=e.t-Date.now();return `<div class="evrow"><div class="n">${esc(e.n)}<small>${new Date(e.t).toLocaleString("en-GB",{dateStyle:"full",timeStyle:"short"})}</small></div><div class="t" style="${ms<0?"color:var(--muted)":""}">${ms<0?"Passed ":""}${fmt(ms)}${ms<0?" ago":""}</div><button class="chip" data-del="${e.id}">✕</button></div>`}).join(""):empty("No events yet. Add one above.")};
  document.getElementById("ea").onclick=()=>{const n=document.getElementById("en").value.trim(),t=new Date(document.getElementById("et").value).getTime();if(!n||isNaN(t)){toast("Add a name and a date");return}ev.push({id:Date.now(),n,t});save();document.getElementById("en").value="";draw()};
  document.getElementById("evl").onclick=e=>{const b=e.target.closest("[data-del]");if(b){ev=ev.filter(x=>x.id!=b.dataset.del);save();draw()}};
  draw();const iv=setInterval(draw,1000);ctx.onLeave(()=>clearInterval(iv))}}
]});
