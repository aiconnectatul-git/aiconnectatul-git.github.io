const catalog=document.getElementById("catalog"),search=document.getElementById("search"),empty=document.getElementById("empty");
const allTools=()=>window.TOOL_CATALOG.flatMap(c=>c.subcategories.flatMap(s=>s.tools.map(t=>({...t,category:c.name,subcategory:s.name,categoryId:c.id}))));
function render(){const q=search.value.trim().toLowerCase();let shown=0,html="";
  const hit=(t,sub,cat)=>!q||[t.name,t.description,sub.name,cat.name,...(t.tags||[])].join(" ").toLowerCase().includes(q);
  window.TOOL_CATALOG.forEach(cat=>{
    const matches=cat.subcategories.reduce((n,sub)=>n+sub.tools.filter(t=>hit(t,sub,cat)).length,0);if(!matches)return;shown+=matches;
    // a matching category shows ALL of its tools; the ones that matched are highlighted
    const total=cat.subcategories.reduce((n,sub)=>n+sub.tools.length,0);
    const subs=cat.subcategories.map(sub=>`<div class="subcategory"><div class="subcategory-title">${sub.name.toUpperCase()}</div><div class="tool-list">${sub.tools.map(t=>`<a class="tool-link ${q&&hit(t,sub,cat)?"hit":q?"dim":""}" href="${t.path}"><span>${t.name}</span><span class="arrow">↗</span></a>`).join("")}</div></div>`).join("");
    html+=`<article class="category-card"><div class="category-top"><div class="category-icon">${cat.icon}</div><div><h3>${cat.name}</h3><p>${cat.description}</p></div><span class="tool-count">${q?`${matches} OF ${total} MATCH`:`${total} TOOLS`}</span></div>${subs}</article>`});
  catalog.innerHTML=html;empty.classList.toggle("hidden",shown!==0)}
search.addEventListener("input",render);
document.getElementById("quick-row").innerHTML=window.TOOL_CATALOG.map(c=>`<button class="quick-chip" data-category="${c.id}">${c.icon} &nbsp;${c.name}</button>`).join("");
document.querySelectorAll(".quick-chip").forEach(b=>b.addEventListener("click",()=>{search.value=b.textContent.trim().replace(/^[^A-Za-z0-9]+/,"");render();document.getElementById("categories").scrollIntoView({behavior:"smooth"})}));
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search.focus()}if(e.key==="Escape"){search.value="";render();search.blur()}});
render();
document.getElementById("app-grid").innerHTML=window.MY_APPS.map(a=>`<a class="app-card" href="${a.url}" ${a.local?"":'target="_blank" rel="noreferrer"'}><div class="app-shot"><img style="object-position:${a.pos}" src="assets/apps/${a.id}-shot.${a.ext}" alt="${a.name} screenshot" loading="lazy"></div><div class="app-info"><img class="app-logo" src="assets/apps/${a.id}-logo.png" alt="${a.name} logo"><h3>${a.name}</h3><span class="arrow">↗</span></div></a>`).join("");
