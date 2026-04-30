# Debadge Studio Pro - EXE pronta

Perfetto, ho preparato la versione **desktop avviabile** con build EXE.

## Cosa hai adesso
- App esterna con backend FastAPI + frontend UI.
- Launcher desktop (`app/desktop_launcher.py`) che avvia tutto e apre il browser da solo.
- Script build EXE Windows: `app/build_exe.bat`.
- Script build Linux/macOS: `app/build_exe.sh`.

## Come fare l'EXE (Windows)
1. Apri `cmd`.
2. Vai in `app`.
3. Esegui:
   ```bat
   build_exe.bat
   ```
4. Trovi il file in:
   `app\dist\DebadgeStudioPro.exe`

## Avvio sviluppo
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
