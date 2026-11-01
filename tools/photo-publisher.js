"use strict";
(function(){
const $=id=>document.getElementById(id);
const CATS=["Birds","Butterflies","Flowers","Kaleidoscope Flowers","Sunsets","Insects","Landscapes","Mammals","Orchids","Tshirts"];
const DIRS={"Birds":"birds","Butterflies":"butterflies","Flowers":"flowers","Kaleidoscope Flowers":"kaleidoscope-flowers","Sunsets":"sunsets","Insects":"insects","Landscapes":"landscapes","Mammals":"mammals","Orchids":"orchids","Tshirts":"tshirts"};
const ALBUMS={"337633":"Birds","337651":"Mammals","337747":"Insects","337825":"Flowers","337827":"Butterflies","337836":"Sunsets","337756":"Landscapes"};
const ALBUM_SLUGS={"birds-of-florida":"Birds","birds":"Birds","butterflies":"Butterflies","flowers":"Flowers","sunsets":"Sunsets","honey-bees":"Insects","bees":"Insects","insects":"Insects","landscapes":"Landscapes","squirrels":"Mammals","orchids":"Orchids","kaleidoscope-flowers":"Kaleidoscope Flowers"};
let gallery=null;let imported=new Map();let selections=[];let logo=null;
function el(tag,props,text){const e=document.createElement(tag);if(props)for(const [key,val] of Object.entries(props)){if(key==="class")e.className=val;else e.setAttribute(key,val);}if(text!==undefined)e.textContent=text;return e;}
function stat(message,warn){$("importStatus").textContent=message;$("importStatus").classList.toggle("warning",!!warn);}
function norm(v){return String(v||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/\.[^.]*$/,"").replace(/[^a-z0-9]+/g,"");}
function slug(v){return String(v||"photo").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,62)||"photo";}
function inferCategory(raw){if(CATS.includes(raw))return raw;return null;}
function categoryForAlbum(a){if(!a)return null;const id=String(a.id||a.album_id||"");const s=String(a.slug||a.album_slug||"").toLowerCase();return inferCategory(a.category)||ALBUMS[id]||ALBUM_SLUGS[s]||null;}
function parseAlbumUrl(value){const m=String(value||"").match(/\/albums\/(\d+)-([a-z0-9-]+)/i);return m?{id:m[1],slug:m[2],name:m[2].replace(/-/g," ")}:null;}
function parsePicfair(data){
 if(!data||!Array.isArray(data.photos))throw Error("JSON does not contain a photos array.");
 const parsed=[];
 for(const photo of data.photos){
   if(!photo||!photo.id)continue;
   const albums=Array.isArray(photo.albums)?photo.albums:[];
   const source=parseAlbumUrl(data.source_album);
   const hints=albums.map(categoryForAlbum).filter(Boolean);
   if(inferCategory(photo.category))hints.push(photo.category);
   if(!hints.length){const hint=categoryForAlbum({id:photo.album_id,slug:photo.album_slug})||categoryForAlbum(source);if(hint)hints.push(hint);}
   const distinct=[...new Set(hints)];
   let category=distinct.length===1&&!photo.needs_category_review?distinct[0]:null;
   if(albums.length && albums.some(a=>!categoryForAlbum(a)))category=null;
   const albumLabel=String(photo.album_name||albums.map(a=>a.name||a.slug).join(", ")||source?.name||"Picfair");
   parsed.push({id:String(photo.id),title:String(photo.title||"").trim(),description:String(photo.description||"").trim(),url:String(photo.url||"").trim(),category,albumLabel,albumCount:albums.length,needsReview:!category,preview:String(photo.preview_image||"")});
 }
 return parsed;
}
async function readJson(file){const value=JSON.parse(await file.text());return value;}
function refreshStats(){
 const onSite=new Set((gallery||[]).map(p=>String(p.picfair_id||"")).filter(Boolean));
 const newCount=[...imported.values()].filter(p=>!onSite.has(p.id)).length;
 stat((gallery?gallery.length+" existing gallery items loaded. ":"Load gallery.json first. ")+imported.size+" Picfair records loaded ("+newCount+" not yet linked to your website).",!gallery);
 $("photoCount").textContent=selections.length+" selected";
 $("summary").textContent=selections.length?selections.length+" photographs selected; review the matches and categories below.":"No photographs selected yet.";
}
$("galleryFile").addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;
 try{const obj=await readJson(file);if(!Array.isArray(obj)||obj.some(x=>!x||typeof x!=="object"||!x.image||!x.category))throw Error("The gallery JSON must be an array of photo entries.");
 gallery=obj;refreshStats();renderCards();
 }catch(err){gallery=null;stat("Could not load gallery: "+err.message,true);}
});
$("picfairFiles").addEventListener("change",async e=>{
 let loaded=0;
 for(const file of e.target.files){
  try{const data=await readJson(file);for(const x of parsePicfair(data)){const old=imported.get(x.id);if(old){if(old.category&&x.category&&old.category!==x.category)x.category=null;
     else if(!x.category&&old.category && !x.needsReview)x.category=old.category;
     x.albumLabel=[...new Set((old.albumLabel+", "+x.albumLabel).split(", ").filter(Boolean))].join(", ");
   }imported.set(x.id,x);loaded++;}
  }catch(err){alert("Cannot import "+file.name+": "+err.message);}
 }
 refreshStats();renderCards();
 if(loaded&&!selections.length)$("importStatus").textContent+=" Select your local photographs next.";
});
$("photoFiles").addEventListener("change",e=>{
 for(const file of e.target.files){if(!/^image\/(jpeg|png|webp)$/i.test(file.type)){alert("Unsupported image: "+file.name);continue;}
  if(selections.some(x=>x.file.name===file.name&&x.file.size===file.size&&x.file.lastModified===file.lastModified))continue;
  const obj={file,url:URL.createObjectURL(file),picfairId:"",category:"",title:file.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," "),description:"",link:"",alt:""};
  const stem=norm(file.name);
  const exact=[...imported.values()].filter(x=>norm(x.title)===stem || x.id===stem);
  if(exact.length===1)applyMatch(obj,exact[0].id);
  selections.push(obj);
 }
 e.target.value="";refreshStats();renderCards();
});
$("clearPhotos").addEventListener("click",()=>{
 for(const item of selections)URL.revokeObjectURL(item.url);
 selections=[];refreshStats();renderCards();
});
function applyMatch(item,id){
 item.picfairId=id;
 if(!id)return;
 const photo=imported.get(id);if(!photo)return;
 item.title=photo.title||item.title;
 item.description=photo.description||"";
 item.link=photo.url||"";
 if(photo.category)item.category=photo.category;
 item.alt=photo.title ? photo.title+" — original photograph by KK Florida":"";
}
function makeField(label,control,wide){
 const wrap=el("label",{class:wide?"wide":""});
 wrap.append(el("span",null,label),control);
 return wrap;
}
function renderCards(){
 const wrap=$("photoList");wrap.replaceChildren();
 if(!selections.length){wrap.append(el("div",{class:"empty"},"Select your image files above to see the matching cards."));return;}
 const onSiteIds=new Set((gallery||[]).map(x=>String(x.picfair_id||"")).filter(Boolean));
 const metaOptions=[...imported.values()].sort((a,b)=>(onSiteIds.has(a.id)?1:0)-(onSiteIds.has(b.id)?1:0)||a.title.localeCompare(b.title)||a.id.localeCompare(b.id));
 for(const item of selections){
  const outer=el("div",{class:"photo-card"}),visual=el("div"),details=el("div",{class:"grid"}),image=el("img",{src:item.url,alt:"Selected local photograph"});
  visual.append(image,el("p",{class:"filename"},item.file.name));
  const remove=el("button",{class:"secondary",type:"button"},"Remove");
  remove.addEventListener("click",()=>{URL.revokeObjectURL(item.url);selections=selections.filter(x=>x!==item);refreshStats();renderCards();});
  visual.append(remove);
  const pic=el("select",{});
  pic.append(el("option",{value:""},"No Picfair match (enter details manually)"));
  for(const p of metaOptions){
   const existing=onSiteIds.has(p.id);
   const option=el("option",{value:p.id},p.title+" · "+p.albumLabel+" · "+p.id+(existing?" — ALREADY ON WEBSITE":""));
   pic.append(option);
  }
  pic.value=item.picfairId||"";
  pic.addEventListener("change",()=>{if(pic.value)applyMatch(item,pic.value);else item.picfairId="";renderCards();});
  details.append(makeField("Picfair photograph (review the match)",pic,true));
  const title=el("input",{type:"text"});title.value=item.title;title.addEventListener("input",()=>{item.title=title.value;});
  const category=el("select");
  category.append(el("option",{value:""},"Choose a website category"));
  for(const c of CATS)category.append(el("option",{value:c},c==="Tshirts"?"T-Shirts & Art":c));
  category.value=item.category;category.addEventListener("change",()=>item.category=category.value);
  details.append(makeField("Photograph title",title,false),makeField("Website category",category,false));
  const description=el("textarea");description.value=item.description;description.addEventListener("input",()=>item.description=description.value);
  details.append(makeField("Description (from Picfair or your own)",description,true));
  const link=el("input",{type:"url",placeholder:"https://flwildlife.picfair.com/images/..."});link.value=item.link;link.addEventListener("input",()=>item.link=link.value);
  details.append(makeField("Individual Picfair shopping URL",link,true));
  const info=el("div",{class:"hint wide"});
  const record=imported.get(item.picfairId);const duplicate=item.picfairId&&onSiteIds.has(item.picfairId);
  if(duplicate){info.classList.add("attention");info.textContent="Already in gallery.json: Picfair ID "+item.picfairId+". Please select the correct new listing or remove this image. Export will block duplicates.";}
  else if(record?.needsReview){info.classList.add("attention");info.textContent="This Picfair listing belongs to multiple or unknown album categories. Select the correct website category manually.";}
  else if(record){info.textContent="Picfair album: "+record.albumLabel+" · Image ID: "+record.id+". Confirm this is the same photograph.";}
  else{info.textContent="No Picfair listing selected. Enter the title, category, description and individual link manually.";}
  details.append(info);outer.append(visual,details);wrap.append(outer);
 }
}
$("watermarkFile").addEventListener("change",e=>{logo=e.target.files[0]||null;});
$("opacity").addEventListener("input",()=>{$("opacityLabel").textContent=Math.round(Number($("opacity").value)*100)+"%";});
function imgFromFile(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),image=new Image();image.onload=()=>{URL.revokeObjectURL(url);resolve(image);};image.onerror=()=>{URL.revokeObjectURL(url);reject(Error("Cannot decode "+file.name));};image.src=url;});}
function maxSize(input,min,max,label){const n=Number(input);if(!Number.isInteger(n)||n<min||n>max)throw Error(label+" must be from "+min+" to "+max+" pixels.");return n;}
function sizedCanvas(source,max){const w=source.naturalWidth||source.width,h=source.naturalHeight||source.height;if(!w||!h)throw Error("Image has invalid dimensions.");const scale=Math.min(1,max/Math.max(w,h));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));canvas.getContext("2d").drawImage(source,0,0,canvas.width,canvas.height);return canvas;}
function drawMark(canvas,logoImage){
 const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height,alpha=Number($("opacity").value);
 ctx.save();ctx.globalAlpha=alpha;
 if(logoImage){
  const scale=Math.min(w*.39/logoImage.naturalWidth,h*.24/logoImage.naturalHeight);
  const lw=logoImage.naturalWidth*scale,lh=logoImage.naturalHeight*scale;
  ctx.drawImage(logoImage,(w-lw)/2,(h-lh)/2,lw,lh);
 }else{
  const text=$("watermarkText").value.trim()||"© KK Florida Photography";
  const px=Math.max(15,Math.min(w/Math.max(9,text.length*.59),h*.105,90));ctx.font="700 "+Math.round(px)+"px Arial,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.lineWidth=Math.max(2,px*.12);ctx.strokeStyle="rgba(0,0,0,.65)";ctx.strokeText(text,w/2,h/2);
  ctx.fillStyle="#ffffff";ctx.fillText(text,w/2,h/2);
 }
 ctx.restore();
}
function blobCanvas(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("Canvas image export failed.")),type,quality));}
function zipName(file,item,ext,used){
 const cat=DIRS[item.category];const base=slug((item.picfairId?"picfair-"+item.picfairId+"-":"")+(item.title||file.name));
 let name=base,count=2;while(used.has("images/"+cat+"/web/"+name+"."+ext)){name=base+"-"+count;count++;}
 const image="images/"+cat+"/web/"+name+"."+ext,thumb="images/"+cat+"/thumbs/"+name+"-thumb."+ext;
 used.add(image);return{image,thumb};
}
const encoder=new TextEncoder();function w16(v,n,o){v.setUint16(o,n,true);}function w32(v,n,o){v.setUint32(o,n>>>0,true);}
const crcTable=(()=>{const t=[];for(let i=0;i<256;i++){let x=i;for(let k=0;k<8;k++)x=x&1?0xedb88320^(x>>>1):x>>>1;t.push(x>>>0);}return t;})();
function crc32(arr){let c=0xffffffff;for(const b of arr)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function zipStore(entries){
 let offset=0;const localParts=[],centralParts=[];let centerSize=0;
 for(const entry of entries){
  const name=encoder.encode(entry.name),bytes=entry.bytes,crc=crc32(bytes);
  if(name.length>65535)throw Error("Filename too long for ZIP.");
  const lh=new Uint8Array(30+name.length),lv=new DataView(lh.buffer);
  w32(lv,0x04034b50,0);w16(lv,20,4);w16(lv,0x0800,6);w16(lv,0,8);w16(lv,0,10);w16(lv,0,12);
  w32(lv,crc,14);w32(lv,bytes.length,18);w32(lv,bytes.length,22);w16(lv,name.length,26);w16(lv,0,28);lh.set(name,30);
  localParts.push(lh,bytes);
  const ch=new Uint8Array(46+name.length),cv=new DataView(ch.buffer);
  w32(cv,0x02014b50,0);w16(cv,20,4);w16(cv,20,6);w16(cv,0x0800,8);w16(cv,0,10);w16(cv,0,12);w16(cv,0,14);
  w32(cv,crc,16);w32(cv,bytes.length,20);w32(cv,bytes.length,24);w16(cv,name.length,28);
  w16(cv,0,30);w16(cv,0,32);w16(cv,0,34);w16(cv,0,36);w32(cv,0,38);w32(cv,offset,42);ch.set(name,46);
  centralParts.push(ch);offset+=lh.length+bytes.length;centerSize+=ch.length;
 }
 if(entries.length>65535||offset>0xffffffff||centerSize>0xffffffff)throw Error("ZIP is too large. Publish smaller batches.");
 const end=new Uint8Array(22),e=new DataView(end.buffer);w32(e,0x06054b50,0);w16(e,0,4);w16(e,0,6);w16(e,entries.length,8);w16(e,entries.length,10);w32(e,centerSize,12);w32(e,offset,16);w16(e,0,20);
 return new Blob([...localParts,...centralParts,end],{type:"application/zip"});
}
function validate(){
 if(!gallery)throw Error("Load your latest data/gallery.json first. This protects your existing photographs.");
 if(!selections.length)throw Error("Select at least one local photograph.");
 const existingIDs=new Set(gallery.map(x=>String(x.picfair_id||"")).filter(Boolean));
 const chosenIDs=new Set();
 for(const item of selections){
  item.title=item.title.trim();item.description=item.description.trim();item.link=item.link.trim();
  if(!item.title)throw Error("Photograph "+item.file.name+" needs a title.");
  if(!DIRS[item.category])throw Error("Choose a category for "+item.file.name+".");
  if(item.picfairId){if(existingIDs.has(item.picfairId))throw Error(item.file.name+" matches Picfair ID "+item.picfairId+" already on your website.");if(chosenIDs.has(item.picfairId))throw Error("Picfair ID "+item.picfairId+" was assigned to two photos.");chosenIDs.add(item.picfairId);}
  if(item.link&&!/^https:\/\/[a-z0-9.-]+(?:\/[^<>"]*)?$/i.test(item.link))throw Error("Invalid shopping URL for "+item.file.name+".");
  if(item.link&&!/^https:\/\/(?:flwildlife\.picfair\.com|www\.picfair\.com|www\.teepublic\.com)\//i.test(item.link))throw Error("Review shopping URL for "+item.file.name+"; only Picfair or TeePublic links are supported.");
 }
}
$("exportZip").addEventListener("click",async()=>{
 const btn=$("exportZip");try{
  validate();btn.disabled=true;$("log").textContent="";
  const webMax=maxSize($("webSize").value,500,5000,"Web image size"),thumbMax=maxSize($("thumbSize").value,120,1200,"Thumbnail size");
  const existing=new Set(gallery.map(x=>x.image));
  const newGallery=gallery.map(x=>({...x}));const output=[];
  let logoImage=null;if(logo&&$("watermarkOn").checked)logoImage=await imgFromFile(logo);
  for(let i=0;i<selections.length;i++){
   const item=selections[i];$("exportStatus").textContent="Preparing "+(i+1)+" of "+selections.length+": "+item.file.name;
   const source=await imgFromFile(item.file);
   const isPng=$("allowTransparent").checked && item.file.type==="image/png";
   const type=isPng?"image/png":"image/jpeg",ext=isPng?"png":"jpg";
   const canvas=sizedCanvas(source,webMax);
   if($("watermarkOn").checked)drawMark(canvas,logoImage);
   const webBlob=await blobCanvas(canvas,type,0.87);
   const thumb=sizedCanvas(canvas,thumbMax),thumbBlob=await blobCanvas(thumb,type,0.82);
   const paths=zipName(item.file,item,ext,existing);
   output.push({name:paths.image,bytes:new Uint8Array(await webBlob.arrayBuffer())});
   output.push({name:paths.thumb,bytes:new Uint8Array(await thumbBlob.arrayBuffer())});
   const row={title:item.title,category:item.category,description:item.description,image:paths.image,thumbnail:paths.thumb,link:item.link||(item.category==="Tshirts"?"https://www.teepublic.com/user/kk-florida":"https://flwildlife.picfair.com/"),store:item.category==="Tshirts"?"TeePublic":"Picfair",alt:item.alt||item.title+" — original KK Florida photograph"};
   if(item.picfairId)row.picfair_id=item.picfairId;
   newGallery.push(row);
   $("log").textContent+="Prepared "+item.title+" → "+paths.image+"\n";
  }
  output.unshift({name:"data/gallery.json",bytes:encoder.encode(JSON.stringify(newGallery,null,2)+"\n")});
  const blob=zipStore(output);
  const a=document.createElement("a"),url=URL.createObjectURL(blob);
  a.href=url;a.download="KKFlorida-Ready-To-Publish-"+new Date().toISOString().slice(0,10)+".zip";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  $("exportStatus").textContent="ZIP created: "+selections.length+" new photos; "+newGallery.length+" gallery entries. Extract into your repository, then Commit and Push.";
 }catch(err){$("exportStatus").textContent="Could not export: "+err.message;alert("Photo Publisher: "+err.message);}finally{btn.disabled=false;}
});
refreshStats();renderCards();
})();