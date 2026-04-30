const api='http://localhost:8090';
const $=id=>document.getElementById(id);

async function scan(){
  const res=await fetch(`${api}/scan`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({root_path:$('rootPath').value})});
  const data=await res.json();
  const list=$('fileList'); list.innerHTML='';
  (data.files||[]).forEach(f=>{const li=document.createElement('li'); li.textContent=`${f.extension} • ${f.path}`; li.onclick=()=>inspectFile(f.path); list.appendChild(li);});
}

async function inspectFile(path){
  const res=await fetch(`${api}/inspect?path=${encodeURIComponent(path)}`);
  $('inspectOut').textContent=JSON.stringify(await res.json(),null,2);
}

async function postJson(url, body, out){
  const res=await fetch(`${api}${url}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  out.textContent=JSON.stringify(await res.json(),null,2);
}

function handling(){return {model_name:$('model').value,fMass:Number($('mass').value),fInitialDriveForce:Number($('drive').value),fBrakeForce:Number($('brake').value),fTractionCurveMax:Number($('traction').value)}}

$('scanBtn').onclick=scan;
$('saveDebadge').onclick=()=>postJson('/presets/debadge',{name:$('debadgeName').value,remove_livery:true,disable_extra_badges:[1,2,3],mod_type_removals:[48]},$('debadgeOut'));
$('listDebadge').onclick=async()=>{$('debadgeOut').textContent=JSON.stringify(await (await fetch(`${api}/presets/debadge`)).json(),null,2)};
$('saveTattoo').onclick=()=>postJson('/presets/tattoos',{name:$('tattooName').value,collection:$('collection').value,overlay:$('overlay').value,zone:$('zone').value,opacity:1},$('tattooOut'));
$('listTattoo').onclick=async()=>{$('tattooOut').textContent=JSON.stringify(await (await fetch(`${api}/presets/tattoos`)).json(),null,2)};
$('previewHandling').onclick=()=>postJson('/handling/preview',handling(),$('handlingOut'));
$('exportHandling').onclick=()=>postJson('/handling/export-meta',handling(),$('handlingOut'));
