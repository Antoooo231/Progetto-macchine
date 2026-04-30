# Roadmap: da MVP a piattaforma completa stile zoov.dev

## Fase 1 (questa delivery)
- Scanner file `.ytd/.ydr/.yft` su path locale senza export manuale.
- UI con archivio, ricerca, preview metadati header.
- Script FiveM runtime per preset debadge rapido.

## Fase 2
- Parser strutturati per chunk drawable/texture dictionary.
- Anteprima 3D (`three.js`) per mesh (`.ydr/.yft`) con orbit controls.
- Anteprima texture (`.ytd`) con mipmap inspector.
- Profili progetto e salvataggio workspace.

## Fase 3
- Modifiche non distruttive: patch graph + undo/redo.
- Editor regole debadge per veicolo (hash model, livery id, extras).
- Esportazione pacchetti resource FiveM automatica.

## Fase 4
- Apertura diretta archivi `RPF` (lettura indice + stream assets).
- Batch AI assistito per naming e cleanup materiali.
- Marketplace preset / collaborazione team.

## KPI di qualità
- TTFP (time to first preview) < 4s su cartella con 10k file.
- Crash-free session > 99.5%.
- Undo affidabile 100% operazioni supportate.
