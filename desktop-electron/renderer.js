import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.165.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';

const $=id=>document.getElementById(id);
let allFiles=[]; let currentTattooImage=null; let activeMesh=null;

const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0b111d);
const camera = new THREE.PerspectiveCamera(65, 16/7, 0.1, 2000); camera.position.set(0,2,6);
const renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setSize(1100, 480); $('viewer3d').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true;
scene.add(new THREE.AmbientLight(0xffffff,0.9)); const dl = new THREE.DirectionalLight(0xffffff,1.1); dl.position.set(4,6,5); scene.add(dl);
const grid = new THREE.GridHelper(30, 30, 0x335588, 0x223344); scene.add(grid);

function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera);} animate();

function clearModel(){ if(activeMesh){ scene.remove(activeMesh);} activeMesh=null; }
function setActive(obj){ clearModel(); activeMesh=obj; scene.add(activeMesh); }

$('pick3d').onclick=async()=>{
  const p = await window.api.pick3dModel(); if(!p) return;
  if(p.toLowerCase().endsWith('.glb') || p.toLowerCase().endsWith('.gltf')){
    const loader = new GLTFLoader();
    loader.load(`file://${p}`, (gltf)=>{ setActive(gltf.scene); }, undefined, (e)=>alert('Errore caricamento modello 3D: '+e.message));
  } else {
    alert('Per ora supporto editing completo su GLB/GLTF. OBJ in arrivo.');
  }
};
$('applyColor').onclick=()=>{ if(!activeMesh) return; const col = $('modelColor').value; activeMesh.traverse?.((n)=>{ if(n.material){ n.material.color = new THREE.Color(col); n.material.needsUpdate=true; }}); };
$('scaleUp').onclick=()=>{ if(activeMesh) activeMesh.scale.multiplyScalar(1.1); };
$('scaleDown').onclick=()=>{ if(activeMesh) activeMesh.scale.multiplyScalar(0.9); };
$('rotY').onclick=()=>{ if(activeMesh) activeMesh.rotation.y += 0.25; };

function renderFiles(files){const ul=$('files'); ul.innerHTML=''; files.forEach(f=>{const li=document.createElement('li'); li.textContent=`${(f.ext||f.extension).toUpperCase()} • ${f.path}`; li.onclick=async()=>{$('inspect').textContent=JSON.stringify(await window.api.inspectFile(f.path),null,2)}; ul.appendChild(li);});}
function refreshStats(files){const c={'.ytd':0,'.ydr':0,'.yft':0,'.meta':0}; files.forEach(f=>{const e=f.ext||f.extension;c[e]=(c[e]||0)+1;}); $('tot').textContent=`Totale: ${files.length}`; $('ytd').textContent=`YTD: ${c['.ytd']}`; $('ydr').textContent=`YDR: ${c['.ydr']}`; $('yft').textContent=`YFT: ${c['.yft']}`; $('meta').textContent=`META: ${c['.meta']}`;}
$('pick').onclick=async()=>{const folder=await window.api.pickFolder(); if(!folder) return; $('folder').textContent=folder; allFiles=await window.api.scanVehicleStream(folder); refreshStats(allFiles); renderFiles(allFiles);};
$('search').oninput=()=>{const q=$('search').value.toLowerCase(); renderFiles(allFiles.filter(f=>f.path.toLowerCase().includes(q)));};

function drawTattooPreview(){const canvas=$('tattooCanvas'); const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#10192a'; ctx.fillRect(0,0,canvas.width,canvas.height); const zones=[['Head',40,30,120,80],['Torso',180,40,180,220],['Left Arm',400,50,140,90],['Right Arm',400,170,140,90],['Left Leg',580,60,120,100],['Right Leg',580,180,120,100]]; ctx.strokeStyle='#2a3650'; zones.forEach(z=>{ctx.strokeRect(z[1],z[2],z[3],z[4]);ctx.fillStyle='#8da0c7';ctx.fillText(z[0],z[1]+8,z[2]+16);}); if(currentTattooImage){let target=[180,40,180,220]; const zone=($('zone').value||'MP_Torso').toLowerCase(); if(zone.includes('head')) target=[40,30,120,80]; else if(zone.includes('leftarm')) target=[400,50,140,90]; else if(zone.includes('rightarm')) target=[400,170,140,90]; else if(zone.includes('leftleg')) target=[580,60,120,100]; else if(zone.includes('rightleg')) target=[580,180,120,100]; ctx.drawImage(currentTattooImage,target[0],target[1],target[2],target[3]);}}
$('pickImg').onclick=async()=>{const p=await window.api.pickImage(); if(!p) return; const src=await window.api.readImageBase64(p); const img=new Image(); img.onload=()=>{currentTattooImage=img; drawTattooPreview(); $('tattooOut').textContent='Preview tattoo generata.';}; img.src=src;};
$('zone').oninput=drawTattooPreview;
$('saveTattoo').onclick=async()=>{$('tattooOut').textContent=JSON.stringify(await window.api.saveTattoo({name:`tattoo_${Date.now()}`,collection:'custom_collection',overlay:'custom_overlay',zone:$('zone').value||'MP_Torso',opacity:1}),null,2)};

drawTattooPreview();
