const $=id=>document.getElementById(id);
let allFiles=[];
let currentTattooImage=null;

function renderFiles(files){
  const ul=$('files'); ul.innerHTML='';
  files.forEach(f=>{const li=document.createElement('li'); li.textContent=`${f.ext ? f.ext.toUpperCase() : f.extension.toUpperCase()} • ${f.path}`; li.onclick=async()=>{$('inspect').textContent=JSON.stringify(await window.api.inspectFile(f.path),null,2)}; ul.appendChild(li);});
}

function refreshStats(files){
  const c={'.ytd':0,'.ydr':0,'.yft':0,'.meta':0}; files.forEach(f=>{const e=f.ext||f.extension;c[e]=(c[e]||0)+1;});
  $('tot').textContent=`Totale: ${files.length}`; $('ytd').textContent=`YTD: ${c['.ytd']}`; $('ydr').textContent=`YDR: ${c['.ydr']}`; $('yft').textContent=`YFT: ${c['.yft']}`; $('meta').textContent=`META: ${c['.meta']}`;
}

function drawTattooPreview(){
  const canvas=$('tattooCanvas');
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#10192a'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#2a3650';
  const zones=[['Head',40,30,120,80],['Torso',180,40,180,220],['Left Arm',400,50,140,90],['Right Arm',400,170,140,90],['Left Leg',580,60,120,100],['Right Leg',580,180,120,100]];
  zones.forEach(z=>{ctx.strokeRect(z[1],z[2],z[3],z[4]);ctx.fillStyle='#8da0c7';ctx.fillText(z[0],z[1]+8,z[2]+16);});
  if(currentTattooImage){
    const zone = ($('zone').value || 'MP_Torso').toLowerCase();
    let target=[180,40,180,220];
    if(zone.includes('head')) target=[40,30,120,80];
    else if(zone.includes('leftarm')) target=[400,50,140,90];
    else if(zone.includes('rightarm')) target=[400,170,140,90];
    else if(zone.includes('leftleg')) target=[580,60,120,100];
    else if(zone.includes('rightleg')) target=[580,180,120,100];
    ctx.globalAlpha=0.9;
    ctx.drawImage(currentTattooImage,target[0],target[1],target[2],target[3]);
    ctx.globalAlpha=1;
  }
}

$('pick').onclick=async()=>{
  const folder=await window.api.pickFolder(); if(!folder) return;
  $('folder').textContent=folder;
  allFiles=await window.api.scanVehicleStream(folder);
  refreshStats(allFiles); renderFiles(allFiles);
};
$('search').oninput=()=>{const q=$('search').value.toLowerCase(); renderFiles(allFiles.filter(f=>f.path.toLowerCase().includes(q)));};

$('pickImg').onclick=async()=>{
  const p=await window.api.pickImage(); if(!p) return;
  const src=await window.api.readImageBase64(p);
  const img=new Image();
  img.onload=()=>{currentTattooImage=img; drawTattooPreview(); $('tattooOut').textContent='Preview tattoo generata. Puoi cambiare zona e salvare preset.';};
  img.src=src;
};
$('zone').oninput=drawTattooPreview;
$('saveTattoo').onclick=async()=>{
  const payload={name:`tattoo_${Date.now()}`,collection:'custom_collection',overlay:'custom_overlay',zone:$('zone').value||'MP_Torso',opacity:1};
  $('tattooOut').textContent=JSON.stringify(await window.api.saveTattoo(payload),null,2);
};

$('dsave').onclick=async()=>{$('dout').textContent=JSON.stringify(await window.api.saveDebadge({name:$('dname').value||`preset_${Date.now()}`,remove_livery:true,disable_extra_badges:[1,2,3],mod_type_removals:[48]}),null,2)};
$('dlist').onclick=async()=>{$('dout').textContent=JSON.stringify(await window.api.listDebadge(),null,2)};
$('hprev').onclick=async()=>{$('hout').textContent=JSON.stringify(await window.api.handlingPreview({fMass:Number($('mass').value),fInitialDriveForce:Number($('drive').value),fBrakeForce:Number($('brake').value),fTractionCurveMax:Number($('traction').value)}),null,2)};

drawTattooPreview();
