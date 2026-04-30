# Debadge Studio Pro - App esterna completa (base)

Ho esteso l'app esterna per coprire quello che hai chiesto:
- debadge auto
- preset tattoo per FiveM (collection/overlay/zone)
- handling.meta editor con preview indici
- export XML handling item
- scan e preview file GTA/FiveM

## Endpoint principali
- `POST /scan`
- `GET/POST /presets/debadge`
- `GET/POST /presets/tattoos`
- `POST /handling/preview`
- `POST /handling/export-meta`

## Avvio
```bash
cd app/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8090
```

```bash
cd app/frontend
python3 -m http.server 5173
```
