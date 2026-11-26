/* Shared engine for UtilityBox "suite" pages (Finance, Date & Time, Health, Converters, Writing).
   A tool is {id, ico, name, desc, fields:[...], out(v) -> html, after?(v, ctx)}  */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let tt;const toast=t=>{const e=$("toast");e.textContent=t;e.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>e.classList.remove("on"),1500)};
const copyText=async t=>{try{await navigator.clipboard.writeText(t);toast("Copied to clipboard")}catch(e){toast("Copy not allowed here")}};

/* ---------- formatting ---------- */
const nf=(n,d=2)=>isFinite(n)?(+n).toLocaleString("en-IN",{maximumFractionDigits:d}):"—";
const inr=n=>isFinite(n)?Math.round(n).toLocaleString("en-IN"):"—";
const rs=n=>(n<0?"-":"")+"₹"+inr(Math.abs(n));
const rs2=n=>(n<0?"-":"")+"₹"+Math.abs(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const compact=n=>{const a=Math.abs(n),s=n<0?"-":"";return a>=1e7?s+"₹"+(a/1e7).toFixed(2)+" Cr":a>=1e5?s+"₹"+(a/1e5).toFixed(2)+" L":s+"₹"+inr(a)};
const pct=(n,d=2)=>isFinite(n)?(+n).toFixed(d).replace(/\.?0+$/,"")+"%":"—";
const ymd=d=>d.toISOString().slice(0,10);
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const pd=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||"");return m?new Date(Date.UTC(+m[1],+m[2]-1,+m[3])):null}; // date-only, UTC-safe
const fdate=d=>d?d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}):"—";

/* ---------- result building blocks ---------- */
const tiles=a=>`<div class="tiles">${a.map(t=>`<div class="tile ${t.c||""}"><div class="k">${t.k}</div><div class="v">${t.v}</div>${t.s?`<div class="s">${t.s}</div>`:""}</div>`).join("")}</div>`;
const card=(label,body,tools="")=>`<section class="card"><div class="chead"><span class="label">${label}</span>${tools}</div>${body}</section>`;
function donut(parts,centre){const tot=parts.reduce((a,p)=>a+Math.max(0,p.value),0)||1,R=62,C=2*Math.PI*R;let off=0;
  const arcs=parts.map(p=>{const len=Math.max(0,p.value)/tot*C;const s=`<circle r="${R}" cx="85" cy="85" fill="none" stroke="${p.color}" stroke-width="22" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 85 85)"/>`;off+=len;return s}).join("");
  return `<div class="donutwrap"><svg viewBox="0 0 170 170"><circle r="${R}" cx="85" cy="85" fill="none" stroke="#1c2b42" stroke-width="22"/>${arcs}${centre?`<text x="85" y="82" text-anchor="middle" style="fill:#8a9bb3;font:700 8.5px 'DM Sans';letter-spacing:1px">${centre[0]}</text><text x="85" y="100" text-anchor="middle" style="fill:#fff;font:700 15px 'Space Grotesk'">${centre[1]}</text>`:""}</svg>
  <div class="legend">${parts.map(p=>`<div><i style="background:${p.color}"></i>${p.label}<b>${p.text||""}</b></div>`).join("")}</div></div>`}
