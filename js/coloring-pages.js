const $=selector=>document.querySelector(selector);
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]))}
const menuButton=$(".menu-button");
const navigation=$(".main-nav");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const open=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}))}
fetch("data/coloring-pages.json")
  .then(response=>response.json())
  .then(data=>{
    const items=Array.isArray(data)?data:(data.items||[]);
    const grid=$("#coloringGrid");
    $("#coloringCount").textContent=items.length?`${items.length} free ${items.length===1?"page":"pages"} available`:"Free pages are coming soon";
    if(!items.length){
      grid.innerHTML='<div class="coloring-empty"><span>✿</span><h2>New coloring pages are being prepared.</h2><p>Please check back soon for free kaleidoscope flower line art from KK Florida.</p></div>';
      return;
    }
    const all=$("#downloadAll");
    all.hidden=false;
    grid.innerHTML=items.map(item=>`<article class="coloring-card"><div class="coloring-preview"><img src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.alt||item.title)}" loading="lazy"></div><div class="coloring-card-copy"><p class="eyebrow">Free download</p><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description||"A printable kaleidoscope flower coloring page created from original KK Florida artwork.")}</p><div class="coloring-actions"><a class="button primary" href="${escapeHtml(item.pdf)}" download>Download PDF</a><a class="button outline-button" href="${escapeHtml(item.png)}" download>Download PNG</a></div></div></article>`).join("");
  })
  .catch(error=>{console.error(error);$("#coloringGrid").innerHTML='<p class="empty-state">The coloring page library could not be loaded.</p>'});
