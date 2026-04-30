@echo off
setlocal

cd /d %~dp0

if not exist .venv (
  py -m venv .venv
)

call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r backend\requirements.txt pyinstaller

pyinstaller --noconfirm --onefile --name DebadgeStudioPro desktop_launcher.py

echo.
echo Build completata. EXE disponibile in app\dist\DebadgeStudioPro.exe
pause
