# Fotos preparadas para la web

Esta carpeta contiene solo las ampliadas WebP, sus miniaturas y la lista `gallery.js`. Los originales se guardan en `originals/`, en la raíz del repo.

- Guardar los originales JPG, JPEG, PNG o WebP en `originals/`. Nombrarlos como `01.jpg`, `02.jpg`, `03.jpg` o usar nombres alfabéticos. Se ordenan por nombre con orden numérico natural: `2` va antes de `10`.
- No hace falta editar `site-config.js` ni escribir títulos o descripciones.

Al cargar al menos una foto válida, desaparece el aviso de próximas fotos y aparece la galería. Se puede ampliar con clic, recorrer con las flechas o cerrar con Escape.

## Generar miniaturas por lote

Desde una terminal en la raíz del repo, preparar Python y Pillow una sola vez:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r scripts/requirements.txt
```

Cada vez que agregues, quites o renombres fotos en `originals/`, ejecutar:

```powershell
.\.venv\Scripts\python.exe scripts/generate-thumbnails.py
```

Para cada original `nombre.jpg`, el script genera acá:

- `nombre.webp`: ampliada de hasta **1920 px en el lado más largo**, calidad **80**.
- `nombre_thumb.webp`: miniatura de hasta **1000 px de ancho**, calidad **80**.

Ambas se crean desde el original, conservan proporciones, corrigen la orientación y no agrandan fotos pequeñas. Los originales no se modifican ni se recorren subcarpetas. El peso depende del detalle de la foto: se busca aproximadamente 200–350 KB por ampliada; si supera 500 KB se informa para revisión, sin bajar automáticamente la calidad.

Si una versión ya existe, se saltea. Para regenerarla, borrarla y ejecutar nuevamente. Si modificás un original manteniendo su nombre, borrar sus dos versiones para actualizarlas. Los nombres base repetidos (por ejemplo `01.jpg` y `01.png`) se rechazan antes de procesar nada. El sufijo `_thumb` está reservado para miniaturas.

El script también actualiza `gallery.js` con la lista ordenada de las versiones web. No editar ese archivo a mano. Si se borra o renombra un original, sus versiones anteriores dejan de aparecer en la lista pero se conservan en disco; se pueden borrar manualmente. Si un original falla, se informa el error y se continúa con los demás.

Python y Pillow solo se necesitan en tu PC para preparar las fotos; la web sigue siendo estática. GitHub Pages no lista carpetas automáticamente: ejecutar el script y subir las ampliadas, las miniaturas y `gallery.js`. Los originales están excluidos de Git: mantener un respaldo propio.
