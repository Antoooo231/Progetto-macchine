const api = "http://localhost:8090";
let files = [];

const $ = (id) => document.getElementById(id);

async function scan() {
  const root_path = $("rootPath").value.trim();
  if (!root_path) return;
  const res = await fetch(`${api}/scan`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ root_path }) });
  const data = await res.json();
  if (!res.ok) return ($("preview").textContent = JSON.stringify(data, null, 2));

  files = data.files;
  $("total").textContent = data.total;
  $("ytd").textContent = data.by_extension[".ytd"];
  $("ydr").textContent = data.by_extension[".ydr"];
  $("yft").textContent = data.by_extension[".yft"];
  renderList(files);
}

function renderList(list) {
  const fileList = $("fileList");
  fileList.innerHTML = "";
  list.forEach((file) => {
    const li = document.createElement("li");
    li.textContent = `${file.extension.toUpperCase()} • ${file.path}`;
    li.onclick = () => inspect(file.path);
    fileList.appendChild(li);
  });
}

async function inspect(path) {
  const res = await fetch(`${api}/inspect?path=${encodeURIComponent(path)}`);
  const data = await res.json();
  $("preview").textContent = JSON.stringify(data, null, 2);
}

async function loadPresets() {
  const res = await fetch(`${api}/presets`);
  const presets = await res.json();
  const list = $("presetList");
  list.innerHTML = "";
  presets.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} → extras [${p.disable_extra_badges.join(",")}] / modType [${p.mod_type_removals.join(",")}]`;
    list.appendChild(li);
  });
}

async function savePreset() {
  const name = $("presetName").value.trim();
  if (!name) return;
  await fetch(`${api}/presets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, remove_livery: true, disable_extra_badges: [1, 2, 3], mod_type_removals: [48] }),
  });
  await loadPresets();
}

async function buildPlan() {
  const model_hash = $("modelHash").value.trim();
  const selected_preset = $("selectedPreset").value.trim();
  const res = await fetch(`${api}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model_hash, selected_preset }),
  });
  const data = await res.json();
  $("planOut").textContent = JSON.stringify(data, null, 2);
}

$("scanBtn").onclick = scan;
$("savePresetBtn").onclick = savePreset;
$("planBtn").onclick = buildPlan;
$("exportLuaBtn").onclick = exportLua;
$("search").oninput = () => {
  const q = $("search").value.toLowerCase();
  renderList(files.filter((f) => f.path.toLowerCase().includes(q)));
};

loadPresets();


async function exportLua() {
  const preset = $("exportPreset").value.trim();
  if (!preset) return;
  const res = await fetch(`${api}/export/lua?preset_name=${encodeURIComponent(preset)}`);
  const data = await res.json();
  $("luaOut").textContent = data.lua || JSON.stringify(data, null, 2);
}
