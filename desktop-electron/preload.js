const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  scanFiles: (p) => ipcRenderer.invoke('scan-files', p),
  inspectFile: (p) => ipcRenderer.invoke('inspect-file', p),
  listDebadge: () => ipcRenderer.invoke('list-debadge'),
  saveDebadge: (p) => ipcRenderer.invoke('save-debadge', p),
  listTattoo: () => ipcRenderer.invoke('list-tattoo'),
  saveTattoo: (p) => ipcRenderer.invoke('save-tattoo', p),
  handlingPreview: (p) => ipcRenderer.invoke('handling-preview', p),
  pickImage: () => ipcRenderer.invoke('pick-image'),
  readImageBase64: (p) => ipcRenderer.invoke('read-image-base64', p),
  scanVehicleStream: (p) => ipcRenderer.invoke('scan-vehicle-stream', p),
});
