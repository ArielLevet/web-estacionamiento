# Originales de las fotos

Guardar acá los originales JPG, JPEG, PNG o WebP con nombres como `01.jpg`, `02.jpg`, `03.jpg` o nombres alfabéticos. Evitar el mismo nombre base con distinta extensión y reservar `_thumb` para las miniaturas.

Desde la raíz del repo, ejecutar:

```powershell
.\.venv\Scripts\python.exe scripts/generate-thumbnails.py
```

Las ampliadas y miniaturas se generan en `assets/photos/`, junto con la lista ordenada `gallery.js`. No hace falta editar JavaScript.

Los originales no se modifican y están excluidos de Git. Conservar una copia de respaldo propia: no se recuperan al clonar el repo en otra PC. Las fotos que usa la web sí se incluyen en Git.

Ver [los detalles del procesamiento](../assets/photos/README.md).
