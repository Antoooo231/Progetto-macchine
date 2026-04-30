from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ALLOWED_EXTENSIONS = {".ytd", ".ydr", ".yft"}
DATA_DIR = Path(__file__).parent / ".data"
PRESETS_FILE = DATA_DIR / "presets.json"

app = FastAPI(title="Debadge Studio API", version="0.2.0")


class ScanRequest(BaseModel):
    root_path: str = Field(..., description="Percorso root GTA/FiveM")


class FileEntry(BaseModel):
    path: str
    extension: Literal[".ytd", ".ydr", ".yft"]
    size_bytes: int


class FileSummary(BaseModel):
    root_path: str
    total: int
    by_extension: dict[str, int]
    files: list[FileEntry]


class FileInspectResponse(BaseModel):
    path: str
    extension: str
    size_bytes: int
    magic: str
    header_hex: str


class DebadgePreset(BaseModel):
    name: str
    remove_livery: bool = True
    disable_extra_badges: list[int] = Field(default_factory=lambda: [1, 2, 3])
    mod_type_removals: list[int] = Field(default_factory=lambda: [48])


class DebadgePlanRequest(BaseModel):
    model_hash: str
    selected_preset: str


class DebadgePlanResponse(BaseModel):
    model_hash: str
    preset_name: str
    operations: list[str]


def _safe_path(path_str: str) -> Path:
    path = Path(path_str).expanduser().resolve()
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Path non trovato: {path}")
    if not path.is_dir():
        raise HTTPException(status_code=400, detail="Il path deve essere una directory")
    return path


def _load_presets() -> list[DebadgePreset]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not PRESETS_FILE.exists():
        default = [DebadgePreset(name="default")]
        PRESETS_FILE.write_text(json.dumps([x.model_dump() for x in default], indent=2), encoding="utf-8")
        return default

    raw = json.loads(PRESETS_FILE.read_text(encoding="utf-8"))
    return [DebadgePreset(**item) for item in raw]


def _save_presets(presets: list[DebadgePreset]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PRESETS_FILE.write_text(json.dumps([x.model_dump() for x in presets], indent=2), encoding="utf-8")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/scan", response_model=FileSummary)
def scan_files(payload: ScanRequest) -> FileSummary:
    root = _safe_path(payload.root_path)

    results: list[FileEntry] = []
    counters = {".ytd": 0, ".ydr": 0, ".yft": 0}

    for file in root.rglob("*"):
        if not file.is_file():
            continue
        ext = file.suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue
        size = file.stat().st_size
        counters[ext] += 1
        results.append(FileEntry(path=str(file), extension=ext, size_bytes=size))

    return FileSummary(
        root_path=str(root),
        total=len(results),
        by_extension=counters,
        files=sorted(results, key=lambda x: x.path.lower()),
    )


@app.get("/inspect", response_model=FileInspectResponse)
def inspect_file(path: str) -> FileInspectResponse:
    file = Path(path).expanduser().resolve()
    if not file.exists() or not file.is_file():
        raise HTTPException(status_code=404, detail="File non trovato")

    ext = file.suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Estensione non supportata")

    raw = file.read_bytes()[:64]
    return FileInspectResponse(
        path=str(file),
        extension=ext,
        size_bytes=file.stat().st_size,
        magic=raw[:4].decode("latin-1", errors="replace"),
        header_hex=raw.hex(" "),
    )


@app.get("/presets", response_model=list[DebadgePreset])
def list_presets() -> list[DebadgePreset]:
    return _load_presets()


@app.post("/presets", response_model=list[DebadgePreset])
def upsert_preset(preset: DebadgePreset) -> list[DebadgePreset]:
    presets = _load_presets()
    filtered = [p for p in presets if p.name.lower() != preset.name.lower()]
    filtered.append(preset)
    _save_presets(filtered)
    return filtered


@app.post("/plan", response_model=DebadgePlanResponse)
def build_debadge_plan(payload: DebadgePlanRequest) -> DebadgePlanResponse:
    presets = _load_presets()
    preset = next((p for p in presets if p.name.lower() == payload.selected_preset.lower()), None)
    if not preset:
        raise HTTPException(status_code=404, detail="Preset non trovato")

    operations: list[str] = []
    if preset.remove_livery:
        operations.append("SetVehicleLivery(vehicle, 0)")
    operations.extend([f"SetVehicleExtra(vehicle, {x}, 1)" for x in preset.disable_extra_badges])
    operations.extend([f"SetVehicleMod(vehicle, {x}, -1, false)" for x in preset.mod_type_removals])

    return DebadgePlanResponse(
        model_hash=payload.model_hash,
        preset_name=preset.name,
        operations=operations,
    )


@app.get("/export/lua")
def export_lua(preset_name: str) -> dict[str, str]:
    presets = _load_presets()
    preset = next((p for p in presets if p.name.lower() == preset_name.lower()), None)
    if not preset:
        raise HTTPException(status_code=404, detail="Preset non trovato")

    lua = ["-- Generated by Debadge Studio external app", "local preset = {}"]
    lua.append(f"preset.removeLivery = {'true' if preset.remove_livery else 'false'}")
    lua.append("preset.disableExtraBadges = {" + ",".join(str(x) for x in preset.disable_extra_badges) + "}")
    lua.append("preset.modTypeRemovals = {" + ",".join(str(x) for x in preset.mod_type_removals) + "}")
    return {"preset_name": preset.name, "lua": "\n".join(lua)}
