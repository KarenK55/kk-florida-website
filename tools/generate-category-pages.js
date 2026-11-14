// Generate searchable photography pages; protect hand-edited artwork pages.
// SEO metadata is refreshed on all ten collections. Manual pages retain their body HTML.
// Run: node tools/generate-category-pages.js
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const cats=[
  {
    "key": "Birds",
    "slug": "birds",
    "label": "Florida Birds",
    "title": "Florida Bird Photography | Everglades & South Florida",
    "description": "Explore Florida bird photography featuring great egrets, herons, ibis, spoonbills, cardinals and other South Florida birds. Shop original wildlife prints.",
    "intro": "Discover Florida birds through original wildlife photography. Explore great egrets, herons, ibis, spoonbills, cardinals and other birds found in South Florida wetlands, parks and neighborhoods.",
    "shop": "Picfair"
  },
  {
    "key": "Butterflies",
    "slug": "butterflies",
    "label": "Butterflies",
    "title": "Florida Butterfly Photography | Swallowtails & More",
    "description": "Discover Florida butterflies, including zebra longwings, giant swallowtails and hairstreaks, in original butterfly photographs and nature prints.",
    "intro": "Explore the colorful wings and delicate patterns of Florida butterflies, including zebra longwings, swallowtails and hairstreaks. Discover original South Florida butterfly photography and nature prints.",
    "shop": "Picfair"
  },
  {
    "key": "Flowers",
    "slug": "flowers",
    "label": "Flowers & Plants",
    "title": "Florida Flowers & Tropical Plant Photography",
    "description": "Explore tropical flowers, colorful garden blooms, wildflowers and plants in original South Florida botanical photography and floral prints.",
    "intro": "Discover tropical flowers, garden blossoms and plants through original Florida botanical photography. Explore colorful marigolds, rain lilies, cannas, black-eyed Susans and flowering trees.",
    "shop": "Picfair"
  },
  {
    "key": "Kaleidoscope Flowers",
    "slug": "kaleidoscope-flowers",
    "label": "Kaleidoscope Flowers",
    "title": "Kaleidoscope Flower Art | Floral Mandalas & Designs",
    "description": "Discover colorful kaleidoscope flower art, symmetrical floral designs and botanical artwork made from original flower photography. Explore free coloring pages.",
    "intro": "Original flower photography becomes colorful symmetrical floral artwork. Explore kaleidoscope designs, botanical art and free printable coloring pages.",
    "shop": "TeePublic",
    "manual": true
  },
  {
    "key": "Sunsets",
    "slug": "sunsets",
    "label": "Florida Sunsets",
    "title": "Florida Sunset Photography | Everglades & Tropical Skies",
    "description": "Explore Florida sunset photography, Everglades sunsets, golden clouds and tropical skies with palm tree silhouettes. Shop original nature prints.",
    "intro": "Explore the colorful skies of South Florida, from golden Everglades sunsets to tropical evening light and palm tree silhouettes. Discover original sunset photography and scenic prints.",
    "shop": "Picfair"
  },
  {
    "key": "Insects",
    "slug": "insects",
    "label": "Insects & Bees",
    "title": "Florida Insects & Bee Photography | Pollinators",
    "description": "Discover honeybees, metallic green bees and other pollinators in close-up South Florida insect photography and original nature prints.",
    "intro": "Discover the small details of Florida nature through close-up photography of honeybees, metallic green bees and other insects. Explore flowers and pollinators in their natural surroundings.",
    "shop": "Picfair"
  },
  {
    "key": "Landscapes",
    "slug": "landscapes",
    "label": "Florida Landscapes",
    "title": "Florida Landscape Photography | Tropical Nature & Scenery",
    "description": "Explore South Florida landscape photography, tropical scenery, palm trees, colorful skies and original nature photographs for wall art and prints.",
    "intro": "Discover the natural beauty of South Florida through original landscape photography, tropical palms, colorful skies and peaceful scenery.",
    "shop": "Picfair"
  },
  {
    "key": "Mammals",
    "slug": "mammals",
    "label": "Florida Mammals",
    "title": "Florida Wildlife Photography | Squirrels & Mammals",
    "description": "Explore original Florida mammal and wildlife photography, featuring squirrels and the everyday natural beauty of South Florida.",
    "intro": "Discover Florida wildlife through original photographs of squirrels and other mammals in their natural surroundings. Enjoy the everyday beauty of South Florida nature.",
    "shop": "Picfair"
  },
  {
    "key": "Orchids",
    "slug": "orchids",
    "label": "Orchids",
    "title": "Orchid Photography | Florida Flowers & Botanical Art",
    "description": "Discover original orchid flower photography, colorful blossoms and delicate floral details from KK Florida. Explore botanical photographs and prints.",
    "intro": "Enjoy the intricate shapes, vivid colors and delicate details of orchid flowers through original Florida botanical photography.",
    "shop": "Picfair"
  },
  {
    "key": "Tshirts",
    "slug": "tshirts",
    "label": "T-Shirts & Art",
    "title": "Funny Animal T-Shirts, Nature Art & Unique Gifts",
    "description": "Shop original funny animal T-shirts, cat lover gifts, nature-inspired artwork and creative designs from KK Florida on TeePublic.",
    "intro": "A little wild, a little wacky, and never boring. Explore funny animal shirts, nature-inspired designs, original artwork and creative gifts.",
    "shop": "TeePublic",
    "manual": true
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
 const alt=String(i.alt||"").trim()||title;
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
<link rel="stylesheet" href="../css/style.css"><link rel="stylesheet" href="../css/categories.css?v=20261113-compact-headers">
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
// Read only local, category-specific image paths actually referenced by custom pages.
// This avoids bringing removed T-shirts back into the image sitemap from old JSON.
function customImagePaths(html,c){
 const body=html.replace(/^[\s\S]*?<\/head\s*>/i,"");
 const paths=new Set();
 const pattern=/(?:https:\/\/(?:www\.)?kkflorida\.com\/|\.\.\/|\.\/|\/)?(images\/[a-z0-9_./%+-]+\.(?:jpe?g|png|webp|gif|avif))(?=["'\s,)<]|$)/gi;
 for(const m of body.matchAll(pattern)){
  const p=m[1];if(p.startsWith("images/"+c.slug+"/")&&!p.split("/").includes(".."))paths.add(p);
 }
 // Prefer full-size paths first; retain thumbnails if they are the only references.
 return [...paths].sort((a,b)=>Number(a.includes("/thumbs/"))-Number(b.includes("/thumbs/")));
}
function attr(tag,key){
 const m=tag.match(new RegExp("(?:^|\\s)"+key+"\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))","i"));
 return m?(m[1]??m[2]??m[3]):"";
}
function updateManualHead(html,c,images){
 const url="https://kkflorida.com/"+c.slug+"/",title=c.title+" | KK Florida";
 if(!/<head\b[^>]*>[\s\S]*?<\/head\s*>/i.test(html))throw Error("Missing HTML head in "+c.slug+"/index.html; not overwriting custom page.");
 return html.replace(/(<head\b[^>]*>)([\s\S]*?)(<\/head\s*>)/i,(_,open,head,close)=>{
  // Replace only these SEO tags. Everything outside the head remains byte-for-byte unchanged.
  head=head.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi,"");
  const properties=new Set(["og:type","og:title","og:description","og:url"]);
  if(images.length)properties.add("og:image");
  head=head.replace(/<meta\b[^>]*>/gi,tag=>attr(tag,"name").toLowerCase()==="description"||properties.has(attr(tag,"property").toLowerCase())?"":tag);
  head=head.replace(/<link\b[^>]*>/gi,tag=>attr(tag,"rel").toLowerCase().split(/\s+/).includes("canonical")?"":tag);
  const tags=[`<title>${h(title)}</title>`,`<meta name="description" content="${h(c.description)}">`,`<link rel="canonical" href="${url}">`,`<meta property="og:type" content="website">`,`<meta property="og:title" content="${h(title)}">`,`<meta property="og:description" content="${h(c.description)}">`,`<meta property="og:url" content="${url}">`];
  if(images.length)tags.push(`<meta property="og:image" content="https://kkflorida.com/${h(images[0])}">`);
  // Normalize whitespace only around the generated SEO block for repeatable builds.
  return open+head.trimEnd()+"\n"+tags.join("\n")+"\n"+close;
 });
}
function sitemap(xml){
 const all=new Set([...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].trim()));
 const additions=cats.map(c=>"https://kkflorida.com/"+c.slug+"/").filter(url=>!all.has(url));
 if(!additions.length)return xml;
 if(!/<\/urlset\s*>/i.test(xml))throw Error("sitemap.xml has no closing urlset tag.");
 return xml.replace(/<\/urlset\s*>/i,additions.map(url=>`  <url><loc>${h(url)}</loc></url>\n`).join("")+"</urlset>");
}
function buildImageSitemap(groups){
 let result='<?xml version="1.0" encoding="UTF-8"?>\n';
 result+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
 for(const c of cats){
  const images=[...new Set(groups.get(c.slug)||[])];if(!images.length)continue;
  if(images.length>1000)throw Error("Image sitemap limit exceeded for "+c.slug);
  result+='  <url>\n    <loc>https://kkflorida.com/'+c.slug+'/</loc>\n';
  for(const image of images){
   result+='    <image:image>\n      <image:loc>https://kkflorida.com/'+h(image)+'</image:loc>\n    </image:image>\n';
  }
  result+='  </url>\n';
 }
 return result+'</urlset>\n';
}
const data=JSON.parse(fs.readFileSync(path.join(root,"data/gallery.json"),"utf8"));
if(!Array.isArray(data))throw Error("data/gallery.json must be an array");
const planned=[],imageGroups=new Map();
for(const c of cats){
 const group=data.filter(x=>x&&x.category===c.key),file=path.join(root,c.slug,"index.html");
 if(c.manual){
  if(!fs.existsSync(file))throw Error("Custom page missing: "+c.slug+"/index.html. Restore it before running this generator.");
  const old=fs.readFileSync(file,"utf8"),images=customImagePaths(old,c);
  planned.push({file,html:updateManualHead(old,c,images)});
  imageGroups.set(c.slug,images);
  console.log(c.slug+": custom layout preserved; "+images.length+" referenced image paths");
 }else{
  planned.push({file,html:render(c,group)});
  imageGroups.set(c.slug,group.map(i=>imgpath(i.image)).filter(p=>p&&/\.(?:jpe?g|png|webp|gif|avif)$/i.test(p)));
  console.log(c.slug+": "+group.length+" images");
 }
}
const p=path.join(root,"sitemap.xml");
planned.push({file:p,html:sitemap(fs.readFileSync(p,"utf8"))});
planned.push({file:path.join(root,"image-sitemap.xml"),html:buildImageSitemap(imageGroups)});
// Validate all inputs and build all outputs before writing any files.
for(const {file,html} of planned){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html,"utf8");}
console.log("Updated collection SEO and sitemaps; custom page bodies preserved.");
