const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(app.getPath('userData'), 'data');
const presetsFile = path.join(dataDir, 'debadge.json');
const tattoosFile = path.join(dataDir, 'tattoos.json');

function ensureFile(file, def = []) { fs.mkdirSync(dataDir, { recursive: true }); if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(def, null, 2)); }
function readJson(file) { ensureFile(file); return JSON.parse(fs.readFileSync(file, 'utf-8')); }
function writeJson(file, data) { ensureFile(file); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

function createWindow() {
  const win = new BrowserWindow({ width: 1300, height: 900, webPreferences: { preload: path.join(__dirname, 'preload.js') } });
  win.loadFile('renderer.html');
}

ipcMain.handle('pick-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('scan-files', async (_, rootPath) => {
  const exts = new Set(['.ytd', '.ydr', '.yft', '.meta']);
  const results = [];
  function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else if (exts.has(path.extname(full).toLowerCase())) results.push({ path: full, extension: path.extname(full).toLowerCase(), size_bytes: st.size });
    }
  }
  walk(rootPath);
  return results;
});

ipcMain.handle('inspect-file', async (_, filePath) => {
  const raw = fs.readFileSync(filePath).subarray(0, 128);
  return { path: filePath, size_bytes: fs.statSync(filePath).size, extension: path.extname(filePath), magic: raw.subarray(0,4).toString('latin1'), header_hex: raw.toString('hex').match(/.{1,2}/g).join(' ') };
});
ipcMain.handle('list-debadge', ()=> readJson(presetsFile));
ipcMain.handle('save-debadge', (_, preset)=>{ const data=readJson(presetsFile).filter(x=>x.name!==preset.name); data.push(preset); writeJson(presetsFile,data); return data;});
ipcMain.handle('list-tattoo', ()=> readJson(tattoosFile));
ipcMain.handle('save-tattoo', (_, preset)=>{ const data=readJson(tattoosFile).filter(x=>x.name!==preset.name); data.push(preset); writeJson(tattoosFile,data); return data;});
ipcMain.handle('handling-preview', (_, p)=> ({ top_speed_index: Number(((p.fInitialDriveForce*380)/(Math.max(0.1,p.fMass/1000))).toFixed(2)), stability_index: Number(((p.fTractionCurveMax*100)/(Math.max(0.1,p.fMass/1000))).toFixed(2)), braking_index: Number((p.fBrakeForce*100).toFixed(2)) }));

app.whenReady().then(createWindow);
