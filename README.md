# Debadge Studio (FiveM / GTA V)

Sì: **si può fare quello che hai chiesto**, ma va costruito per fasi.
Questa repo ora include una base più completa con scanner asset, OPreview tecnico, gestione preset e generatore piano Lua per FiveM.

## Funzioni già incluse
- Scansione diretta cartelle GTA/FiveM per `.ytd`, `.ydr`, `.yft`.
- OPreview file (magic/header hex/size).
- Gestione preset debadge (salvataggio/lista).
- Generazione piano operazioni Lua da preset (`/plan`).
- Risorsa FiveM con comando `/debadge`.

## Avvio rapido
### Backend
```bash
cd app/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8090
```

### Frontend
```bash
cd app/frontend
python3 -m http.server 5173
```
Apri `http://localhost:5173`.

## Stato reale vs obiettivo finale
Per avere app "fantastica" stile piattaforma professionale (preview 3D completa, editing mesh/materiali avanzato, apertura RPF totale senza export), serve la roadmap in `docs/roadmap.md`.


### FiveM manifest
Se avvii direttamente questa cartella come resource, ora è presente anche un `fxmanifest.lua` in root che punta agli script dentro `fivem-resource/`.


## In game (UI)
- Usa `/debadge` oppure premi `F6` per aprire la UI NUI.
- Dalla UI premi **Applica preset** per eseguire il debadge sul veicolo che stai guidando.
- Se non vedi la chat, il feedback compare anche come notifica GTA in alto a sinistra.
