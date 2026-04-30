const api = 'http://localhost:8090';
const $ = (id) => document.getElementById(id);

$('scanBtn').onclick = async () => {
  const res = await fetch(`${api}/scan`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({root_path: $('rootPath').value})});
  $('scanOut').textContent = JSON.stringify(await res.json(), null, 2);
};

$('saveDebadge').onclick = async () => {
  const body = {name:$('debadgeName').value, remove_livery:true, disable_extra_badges:[1,2,3], mod_type_removals:[48]};
  const res = await fetch(`${api}/presets/debadge`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  $('debadgeOut').textContent = JSON.stringify(await res.json(), null, 2);
};

$('saveTattoo').onclick = async () => {
  const body = {name:$('tattooName').value, collection:$('collection').value, overlay:$('overlay').value, zone:$('zone').value, opacity:1.0};
  const res = await fetch(`${api}/presets/tattoos`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  $('tattooOut').textContent = JSON.stringify(await res.json(), null, 2);
};

function readHandling() {
  return { model_name:$('model').value, fMass:Number($('mass').value), fInitialDriveForce:Number($('drive').value), fBrakeForce:Number($('brake').value), fTractionCurveMax:Number($('traction').value)};
}

$('previewHandling').onclick = async () => {
  const res = await fetch(`${api}/handling/preview`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(readHandling())});
  $('handlingOut').textContent = JSON.stringify(await res.json(), null, 2);
};

$('exportHandling').onclick = async () => {
  const res = await fetch(`${api}/handling/export-meta`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(readHandling())});
  $('handlingOut').textContent = JSON.stringify(await res.json(), null, 2);
};
