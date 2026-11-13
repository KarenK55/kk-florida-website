let items=[];
const $=selector=>document.querySelector(selector);
const menuButton=$(".menu-button");
const navigation=$(".main-nav");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const open=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}))}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]))}
function imageFor(item){return item.thumbnail||item.image}
function imageAlt(item){return String(item.alt||"").trim()||String(item.title||"").trim()||displayCategory(item.category)}
const categoryDescriptions={
  "Birds":"Florida bird photography: cardinals, egrets and herons.",
  "Butterflies":"Florida butterflies, including swallowtails and zebra longwings.",
  "Flowers":"Tropical flowers, wildflowers and botanical photography.",
  "Kaleidoscope Flowers":"Original flower photography turned into colorful kaleidoscope artwork.",
  "Sunsets":"Florida sunset photography and colorful evening skies.",
  "Insects":"Bees, pollinators and close-up insect photography.",
  "Landscapes":"Florida scenery, tropical skies and nature photography.",
  "Mammals":"Florida mammals and squirrel photography.",
  "Orchids":"Orchid flower photography and botanical beauty.",
  "Tshirts":"Original animal, floral and other T-shirt designs, stickers and gifts."
};
function displayCategory(name){return name==="Tshirts"?"T-Shirts & Art":name}
function categoryOrder(categories){const preferred=["Birds","Butterflies","Flowers","Kaleidoscope Flowers","Sunsets","Insects","Landscapes","Mammals","Orchids","Tshirts"];return [...categories].sort((a,b)=>{const ai=preferred.indexOf(a),bi=preferred.indexOf(b);return (ai<0?99:ai)-(bi<0?99:bi)||a.localeCompare(b)})}
function groupedItems(){return items.reduce((map,item)=>{(map[item.category]??=[]).push(item);return map},{})}
function renderCategories(){
  const groups=groupedItems();
  const categories=categoryOrder(Object.keys(groups));
  const grid=$("#categoryGrid");
  grid.innerHTML=categories.map(category=>{
    const group=groups[category];
    const cover=group.find(i=>i.thumbnail)||group[0];
    const path=categoryUrls[category];
    if(!path)return "";
    const countText=category==="Tshirts"?"Browse designs":`${group.length} ${group.length===1?"image":"images"}`;
    return `<a class="category-card" href="${escapeHtml(path)}/" aria-label="View ${escapeHtml(displayCategory(category))} collection"><img src="${escapeHtml(imageFor(cover))}" alt="${escapeHtml(imageAlt(cover))}" loading="lazy"><span class="category-shade"></span><span class="category-copy"><h3>${escapeHtml(displayCategory(category))}</h3><p class="category-count">${countText}</p>${categoryDescriptions[category]?`<p class="category-description">${escapeHtml(categoryDescriptions[category])}</p>`:""}</span><span class="category-arrow" aria-hidden="true">→</span></a>`;
  }).join("");
}
function renderFeatured(){const groups=groupedItems();const categories=categoryOrder(Object.keys(groups));const picks=categories.slice(0,8).map((category,index)=>{const group=groups[category];return group[index%group.length]});const grid=$("#featuredGrid");grid.innerHTML=picks.map(item=>`<article class="featured-card" data-index="${items.indexOf(item)}"><img src="${escapeHtml(imageFor(item))}" alt="${escapeHtml(imageAlt(item))}" loading="lazy"><span class="featured-badge">${escapeHtml(displayCategory(item.category))}</span></article>`).join("");grid.querySelectorAll(".featured-card").forEach(card=>card.addEventListener("click",()=>openModal(items[Number(card.dataset.index)])))}
const categoryUrls={"Birds":"birds","Butterflies":"butterflies","Flowers":"flowers","Kaleidoscope Flowers":"kaleidoscope-flowers","Sunsets":"sunsets","Insects":"insects","Landscapes":"landscapes","Mammals":"mammals","Orchids":"orchids","Tshirts":"tshirts"};
const modal=$("#imageModal");
function cleanTitle(item){const title=String(item.title||"").trim();if(!title||/^(bee|bird|card|img|image|photo|sunset|flower|butterfly)[\s_\-]*(\(?\d+\)?)?$/i.test(title))return "";return title}
function openModal(item){$("#modalImage").src=item.image;$("#modalImage").alt=imageAlt(item);$("#modalCategory").textContent=`${displayCategory(item.category)} • ${item.store||"KK Florida"}`;const title=cleanTitle(item);$("#modalTitle").textContent=title;$("#modalTitle").classList.toggle("visually-hidden-title",!title);const description=item.description||`Original ${displayCategory(item.category).toLowerCase()} photography and artwork from KK Florida.`;$("#modalDescription").textContent=description;const link=$("#modalLink");link.href=item.link||item.purchaseUrl||"#";link.textContent=item.store==="TeePublic"?"View this design on TeePublic":"Shop this photo on Picfair";modal.classList.add("open");modal.setAttribute("aria-hidden","false")}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
$("#modalClose").addEventListener("click",closeModal);modal.addEventListener("click",event=>{if(event.target===modal)closeModal()});document.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal.classList.contains("open"))closeModal()});
fetch("data/gallery.json").then(response=>response.json()).then(data=>{items=Array.isArray(data)?data:(data.items||[]);renderCategories();renderFeatured()}).catch(error=>{$("#categoryGrid").innerHTML="<p>The gallery could not be loaded.</p>";console.error(error)});
fetch("data/hero.json").then(r=>r.json()).then(slides=>{const host=$("#heroSlides");host.innerHTML=slides.map((s,i)=>`<div class="hero-slide ${i===0?"active":""}" style="background-image:url('${s.image}')" role="img" aria-label="${escapeHtml(s.alt)}"></div>`).join("");const els=[...host.children];if(els.length>1){let index=0;setInterval(()=>{els[index].classList.remove("active");index=(index+1)%els.length;els[index].classList.add("active")},6500)}});

