#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt pyinstaller
pyinstaller --noconfirm --onefile --name DebadgeStudioPro desktop_launcher.py
echo "Build completata. Binario in app/dist/DebadgeStudioPro"
