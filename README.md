# Estacionamiento Newbery

Sitio estático para **Estacionamiento Newbery**, con traslado al aeropuerto. Newbery 9050, Rosario, Santa Fe, Argentina.

HTML, CSS y JavaScript, sin frameworks, paquetes, compilación ni servidor de aplicación. Listo para GitHub Pages desde la raíz del repositorio. Los recursos usan rutas relativas para funcionar tanto bajo `/nombre-del-repo/` como con un dominio propio.

## Ver el sitio

Abrir `index.html` en el navegador. No se necesita instalar nada. También puede usarse Live Server en VS Code o cualquier servidor estático.

## Datos pendientes

La portada de próxima apertura está activa; ver cómo cambiarla en la sección siguiente.

- **Horario provisional:** de 8 a 22 h. No se afirman días de atención. Editar `hours` en `site-config.js`; actualizar también el texto de respaldo en `index.html` si cambia, para visitantes sin JavaScript y buscadores que no lo ejecutan.
- **WhatsApp:** pendiente de comprar el número definitivo. `whatsappNumber` está vacío en `site-config.js`; los enlaces de WhatsApp y llamada permanecen ocultos hasta completarlo.
- **Fotos:** originales en `originals/`; versiones WebP y miniaturas en `assets/photos/`. Ver `assets/photos/README.md` para agregar o actualizar imágenes.
- **Servicios, tarifas y medios de pago:** no se publican hasta confirmar esa información.

## Portada de próxima apertura

La portada está activada con `underConstruction: true` en `site-config.js`. Muestra únicamente el isotipo, el nombre, «Estamos preparando tu lugar», la mención al traslado y la dirección. No tiene botones, horarios, mapa, galería ni contacto.

Para habilitar el sitio completo, cambiar a `underConstruction: false`, guardar y publicar desde GitHub Desktop. Para revisarlo localmente antes del lanzamiento, cambiar ese valor sin publicar el cambio hasta estar listo. Confirmar y completar el número definitivo antes de habilitar el contacto.

La portada es el HTML inicial y el sitio completo permanece dentro de un `<template>` inactivo. Con `false`, JavaScript inserta el sitio y activa sus funciones; con `true`, no carga fotos ni mapa. Si JavaScript está deshabilitado o falla la configuración, se conserva la portada.

Los metadatos son descriptivos y válidos para ambas etapas: nombre, ubicación y traslado, sin horarios ni invitaciones a consultar un número pendiente. No se usa `noindex`; la portada se puede indexar. Esta opción controla la presentación, no el acceso privado a los archivos del repositorio.

## Activar WhatsApp

Los botones de contacto solo se muestran con el sitio completo habilitado (`underConstruction: false`) y un número válido.

Editar `site-config.js` y completar `whatsappNumber` con el número internacional, solo dígitos. Se activa el botón de WhatsApp en Contacto y un botón flotante solo en celular (hasta 760 px de ancho). Ambos abren el mismo chat con el mensaje inicial definido en `whatsappMessage`. En celular se reserva espacio al final de la página para el botón flotante. Usar y verificar el número real antes de publicar; no hay un número ficticio de ejemplo activo.

Contacto tiene una sección propia (`#contacto`), separada de Ubicación (`#ubicacion`) y enlazada desde el menú. El ícono de WhatsApp es un SVG local de Bootstrap Icons, adaptado al azul del sitio; su licencia está en `assets/licenses/bootstrap-icons.txt`.

Debajo de WhatsApp aparece un botón para llamar, con el número visible y un ícono de teléfono. El enlace `tel:` toma el mismo número de `whatsappNumber`; no es necesario mantener otro número por separado.

## Agregar fotos

Guardar los originales JPG, JPEG, PNG o WebP en `originals/`, con nombres como `01.jpg`, `02.jpg`, `03.jpg`, o nombres alfabéticos. Después ejecutar desde la raíz del repo:

