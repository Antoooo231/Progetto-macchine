from __future__ import annotations

import threading
import time
import webbrowser
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT / "frontend"


def run_backend() -> None:
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8090, reload=False, log_level="info")


def run_frontend() -> None:
    import http.server
    import socketserver

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    with socketserver.TCPServer(("127.0.0.1", 5173), Handler) as httpd:
        httpd.serve_forever()


def main() -> None:
    threading.Thread(target=run_backend, daemon=True).start()
    threading.Thread(target=run_frontend, daemon=True).start()
    time.sleep(1.5)
    webbrowser.open("http://127.0.0.1:5173")

    print("Debadge Studio Pro avviato. Chiudi questa finestra per terminare.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Chiusura...")


if __name__ == "__main__":
    main()
