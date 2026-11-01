// Generate all searchable KK Florida category pages from data/gallery.json.
// Run: node tools/generate-category-pages.js
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const cats=[
  {
    "key": "Birds",
    "slug": "birds",
    "label": "Florida Birds",
    "title": "Florida Bird Photography",
    "description": "Browse original bird photographs from South Florida including egrets, herons, ibis and spoonbills, captured by KK Florida.",
    "intro": "Discover the birds of South Florida through original photographs of wildlife around our wetlands, parks and neighborhoods.",
    "shop": "Picfair"
  },
  {
    "key": "Butterflies",
    "slug": "butterflies",
    "label": "Butterflies",
    "title": "Florida Butterfly Photography",
    "description": "Explore original butterfly photography by KK Florida, with colorful wings, delicate patterns and nature photographs from South Florida.",
    "intro": "A close look at butterflies reveals remarkable colors and patterns. Browse our original photographs and discover nature-inspired prints.",
    "shop": "Picfair"
  },
  {
    "key": "Flowers",
    "slug": "flowers",
    "label": "Flowers & Plants",
    "title": "Florida Flower & Plant Photography",
    "description": "Explore original Florida flower and plant photographs by KK Florida, featuring colorful blossoms, tropical flowers and garden photography.",
    "intro": "Flowers bring brilliant colors to South Florida. Browse the details of blooms, plants and gardens through KK Florida photography.",
    "shop": "Picfair"
  },
  {
    "key": "Kaleidoscope Flowers",
    "slug": "kaleidoscope-flowers",
    "label": "Kaleidoscope Flowers",
    "title": "Kaleidoscope Flower Artwork",
    "description": "Discover kaleidoscope flower art made from original KK Florida photographs, with colorful symmetrical designs and nature-inspired artwork.",
    "intro": "Original flower photography becomes bright, symmetrical artwork in this one-of-a-kind KK Florida collection. Explore the designs and our free coloring pages.",
    "shop": "TeePublic"
  },
  {
    "key": "Sunsets",
    "slug": "sunsets",
    "label": "Florida Sunsets",
    "title": "Florida Sunset Photography",
    "description": "View original Florida sunset photographs by KK Florida, with colorful skies and natural landscape photographs from South Florida.",
    "intro": "Florida evenings have their own remarkable colors. Explore original sunset photographs and beautiful skies in the KK Florida collection.",
    "shop": "Picfair"
  },
  {
    "key": "Insects",
    "slug": "insects",
    "label": "Insects & Bees",
    "title": "Florida Insect & Bee Photography",
    "description": "Explore close-up photographs of bees and insects by KK Florida, revealing the small details of South Florida nature.",
    "intro": "The smallest creatures have fascinating details. Discover insects and bees in original KK Florida photographs.",
    "shop": "Picfair"
  },
  {
    "key": "Landscapes",
    "slug": "landscapes",
    "label": "Florida Landscapes",
    "title": "Florida Landscape Photography",
    "description": "See Florida nature and landscape photography by KK Florida, featuring South Florida scenery and memorable skies.",
    "intro": "Browse the scenery of South Florida through original landscape photographs from KK Florida.",
    "shop": "Picfair"
  },
  {
    "key": "Mammals",
    "slug": "mammals",
    "label": "Florida Mammals",
    "title": "Florida Mammal Photography",
    "description": "Browse original South Florida wildlife and mammal photographs in the KK Florida photography collection.",
    "intro": "Wildlife is part of everyday life in Florida. Discover mammals and their surroundings through original KK Florida photographs.",
    "shop": "Picfair"
  },
  {
    "key": "Orchids",
    "slug": "orchids",
    "label": "Orchids",
    "title": "Orchid Flower Photography",
    "description": "Explore original orchid photographs by KK Florida, highlighting the colors, shapes and patterns of orchid blossoms.",
    "intro": "Enjoy the intricate shapes and vivid details of orchid flowers through original KK Florida photographs.",
    "shop": "Picfair"
  },
  {
    "key": "Tshirts",
    "slug": "tshirts",
    "label": "T-Shirts & Art",
    "title": "Original T-Shirts and Artwork | KK Florida",
    "description": "Browse original KK Florida T-shirt designs, quirky wildlife artwork, creative graphics and gifts available on TeePublic.",
    "intro": "A little wild, a little wacky, and never boring. Explore our original artwork, colorful designs, apparel and gifts.",
    "shop": "TeePublic"
  }
];
function h(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function imgpath(p){const s=String(p??"");return /^images\/[a-zA-Z0-9_.\/-]+$/.test(s)&&!s.split("/").includes("..")?s:"";}
function href(p){const s=String(p??"");return /^https:\/\/[a-z0-9.-]+(?:\/[^"'<>]*)?$/i.test(s)?s:"";}
function render(c,items){
 const url="https://kkflorida.com/"+c.slug+"/";
 const thumb=imgpath(items[0]?.image)||"images/hero/hero1.jpg";
 const cards=items.map((i,n)=>{
 const pic=imgpath(i.image),small=imgpath(i.thumbnail)||pic;if(!pic)return "";
 const title=String(i.title||"").trim().replace(/([a-z])([A-Z])/g,"$1 $2")||c.label;
 const desc=String(i.description||"").trim();
 const alt=String(i.alt||"").trim()||`${title} — ${c.label} at KK Florida`;
 const shop=href(i.link)||(c.shop==="TeePublic"?"https://www.teepublic.com/user/kk-florida":"https://flwildlife.picfair.com/");
 return `<article class="photo"><a class="photo-img" href="../${h(pic)}" target="_blank" rel="noopener" aria-label="View ${h(title)} larger"><img loading="${n<3?"eager":"lazy"}" decoding="async" src="../${h(small)}" alt="${h(alt)}"></a><div class="photo-body"><h2>${h(title)}</h2>${desc?`<p>${h(desc)}</p>`:""}<a class="photo-store" href="${h(shop)}" target="_blank" rel="noopener noreferrer">Explore on ${h(i.store||c.shop)} ↗</a></div></article>`;
 }).join("\n");
 const others=cats.filter(v=>v.key!==c.key).map(v=>`<a href="../${v.slug}/">${h(v.label)}</a>`).join("\n");
 const shop=c.shop==="TeePublic"?"https://www.teepublic.com/user/kk-florida":"https://flwildlife.picfair.com/";
 return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${h(c.title)} | KK Florida</title>
<meta name="description" content="${h(c.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${h(c.title)} | KK Florida"><meta property="og:description" content="${h(c.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://kkflorida.com/${h(thumb)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css"><link rel="stylesheet" href="../css/categories.css">
</head><body class="category-page">
<a class="skip-to-gallery" href="#gallery">Skip to photographs</a>
<header class="site-header inner-header"><a class="brand" href="../" aria-label="KK Florida homepage"><img src="../images/logos/kkflorida-logo.png" alt="KK Florida"></a><button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="main-nav" aria-label="Main navigation"><a href="../">Home</a><a href="../#collections" class="active">Collections</a><a href="../guides.html">Wildlife Guides</a><a href="../coloring-pages.html">Free Coloring Pages</a><a href="../christmas/">Christmas</a><a href="../contact.html">Contact</a></nav></header>
<main><section class="category-hero"><div class="hero-wrap"><p class="eyebrow light">Original photography & artwork · KK Florida</p><h1>${h(c.title)}</h1><p>${h(c.intro)}</p><a class="return-link" href="../#collections">← All collections</a></div></section>
<section class="category-content" id="gallery"><div class="category-intro"><div><p class="eyebrow">Browse the collection</p><h2>${h(c.label)}</h2></div><p>${items.length} ${items.length===1?"image":"images"} · Choose an image to see it larger, or use a shopping link to explore available products.</p></div><div class="category-photos">${cards}</div></section>
<section class="category-related"><h2>More KK Florida collections</h2><nav aria-label="Other categories" class="category-related-nav">${others}</nav></section>
<section class="category-store"><div><p class="eyebrow light">Photography, artwork & gifts</p><h2>Bring a little Florida home</h2><p>Explore original KK Florida designs and photography available on ${h(c.shop)}.</p></div><a class="button white-button" href="${shop}" target="_blank" rel="noopener noreferrer">Shop on ${h(c.shop)} ↗</a></section>
</main><footer class="site-footer"><div class="footer-logo-panel"><a href="../"><img src="../images/logos/kkflorida-logo.png" alt="KK Florida"></a></div><p>Original Florida wildlife photography, creative artwork and gifts.</p><div class="footer-links"><a href="../">Home</a><a href="../#collections">Collections</a><a href="../guides.html">Wildlife Guides</a><a href="../coloring-pages.html">Coloring Pages</a><a href="../contact.html">Contact</a></div></footer>
<script>const b=document.querySelector(".menu-button"),n=document.querySelector(".main-nav");if(b&&n){b.addEventListener("click",()=>{const open=n.classList.toggle("open");b.setAttribute("aria-expanded",String(open));});n.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{n.classList.remove("open");b.setAttribute("aria-expanded","false");}));}</script>
</body></html>\n`;
}
function sitemap(xml){
 const all=[...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].trim());
 for(const c of cats){const url="https://kkflorida.com/"+c.slug+"/";if(!all.includes(url))all.push(url);}
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map(x=>`  <url><loc>${h(x)}</loc></url>`).join("\n")}\n</urlset>\n`;
}
const data=JSON.parse(fs.readFileSync(path.join(root,"data/gallery.json"),"utf8"));
if(!Array.isArray(data))throw new Error("data/gallery.json must be an array");
for(const c of cats){const group=data.filter(x=>x.category===c.key);fs.mkdirSync(path.join(root,c.slug),{recursive:true});fs.writeFileSync(path.join(root,c.slug,"index.html"),render(c,group),"utf8");console.log(c.slug+": "+group.length+" images");}
const p=path.join(root,"sitemap.xml");fs.writeFileSync(p,sitemap(fs.readFileSync(p,"utf8")),"utf8");


function buildImageSitemap(rows){
 const groups=new Map();
 for(const item of rows){
  if(!item || !item.image || !/^images\/[a-z0-9_\-./]+\.(?:jpe?g|png|webp)$/i.test(item.image))continue;
  const c=cats.find(cat=>cat.key===item.category);if(!c)continue;
  const list=groups.get(c.slug)||[];list.push(item);groups.set(c.slug,list);
 }
 let result='<?xml version="1.0" encoding="UTF-8"?>\n';
 result+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
 for(const c of cats){
  const items=groups.get(c.slug)||[];if(!items.length)continue;
  result+='  <url>\n    <loc>https://kkflorida.com/'+c.slug+'/</loc>\n';
  for(const item of items){
   const title=String(item.title||c.label).trim();
   const caption=String(item.description||item.alt||title).trim();
   result+='    <image:image>\n';
   result+='      <image:loc>https://kkflorida.com/'+h(item.image)+'</image:loc>\n';
   result+='      <image:title>'+h(title)+'</image:title>\n';
   result+='      <image:caption>'+h(caption)+'</image:caption>\n';
   result+='    </image:image>\n';
  }
  result+='  </url>\n';
 }
 return result+'</urlset>\n';
}
const imageSitemapPath=path.join(root,"image-sitemap.xml");
fs.writeFileSync(imageSitemapPath,buildImageSitemap(data),"utf8");
console.log("Updated image-sitemap.xml");
