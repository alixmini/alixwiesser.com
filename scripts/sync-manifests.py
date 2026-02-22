#!/usr/bin/env python3
"""
Regenerate `list.json` files for each category by scanning the category `/images` folders.
Run from the repository root or directly: `python3 scripts/sync-manifests.py`.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATEGORIES = ["internet", "irl", "making"]

def main():
    for cat in CATEGORIES:
        images_dir = ROOT / cat / 'images'
        if not images_dir.exists():
            print(f"skipping missing: {images_dir}")
            continue
        pngs = sorted([p.name for p in images_dir.iterdir() if p.suffix.lower() == '.png'])
        out = images_dir / 'list.json'
        with out.open('w') as fh:
            json.dump(pngs, fh)
        print(f"wrote {out} ({len(pngs)} entries)")

if __name__ == '__main__':
    main()