function line(xs,series,fmt=compact,xlab="Year"){const W=600,H=230,L=58,Rr=14,T=14,B=30;const all=series.flatMap(s=>s.ys),mx=Math.max(...all,1);
  const X=i=>L+(xs.length<2?0:i/(xs.length-1))*(W-L-Rr),Y=v=>T+(1-v/mx)*(H-T-B);
  let g="";for(let k=0;k<=4;k++){const v=mx*k/4,y=Y(v);g+=`<line x1="${L}" x2="${W-Rr}" y1="${y}" y2="${y}" stroke="#ffffff10"/><text x="${L-8}" y="${y+3}" text-anchor="end">${fmt(v)}</text>`}
  const step=Math.max(1,Math.ceil(xs.length/8));xs.forEach((x,i)=>{if(i%step===0||i===xs.length-1)g+=`<text x="${X(i)}" y="${H-10}" text-anchor="middle">${x}</text>`});
  const paths=series.map(s=>{const pts=s.ys.map((v,i)=>`${X(i)},${Y(v)}`);const a=s.area?`<path d="M${X(0)},${Y(0)} L${pts.join(" L")} L${X(s.ys.length-1)},${Y(0)}Z" fill="${s.color}" opacity=".13"/>`:"";
    return a+`<polyline points="${pts.join(" ")}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`+s.ys.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="9" fill="transparent"><title>${xlab} ${xs[i]} · ${s.name}: ${fmt(v)}</title></circle>`).join("")}).join("");
  const leg=series.map(s=>`<span style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;font-size:12px;color:#c4d0e0"><i style="width:10px;height:10px;border-radius:3px;background:${s.color}"></i>${s.name}</span>`).join("");
  return `<div class="chart"><div style="padding:0 6px 6px">${leg}</div><svg viewBox="0 0 ${W} ${H}">${g}${paths}</svg></div>`}
const table=(head,rows,winCol)=>`<div class="tblwrap"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${winCol&&winCol[i]?"win":""}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const rowsHTML=l=>`<div class="rows">${l.map(([k,v])=>`<div class="row" data-v="${esc(v)}"><span class="k">${k}</span><span class="v">${esc(v)}</span><span class="c">COPY</span></div>`).join("")}</div>`;
const outbox=(label,text)=>`<section class="card"><div class="chead"><span class="label">${label}</span><button class="chip js-copy">Copy</button></div><pre class="outtext">${esc(text)}</pre></section>`;
const note=h=>`<div class="note">${h}</div>`;
const empty=t=>`<div class="empty">${t}</div>`;

/* ---------- form engine ---------- */
function fieldHTML(f,val){
  if(f.group)return `<div class="fgroup">${f.group}</div>`;
  const id="f_"+f.id;let c="";
  if(f.type==="num")c=`<div class="inp">${f.pre?`<span class="pre">${f.pre}</span>`:""}<input class="field" type="number" inputmode="decimal" id="${id}" value="${val}" step="${f.step||"any"}">${f.suf?`<span class="suf">${f.suf}</span>`:""}</div>${f.slider?`<input type="range" class="range" id="${id}_r" min="${f.slider[0]}" max="${f.slider[1]}" step="${f.slider[2]||1}" value="${val}">`:""}`;
  else if(f.type==="sel")c=`<select class="field" id="${id}">${f.options.map(o=>`<option value="${o[0]}" ${String(o[0])===String(val)?"selected":""}>${o[1]}</option>`).join("")}</select>`;
  else if(f.type==="choice")c=`<div class="choice" id="${id}" data-v="${val}">${f.options.map(o=>`<button type="button" data-v="${o[0]}" class="${String(o[0])===String(val)?"on":""}">${o[1]}</button>`).join("")}</div>`;
  else if(f.type==="area")c=`<textarea class="field" id="${id}" rows="${f.rows||8}" spellcheck="false" placeholder="${esc(f.ph||"")}">${esc(val)}</textarea>`;
  else c=`<input class="field" type="${f.type||"text"}" id="${id}" value="${esc(val)}" placeholder="${esc(f.ph||"")}" autocomplete="off">`;
  return `<div class="fld" data-f="${f.id}"><label for="${id}">${f.label}${f.hint?`<small>${f.hint}</small>`:""}</label>${c}</div>`}

function Suite(cfg){
  const T=cfg.tools;let leave=[];
  const ctx={onLeave:fn=>leave.push(fn)};
  document.body.innerHTML=`<div class="wrap"><a class="back" href="../../index.html">← Back to tools</a><div class="app"><aside class="side"><div class="brand"><div class="mark">${cfg.ico}</div><div><small>${cfg.kicker}</small><b>${cfg.name}</b></div></div><nav class="nav" id="nav"></nav></aside><main class="main" id="main"></main></div></div><div class="toast" id="toast"></div>`;
  const key=t=>`suite:${cfg.slug}:${t.id}`;
  function mount(){
    const id=(location.hash||"#"+T[0].id).slice(1);const t=T.find(x=>x.id===id)||T[0];
    leave.forEach(f=>{try{f()}catch(e){}});leave=[];
    $("nav").innerHTML=T.map(x=>`<a href="#${x.id}" class="${x===t?"on":""}"><i>${esc(x.ico)}</i>${x.name}</a>`).join("");
    document.title=`${t.name} — ${cfg.name}`;localStorage.setItem(`suite:${cfg.slug}:last`,t.id);
    const head=`<div class="thead"><div class="kicker">${cfg.name.toUpperCase()}</div><h1>${t.name}</h1><p class="desc">${t.desc}</p></div>`;
    if(t.render){$("main").innerHTML=head;t.render($("main"),ctx);return}
    let saved={};try{saved=JSON.parse(localStorage.getItem(key(t))||"{}")}catch(e){}
    const F=t.fields.filter(f=>!f.group);
    const dv=f=>{const d=(saved[f.id]!==undefined&&!f.nosave)?saved[f.id]:(typeof f.value==="function"?f.value():f.value);return d===undefined?"":d};
    $("main").innerHTML=head+`<div class="calc ${t.stack?"stack":""}"><section class="card form" id="form">${t.fields.map(f=>fieldHTML(f,f.group?"":dv(f))).join("")}</section><div class="res" id="res"></div></div>`;
    const read=()=>{const v={};F.forEach(f=>{const e=$("f_"+f.id);v[f.id]=f.type==="num"?(parseFloat(e.value)||0):f.type==="choice"?e.dataset.v:e.value});return v};
    let afterCleanup;
    const update=()=>{const v=read();
      F.forEach(f=>{if(f.show){const el=document.querySelector(`[data-f="${f.id}"]`);if(el)el.style.display=f.show(v)?"":"none"}});
      if(typeof afterCleanup==="function"){afterCleanup();afterCleanup=null}
      try{$("res").innerHTML=t.out(v)}catch(e){$("res").innerHTML=empty("Check your inputs.");console.error(e)}
      if(t.after){const r=t.after(v,ctx);if(typeof r==="function")afterCleanup=r}
      const sv={};F.forEach(f=>{if(!f.nosave)sv[f.id]=v[f.id]});try{localStorage.setItem(key(t),JSON.stringify(sv))}catch(e){}};
    leave.push(()=>{if(typeof afterCleanup==="function")afterCleanup()});
    const form=$("form");
    form.addEventListener("input",e=>{const id=e.target.id||"";
      if(id.endsWith("_r")){$(id.slice(0,-2)).value=e.target.value}
      else if($(id+"_r")){$(id+"_r").value=e.target.value}
      update()});
    form.addEventListener("change",e=>{if(e.target.tagName==="SELECT"||e.target.type==="date")update()});
    form.addEventListener("click",e=>{const b=e.target.closest(".choice button");if(!b)return;const c=b.parentNode;c.dataset.v=b.dataset.v;c.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));update()});
    update();
  }
  document.addEventListener("click",e=>{
    const r=e.target.closest(".row[data-v]");if(r){copyText(r.dataset.v);return}
    const c=e.target.closest(".js-copy");if(c){const p=c.closest(".card").querySelector(".outtext");if(p)copyText(p.textContent)}});
  addEventListener("hashchange",()=>{mount();scrollTo({top:0})});
  if(!location.hash){const l=localStorage.getItem(`suite:${cfg.slug}:last`);if(l&&T.some(x=>x.id===l))history.replaceState(null,"","#"+l)}
  mount();
}
window.U={$,esc,toast,copyText,nf,inr,rs,rs2,compact,pct,ymd,today,pd,fdate,tiles,card,donut,line,table,rowsHTML,outbox,note,empty,Suite};
})();
