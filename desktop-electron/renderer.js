const $=id=>document.getElementById(id);
let allFiles=[];

function renderFiles(files){
  const ul=$('files'); ul.innerHTML='';
  files.forEach(f=>{const li=document.createElement('li'); li.textContent=`${f.extension.toUpperCase()} • ${f.path}`; li.onclick=async()=>{$('inspect').textContent=JSON.stringify(await window.api.inspectFile(f.path),null,2)}; ul.appendChild(li);});
}

function refreshStats(files){
  const c={'.ytd':0,'.ydr':0,'.yft':0,'.meta':0}; files.forEach(f=>c[f.extension]=(c[f.extension]||0)+1);
  $('tot').textContent=`Totale: ${files.length}`; $('ytd').textContent=`YTD: ${c['.ytd']}`; $('ydr').textContent=`YDR: ${c['.ydr']}`; $('yft').textContent=`YFT: ${c['.yft']}`; $('meta').textContent=`META: ${c['.meta']}`;
}

$('pick').onclick=async()=>{
  const folder=await window.api.pickFolder(); if(!folder) return;
  $('folder').textContent=folder;
  allFiles=await window.api.scanFiles(folder);
  refreshStats(allFiles); renderFiles(allFiles);
};

$('search').oninput=()=>{const q=$('search').value.toLowerCase(); renderFiles(allFiles.filter(f=>f.path.toLowerCase().includes(q)));};
$('dsave').onclick=async()=>{$('dout').textContent=JSON.stringify(await window.api.saveDebadge({name:$('dname').value,remove_livery:true,disable_extra_badges:[1,2,3],mod_type_removals:[48]}),null,2)};
$('dlist').onclick=async()=>{$('dout').textContent=JSON.stringify(await window.api.listDebadge(),null,2)};
$('tsave').onclick=async()=>{$('tout').textContent=JSON.stringify(await window.api.saveTattoo({name:$('tname').value,collection:$('collection').value,overlay:$('overlay').value,zone:$('zone').value,opacity:1}),null,2)};
$('tlist').onclick=async()=>{$('tout').textContent=JSON.stringify(await window.api.listTattoo(),null,2)};
$('hprev').onclick=async()=>{$('hout').textContent=JSON.stringify(await window.api.handlingPreview({fMass:Number($('mass').value),fInitialDriveForce:Number($('drive').value),fBrakeForce:Number($('brake').value),fTractionCurveMax:Number($('traction').value)}),null,2)};
