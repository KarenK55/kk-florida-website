let items=[];
const menuButton=document.querySelector('.menu-button');
const navigation=document.querySelector('.main-nav');
if(menuButton&&navigation){menuButton.addEventListener('click',()=>navigation.classList.toggle('open'));navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navigation.classList.remove('open')))}
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const imageFor=item=>item.thumbnail||item.image;
const isTshirt=item=>String(item.store).toLowerCase()==='teepublic'||String(item.category).toLowerCase().replace(/\s+/g,'').includes('tshirt');
const photoItems=()=>items.filter(item=>!isTshirt(item));
const tshirtItems=()=>items.filter(isTshirt);

function groupedPhotos(){
 const groups=new Map();
 photoItems().forEach(item=>{if(!groups.has(item.category))groups.set(item.category,[]);groups.get(item.category).push(item)});
 return [...groups.entries()];
}
function renderCategories(){
 const host=document.getElementById('categoryGrid');
 host.innerHTML=groupedPhotos().map(([category,list])=>{
   const cover=list[0];
   return `<button class="category-card" data-category="${escapeHtml(category)}"><img src="${escapeHtml(imageFor(cover))}" alt="${escapeHtml(cover.alt||category)}" loading="lazy"><span class="category-overlay"></span><span class="category-copy"><small>${list.length} ${list.length===1?'photo':'photos'}</small><strong>${escapeHtml(category)}</strong><em>View collection →</em></span></button>`;
 }).join('');
 host.querySelectorAll('.category-card').forEach(button=>button.addEventListener('click',()=>openGallery(button.dataset.category,photoItems().filter(i=>i.category===button.dataset.category))));
}
function renderTshirts(){
 const list=tshirtItems();
 const host=document.getElementById('tshirtGrid');
 host.innerHTML=list.map(item=>`<button class="art-card" data-index="${items.indexOf(item)}"><img src="${escapeHtml(imageFor(item))}" alt="${escapeHtml(item.alt||'KK Florida TeePublic design')}" loading="lazy"><span>View on TeePublic</span></button>`).join('');
 host.querySelectorAll('.art-card').forEach(card=>card.addEventListener('click',()=>openImage(items[Number(card.dataset.index)])));
}

const galleryModal=document.getElementById('galleryModal');
const galleryGrid=document.getElementById('galleryGrid');
const gallerySearch=document.getElementById('gallerySearch');
let currentGallery=[];
function openGallery(category,list){
 currentGallery=list;
 document.getElementById('galleryEyebrow').textContent='Photography collection';
 document.getElementById('galleryTitle').textContent=category;
 gallerySearch.value='';
 renderGalleryItems();
 galleryModal.classList.add('open');galleryModal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');
}
function renderGalleryItems(){
 const q=gallerySearch.value.trim().toLowerCase();
 const filtered=currentGallery.filter(item=>`${item.title||''} ${item.description||''} ${(item.keywords||[]).join(' ')}`.toLowerCase().includes(q));
 galleryGrid.innerHTML=filtered.map(item=>`<button class="gallery-item" data-index="${items.indexOf(item)}"><img src="${escapeHtml(imageFor(item))}" alt="${escapeHtml(item.alt||item.category||'KK Florida photograph')}" loading="lazy"><span class="view-label">View photo</span></button>`).join('');
 galleryGrid.querySelectorAll('.gallery-item').forEach(card=>card.addEventListener('click',()=>openImage(items[Number(card.dataset.index)])));
}
function closeGallery(){galleryModal.classList.remove('open');galleryModal.setAttribute('aria-hidden','true');if(!document.getElementById('imageModal').classList.contains('open'))document.body.classList.remove('no-scroll')}

gallerySearch.addEventListener('input',renderGalleryItems);
document.getElementById('modalClose').addEventListener('click',closeGallery);
galleryModal.addEventListener('click',e=>{if(e.target===galleryModal)closeGallery()});

const imageModal=document.getElementById('imageModal');
function openImage(item){
 const img=document.getElementById('modalImage');img.src=item.image;img.alt=item.alt||item.category||'KK Florida image';
 document.getElementById('modalCategory').textContent=`${item.category} • ${item.store}`;
 const link=document.getElementById('modalLink');link.href=item.link||item.purchaseUrl||'#';link.textContent=isTshirt(item)?'View this design on TeePublic':'Buy this photo on Picfair';
 imageModal.classList.add('open');imageModal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');
}
function closeImage(){imageModal.classList.remove('open');imageModal.setAttribute('aria-hidden','true');if(!galleryModal.classList.contains('open'))document.body.classList.remove('no-scroll')}
document.getElementById('imageModalClose').addEventListener('click',closeImage);
imageModal.addEventListener('click',e=>{if(e.target===imageModal)closeImage()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(imageModal.classList.contains('open'))closeImage();else if(galleryModal.classList.contains('open'))closeGallery()}});

fetch('data/gallery.json').then(r=>r.json()).then(data=>{items=Array.isArray(data)?data:(data.items||[]);renderCategories();renderTshirts()}).catch(err=>{document.getElementById('categoryGrid').innerHTML='<p>The gallery could not be loaded.</p>';console.error(err)});
fetch('data/hero.json').then(r=>r.json()).then(slides=>{const host=document.getElementById('heroSlides');host.innerHTML=slides.map((s,i)=>`<div class="hero-slide ${i===0?'active':''}" style="background-image:url('${s.image}')" role="img" aria-label="${escapeHtml(s.alt)}"></div>`).join('');const els=[...host.children];if(els.length>1){let index=0;setInterval(()=>{els[index].classList.remove('active');index=(index+1)%els.length;els[index].classList.add('active')},6000)}});
