# Debadge Studio Pro - SOLO App Esterna

Ricevuto: non ti servono i file FiveM.
Ho quindi rimosso tutta la parte resource/script in-game e lasciato il progetto focalizzato su una app esterna fatta bene.

## Moduli disponibili
1. **Asset Browser + Preview** (`.ytd/.ydr/.yft/.meta`) con inspect header/magic.
2. **Debadge Preset Builder** con salvataggio/lista preset.
3. **Tattoo Builder** con `collection`, `overlay`, `zone`, `opacity`.
4. **Handling.meta Editor** con preview indici e export XML item.

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
