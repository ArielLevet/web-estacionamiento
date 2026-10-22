# Fotos reales del estacionamiento

Colocá acá las fotos del lugar. Los gráficos provisionales de la galería no representan el estacionamiento.

- Para la imagen ampliada, preferir WebP o JPEG optimizado, de 1600 a 2000 píxeles de ancho.
- Intentar que cada miniatura pese menos de 250 KB. La versión ampliada puede tener más resolución.
- Usar nombres en minúsculas, sin espacios ni acentos (por ejemplo, `entrada.webp`).
- Nombrar las fotos como `01.jpg`, `02.jpg`, `03.jpg` o usar nombres alfabéticos. Se ordenan por nombre con orden numérico natural: `2` va antes de `10`.
- No hace falta editar `site-config.js` ni escribir títulos o descripciones.

Al cargar al menos una foto válida, desaparece el aviso de próximas fotos y aparece la galería. Se puede ampliar con clic, recorrer con las flechas o cerrar con Escape.

## Generar miniaturas por lote

Desde una terminal en la raíz del repo, preparar Python y Pillow una sola vez:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r scripts/requirements.txt
```

Cada vez que agregues, quites o renombres fotos JPG, JPEG, PNG o WebP en esta carpeta, ejecutar:

```powershell
.\.venv\Scripts\python.exe scripts/generate-thumbnails.py
```

El script genera `nombre_thumb.webp` con un ancho máximo de 1000 px y calidad 80. Conserva las proporciones, corrige la orientación de las fotos y no agranda imágenes pequeñas. No modifica los originales ni recorre subcarpetas.

Si ya existe `nombre_thumb` en cualquiera de los formatos admitidos, lo saltea, incluidas las miniaturas PNG de prueba actuales. Los archivos terminados en `_thumb` no se procesan como originales. Evitar originales con el mismo nombre base y distinta extensión: compartirían una miniatura.

Para regenerar una miniatura, borrarla y volver a ejecutar el script. Si hay un archivo dañado, se informa el error y se continúa con los demás.

El script también actualiza `gallery.js` con la lista ordenada de originales y miniaturas. No editar ese archivo a mano. Una miniatura sin su original no aparece en la galería. GitHub Pages no lista carpetas automáticamente: hay que ejecutar el script para actualizar la lista.

Python y Pillow solo se necesitan en tu PC para preparar las fotos; la web sigue siendo estática. Incluir en el commit los originales, las miniaturas y `gallery.js`.
