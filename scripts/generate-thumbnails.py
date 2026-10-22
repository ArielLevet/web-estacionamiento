"""Genera miniaturas faltantes y actualiza la galería por nombre de archivo."""

import argparse
from io import BytesIO
from pathlib import Path
import json
import re
import sys
from urllib.parse import quote

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instalalo con: python -m pip install -r scripts/requirements.txt")


MAX_WIDTH = 1000
QUALITY = 80
FORMATS = {".jpg", ".jpeg", ".png", ".webp"}
DEFAULT_FOLDER = Path(__file__).resolve().parents[1] / "assets" / "photos"


def filename_order(path: Path):
    return [int(part) if part.isdigit() else part.casefold() for part in re.split(r"(\d+)", path.name)]


def generate(folder: Path) -> int:
    if not folder.is_dir():
        print(f"No existe la carpeta: {folder}", file=sys.stderr)
        return 1

    files = sorted((path for path in folder.iterdir() if path.is_file()), key=filename_order)
    thumbnails = {
        path.stem.lower()
        for path in files
        if path.suffix.lower() in FORMATS and path.stem.lower().endswith("_thumb")
    }
    created = skipped = errors = 0
    photos = []

    def add_photo(source: Path):
        candidates = [path for path in folder.iterdir()
                      if path.is_file() and path.suffix.lower() in FORMATS
                      and path.stem.casefold() == f"{source.stem}_thumb".casefold()]
        candidates.sort(key=lambda path: (path.suffix.lower() != ".webp", path.name.casefold()))
        if candidates:
            photos.append({
                "src": f"./assets/photos/{quote(candidates[0].name)}",
                "full": f"./assets/photos/{quote(source.name)}",
            })

    for source in files:
        if source.suffix.lower() not in FORMATS or source.stem.lower().endswith("_thumb"):
            continue
        target = source.with_name(f"{source.stem}_thumb.webp")
        if target.stem.lower() in thumbnails:
            print(f"Omitida (ya existe): {source.name}")
            skipped += 1
            add_photo(source)
            continue
        try:
            with Image.open(source) as original:
                image = ImageOps.exif_transpose(original)
                image = image.convert("RGBA" if image.has_transparency_data else "RGB")
                if image.width > MAX_WIDTH:
                    height = max(1, round(image.height * MAX_WIDTH / image.width))
                    image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)
                buffer = BytesIO()
                image.save(buffer, format="WEBP", quality=QUALITY, method=6)
            # Crear exclusivamente: nunca sobrescribir un archivo existente.
            with target.open("xb") as output:
                output.write(buffer.getvalue())
            thumbnails.add(target.stem.lower())
            created += 1
            print(f"Creada: {target.name} ({image.width} x {image.height}, {target.stat().st_size / 1024:.0f} KB)")
            add_photo(source)
        except FileExistsError:
            skipped += 1
            print(f"Omitida (ya existe): {target.name}")
            add_photo(source)
        except (OSError, ValueError, Image.DecompressionBombError) as error:
            errors += 1
            print(f"Error en {source.name}: {error}", file=sys.stderr)

    manifest = folder / "gallery.js"
    content = "// Generado por scripts/generate-thumbnails.py. No editar a mano.\n"
    content += "window.SITE_PHOTOS = " + json.dumps(photos, ensure_ascii=True, indent=2) + ";\n"
    if not manifest.exists() or manifest.read_text(encoding="utf-8") != content:
        manifest.write_text(content, encoding="utf-8")
    print(f"Resultado: {created} creadas, {skipped} omitidas, {errors} errores. Galería: {len(photos)} fotos.")
    return 1 if errors else 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--folder", type=Path, default=DEFAULT_FOLDER, help="Carpeta de fotos (por defecto: assets/photos).")
    args = parser.parse_args()
    sys.exit(generate(args.folder))
