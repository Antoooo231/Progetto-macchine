# Debadge Studio Pro Desktop

Ho spinto il progetto verso quello che hai chiesto:
- carichi un'immagine e generi preview tattoo per zona corpo
- apri cartella `stream` veicoli e vedi preview tecnica file
- preset debadge e handling preview

## Nuove funzioni desktop
- **Tattoo Creator da immagine** con canvas e mapping zona (`Head`, `Torso`, `LeftArm`, `RightArm`, `LeftLeg`, `RightLeg`).
- **Vehicle Stream Explorer** per `.yft/.ytd/.ydr/.meta` con ricerca live e inspect header.

## Build EXE
```bash
cd desktop-electron
npm install
npm run build
```

> Nota tecnica: un editor 3D completo "tipo ZModeler" richiede pipeline grafica avanzata (parser binari Rockstar + rendering 3D + editing mesh). Questa versione prepara la base UX + preview per arrivarci.
