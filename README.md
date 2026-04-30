# Debadge Studio Pro Desktop

Ora puoi davvero aprire un modello 3D del veicolo e modificarlo a livello base dentro l'app.

## Nuove funzioni 3D
- Apertura modello `.glb/.gltf` da desktop.
- Viewer 3D con orbit camera.
- Modifiche immediate: colore materiale, scala, rotazione.
- Stream explorer per file veicolo (`.yft/.ydr/.ytd/.meta`) con preview tecnica.
- Tattoo da immagine con preview per zona corpo.

## Build EXE
```bash
cd desktop-electron
npm install
npm run build
```

> Nota: editing avanzato completo tipo ZModeler (mesh/vertex/rig full) richiede moduli 3D dedicati aggiuntivi. Questa base ora include preview e modifiche visuali reali in-app.
