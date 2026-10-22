"""Prepara fotos ampliadas y miniaturas WebP; actualiza la galería por nombre."""

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


FULL_MAX_SIDE = 1920
THUMB_MAX_WIDTH = 1000
QUALITY = 80
FORMATS = {".jpg", ".jpeg", ".png", ".webp"}
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ORIGINALS = ROOT / "originals"
DEFAULT_OUTPUT = ROOT / "assets" / "photos"


def filename_order(path: Path):
    return [int(part) if part.isdigit() else part.casefold() for part in re.split(r"(\d+)", path.name)]


def save_missing(image: Image.Image, target: Path, thumbnail: bool) -> bool:
    if target.exists():
        print(f"Omitida (ya existe): {target.name}")
        return False
    resized = image.copy()
    if thumbnail:
        if resized.width > THUMB_MAX_WIDTH:
            height = max(1, round(resized.height * THUMB_MAX_WIDTH / resized.width))
            resized = resized.resize((THUMB_MAX_WIDTH, height), Image.Resampling.LANCZOS)
    else:
        resized.thumbnail((FULL_MAX_SIDE, FULL_MAX_SIDE), Image.Resampling.LANCZOS)
    buffer = BytesIO()
    resized.save(buffer, format="WEBP", quality=QUALITY, method=6)
    try:
        # Nunca sobrescribir archivos existentes, tampoco ante ejecuciones simultáneas.
        with target.open("xb") as output:
            output.write(buffer.getvalue())
    except FileExistsError:
        return False
    size_kb = target.stat().st_size / 1024
    print(f"Creada: {target.name} ({resized.width} x {resized.height}, {size_kb:.0f} KB)")
    if not thumbnail and size_kb > 500:
        print("  Supera la referencia de 500 KB; se conserva calidad 80 para revisión visual.")
    return True


def generate(originals: Path, output: Path) -> int:
    if not originals.is_dir():
        print(f"No existe la carpeta de originales: {originals}", file=sys.stderr)
        return 1
    if originals.resolve() == output.resolve():
        print("Los originales y los archivos web deben estar en carpetas distintas.", file=sys.stderr)
        return 1

    files = sorted((path for path in originals.iterdir()
                    if path.is_file() and path.suffix.lower() in FORMATS
                    and not path.stem.lower().endswith("_thumb")), key=filename_order)
    seen = set()
    for source in files:
        if source.stem.casefold() in seen:
            print(f"Nombre base repetido: {source.stem}. Renombrar los originales antes de continuar.", file=sys.stderr)
            return 1
        seen.add(source.stem.casefold())

    output.mkdir(parents=True, exist_ok=True)
    created = skipped = errors = 0
    photos = []

    for source in files:
        full = output / f"{source.stem}.webp"
        thumb = output / f"{source.stem}_thumb.webp"
        try:
            if full.exists() and thumb.exists():
                skipped += 2
                print(f"Omitida (ambas versiones existen): {source.name}")
            else:
                with Image.open(source) as original:
                    image = ImageOps.exif_transpose(original)
                    image = image.convert("RGBA" if image.has_transparency_data else "RGB")
                    for target, is_thumbnail in [(full, False), (thumb, True)]:
                        if save_missing(image, target, is_thumbnail):
                            created += 1
                        else:
                            skipped += 1
            photos.append({
                "src": f"./assets/photos/{quote(thumb.name)}",
                "full": f"./assets/photos/{quote(full.name)}",
            })
        except (OSError, ValueError, Image.DecompressionBombError) as error:
            errors += 1
            print(f"Error en {source.name}: {error}", file=sys.stderr)

    manifest = output / "gallery.js"
    content = "// Generado por scripts/generate-thumbnails.py. No editar a mano.\n"
    content += "window.SITE_PHOTOS = " + json.dumps(photos, ensure_ascii=True, indent=2) + ";\n"
    if not manifest.exists() or manifest.read_text(encoding="utf-8") != content:
        manifest.write_text(content, encoding="utf-8")
    print(f"Resultado: {created} creadas, {skipped} omitidas, {errors} errores. Galería: {len(photos)} fotos.")
    return 1 if errors else 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.parse_args()
    sys.exit(generate(DEFAULT_ORIGINALS, DEFAULT_OUTPUT))
