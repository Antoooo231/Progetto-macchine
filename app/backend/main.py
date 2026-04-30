from __future__ import annotations

import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ALLOWED_EXTENSIONS = {".ytd", ".ydr", ".yft", ".meta"}
DATA_DIR = Path(__file__).parent / ".data"
PRESETS_FILE = DATA_DIR / "presets.json"
TATTOOS_FILE = DATA_DIR / "tattoos.json"

app = FastAPI(title="Debadge Studio API", version="0.4.0")


class ScanRequest(BaseModel):
    root_path: str


class FileEntry(BaseModel):
    path: str
    extension: str
    size_bytes: int


class FileSummary(BaseModel):
    root_path: str
    total: int
    by_extension: dict[str, int]
    files: list[FileEntry]


class DebadgePreset(BaseModel):
    name: str
    remove_livery: bool = True
    disable_extra_badges: list[int] = Field(default_factory=lambda: [1, 2, 3])
    mod_type_removals: list[int] = Field(default_factory=lambda: [48])


class TattooPreset(BaseModel):
    name: str
    collection: str
    overlay: str
    zone: str
    opacity: float = 1.0


class HandlingPreset(BaseModel):
    model_name: str
    fMass: float
    fInitialDriveForce: float
    fBrakeForce: float
    fTractionCurveMax: float


def _safe_path(path_str: str) -> Path:
    path = Path(path_str).expanduser().resolve()
    if not path.exists() or not path.is_dir():
        raise HTTPException(status_code=404, detail="Directory non valida")
    return path


def _read_json(path: Path, default: list[dict]) -> list[dict]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(json.dumps(default, indent=2), encoding="utf-8")
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, data: list[dict]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.post('/scan', response_model=FileSummary)
def scan(payload: ScanRequest) -> FileSummary:
    root = _safe_path(payload.root_path)
    counters: dict[str, int] = {'.ytd': 0, '.ydr': 0, '.yft': 0, '.meta': 0}
    files: list[FileEntry] = []
    for file in root.rglob('*'):
        if file.is_file() and file.suffix.lower() in ALLOWED_EXTENSIONS:
            ext = file.suffix.lower()
            counters[ext] = counters.get(ext, 0) + 1
            files.append(FileEntry(path=str(file), extension=ext, size_bytes=file.stat().st_size))
    return FileSummary(root_path=str(root), total=len(files), by_extension=counters, files=files)


@app.get('/presets/debadge', response_model=list[DebadgePreset])
def list_debadge() -> list[DebadgePreset]:
    raw = _read_json(PRESETS_FILE, [DebadgePreset(name='default').model_dump()])
    return [DebadgePreset(**x) for x in raw]


@app.post('/presets/debadge', response_model=list[DebadgePreset])
def save_debadge(preset: DebadgePreset) -> list[DebadgePreset]:
    data = [x for x in _read_json(PRESETS_FILE, []) if x.get('name', '').lower() != preset.name.lower()]
    data.append(preset.model_dump())
    _write_json(PRESETS_FILE, data)
    return [DebadgePreset(**x) for x in data]


@app.get('/presets/tattoos', response_model=list[TattooPreset])
def list_tattoos() -> list[TattooPreset]:
    raw = _read_json(TATTOOS_FILE, [])
    return [TattooPreset(**x) for x in raw]


@app.post('/presets/tattoos', response_model=list[TattooPreset])
def save_tattoo(preset: TattooPreset) -> list[TattooPreset]:
    data = [x for x in _read_json(TATTOOS_FILE, []) if x.get('name', '').lower() != preset.name.lower()]
    data.append(preset.model_dump())
    _write_json(TATTOOS_FILE, data)
    return [TattooPreset(**x) for x in data]


@app.post('/handling/preview')
def handling_preview(preset: HandlingPreset) -> dict[str, float | str]:
    top_speed_index = round((preset.fInitialDriveForce * 380) / max(0.1, preset.fMass / 1000), 2)
    stability_index = round((preset.fTractionCurveMax * 100) / max(0.1, preset.fMass / 1000), 2)
    braking_index = round(preset.fBrakeForce * 100, 2)
    return {
        'model_name': preset.model_name,
        'top_speed_index': top_speed_index,
        'stability_index': stability_index,
        'braking_index': braking_index,
    }


@app.post('/handling/export-meta')
def export_handling_meta(preset: HandlingPreset) -> dict[str, str]:
    handling = ET.Element('Item', {'type': 'CHandlingData'})
    ET.SubElement(handling, 'handlingName').text = preset.model_name.upper()
    ET.SubElement(handling, 'fMass', {'value': str(preset.fMass)})
    ET.SubElement(handling, 'fInitialDriveForce', {'value': str(preset.fInitialDriveForce)})
    ET.SubElement(handling, 'fBrakeForce', {'value': str(preset.fBrakeForce)})
    ET.SubElement(handling, 'fTractionCurveMax', {'value': str(preset.fTractionCurveMax)})
    xml = ET.tostring(handling, encoding='unicode')
    return {'file_name': f'{preset.model_name}_handling_item.xml', 'xml': xml}
