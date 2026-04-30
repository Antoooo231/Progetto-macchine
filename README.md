# Debadge Studio (App esterna per FiveM / GTA V)

Perfetto: questa versione è orientata a **app esterna**, non UI dentro FiveM.

## Cosa fa ora
- App esterna (backend + frontend locale) per:
  - scansione `.ytd/.ydr/.yft`
  - preview tecnica file
  - creazione/gestione preset debadge
  - generazione piano operazioni
  - export snippet Lua (`/export/lua`) da portare su FiveM
- Resource FiveM minimale che applica preset via comando/evento (`/debadge` o `debadge:applyPreset`).

## Avvio app esterna
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

## Flusso consigliato
1. Crei preset nell'app esterna.
2. Esporti Lua con **Export Lua**.
3. Usi preset esportato nella tua pipeline/resource FiveM.
