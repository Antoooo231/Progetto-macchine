# Debadge Studio Pro Desktop (senza Python runtime)

Hai ragione: vuoi un'app desktop vera da aprire sul desktop, non "la cosa con python".

## Nuova soluzione
Ho aggiunto una versione **Electron Desktop** in `desktop-electron/`:
- Finestra desktop nativa.
- Scanner file `.ytd/.ydr/.yft/.meta`.
- Preview header/magic.
- Preset debadge e tattoo persistenti.
- Preview handling.

## Build EXE (Windows)
```bash
cd desktop-electron
npm install
npm run build
```
Output: `desktop-electron/dist/DebadgeStudioPro*.exe`

## Avvio sviluppo desktop
```bash
cd desktop-electron
npm install
npm start
```