Para instalar Python y Pillow, ver las [instrucciones de procesamiento por lote](assets/photos/README.md#generar-miniaturas-por-lote).

```powershell
.\.venv\Scripts\python.exe scripts/generate-thumbnails.py
```

El script genera en `assets/photos/` las versiones faltantes: ampliadas WebP de hasta 1920 px en el lado más largo y miniaturas de hasta 1000 px de ancho, ambas con calidad 80. Conserva los originales, corrige su orientación y no agranda imágenes pequeñas. Las versiones existentes se saltean; para regenerarlas, borrarlas y ejecutar nuevamente.

También actualiza `assets/photos/gallery.js` con la lista ordenada por nombre, con orden numérico natural: `2` va antes de `10`. No hace falta editar `site-config.js` ni escribir títulos o descripciones. Repetir el comando al agregar, quitar o renombrar originales. Incluir en el commit las ampliadas, las miniaturas y `gallery.js`; los originales están excluidos de Git y requieren un respaldo propio. GitHub Pages necesita esa lista generada.

La galería muestra solo imágenes, sin textos debajo. Carga las miniaturas de forma diferida y la imagen grande al abrirla. El visor tiene navegación por flechas, cierre con Escape y retorno del foco al botón original.

La primera foto es la destacada y se carga con prioridad. Con tres o más fotos, la galería muestra una imagen principal grande y dos secundarias al costado; las siguientes continúan en la grilla. Con una o dos fotos, el diseño se adapta para aprovechar todo el ancho. En celular las fotos se reorganizan y se amplían al tocarlas. Las imágenes que no cargan se omiten del recorrido.

## Publicar en GitHub Pages

1. Crear un repositorio en GitHub y subir los archivos de esta carpeta a la rama `main`.
2. En **Settings → Pages → Build and deployment**, elegir **Deploy from a branch**.
3. Seleccionar la rama **main**, carpeta **/ (root)**, y guardar.
4. GitHub mostrará la URL del sitio cuando termine el despliegue. Los cambios posteriores en `main` se publican automáticamente.

No se requiere GitHub Actions personalizado. `.nojekyll` indica que se sirvan los archivos estáticos sin procesar con Jekyll.

Si se usa el plan gratuito de GitHub, el repositorio debe ser público para usar Pages. Otros planes permiten repositorios privados; consultar las condiciones vigentes de GitHub.

[Guía oficial de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Agregar el dominio cuando se compre

1. Verificar el dominio en GitHub y configurarlo en **Settings → Pages → Custom domain**.
2. Configurar los registros DNS en el proveedor siguiendo la guía oficial para el dominio raíz y/o `www`. Para `www`, el CNAME apunta a `USUARIO.github.io`, sin el nombre del repositorio.
3. Al guardar el dominio, GitHub agrega un archivo `CNAME` a la raíz de la rama. Conservar ese archivo en los cambios siguientes.
4. Cuando se emita el certificado, activar **Enforce HTTPS**.
5. Agregar la URL definitiva como etiqueta `canonical`, `og:url`, propiedad `url` del JSON-LD y como base de la URL absoluta de `og:image` en `index.html`.

El dominio se configura en GitHub y en DNS; no requiere cambiar los enlaces internos del sitio. No se incluye un archivo `CNAME` con un dominio ficticio.

[Guía oficial de dominio propio](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) · [HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Buscadores y vista previa al compartir

El título, `meta description` y las etiquetas Open Graph se mantienen directamente en el `<head>` de `index.html`. JavaScript actualiza los horarios visibles, pero no reemplaza las descripciones. Estas describen ubicación y servicios sin incluir horarios provisionales.

El bloque JSON-LD `LocalBusiness` declara el nombre, la descripción y la dirección del negocio con datos que también aparecen en la página. Si cambia la dirección o los servicios, revisar ese bloque junto con los textos visibles. El teléfono se sigue editando únicamente en `site-config.js`; todavía no se duplica en el JSON-LD. No se declaran días de apertura, coordenadas ni tarifas sin confirmar.

Al definir la URL pública y publicar:

1. Completar `canonical`, `og:url`, `og:image` (URL absoluta de una imagen representativa) y la propiedad `url` del JSON-LD.
2. Verificar el sitio en Google Search Console e inspeccionar la URL publicada para solicitar su indexación y comprobar que Google pueda acceder a ella.
3. Validar los datos estructurados con la [prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results).
4. Crear o completar el Perfil de Empresa de Google con el mismo nombre, dirección y teléfono, horarios confirmados, categoría adecuada, fotos y enlace al sitio. Verificar su titularidad desde la cuenta del negocio y mantener los datos actualizados.

Los metadatos y el JSON-LD no garantizan una posición ni un aspecto específico del resultado. Google puede elegir otro fragmento de la página según la búsqueda. Referencias: [descripciones](https://developers.google.com/search/docs/appearance/snippet?hl=es), [datos de negocios locales](https://developers.google.com/search/docs/appearance/structured-data/local-business?hl=es) y [visibilidad local](https://support.google.com/business/answer/7091?hl=es).

## Diseño y accesibilidad

Diseño adaptable a celular, tablet y escritorio, con fondo claro, texto oscuro, azul profundo y acentos celestes. La marca usa la E de estacionamiento y la portada destaca el traslado al aeropuerto junto al lema «Dejá el auto. Seguí tu viaje». La galería ocupa el ancho principal, inmediatamente después de una portada breve. Tipografías del sistema. Ubicación incluye un mapa pequeño de Google Maps embebido en un iframe adaptable, de 240 px de alto y con carga diferida (`loading="lazy"`). La dirección del mapa se edita en el atributo `src` del iframe en `index.html`. El botón «Cómo llegar» abre las indicaciones en una pestaña nueva y sigue disponible si el mapa no carga. El sitio no envía formularios; el mapa carga contenido de Google, sujeto a sus políticas de privacidad y cookies. Los controles tienen foco visible y se respeta la preferencia de movimiento reducido.
