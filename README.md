# Estacionamiento Newbery

Sitio estático para **Estacionamiento Newbery**, con traslado al aeropuerto. Newbery 9050, Rosario, Santa Fe, Argentina.

HTML, CSS y JavaScript, sin frameworks, paquetes, compilación ni servidor de aplicación. Listo para GitHub Pages desde la raíz del repositorio. Los recursos usan rutas relativas para funcionar tanto bajo `/nombre-del-repo/` como con un dominio propio.

## Ver el sitio

Abrir `index.html` en el navegador. No se necesita instalar nada. También puede usarse Live Server en VS Code o cualquier servidor estático.

## Datos pendientes

- **Horario provisional:** de 8 a 22 h. No se afirman días de atención. Editar `hours` en `site-config.js`; actualizar también el texto de respaldo en `index.html` si cambia, para visitantes sin JavaScript y buscadores que no lo ejecutan.
- **WhatsApp:** configurado como `5493412820443` (+54 9 341 282-0443). Para cambiarlo, editar `whatsappNumber` en `site-config.js`. Si el campo queda vacío, los enlaces se ocultan.
- **Fotos:** pendientes de imágenes reales. La galería está implementada; muestra un aviso hasta cargar fotos. Ver `assets/photos/README.md`.
- **Servicios, tarifas y medios de pago:** no se publican hasta confirmar esa información.

## Activar WhatsApp

Editar `site-config.js` y completar `whatsappNumber` con el número internacional, solo dígitos. Se activa el botón de WhatsApp en Contacto y un botón flotante solo en celular (hasta 760 px de ancho). Ambos abren el mismo chat con el mensaje inicial definido en `whatsappMessage`. En celular se reserva espacio al final de la página para el botón flotante. Usar y verificar el número real antes de publicar; no hay un número ficticio de ejemplo activo.

Contacto tiene una sección propia (`#contacto`), separada de Ubicación (`#ubicacion`) y enlazada desde el menú. El ícono de WhatsApp es un SVG local de Bootstrap Icons, adaptado al azul del sitio; su licencia está en `assets/licenses/bootstrap-icons.txt`.

Debajo de WhatsApp aparece un botón para llamar, con el número visible y un ícono de teléfono. El enlace `tel:` toma el mismo número de `whatsappNumber`; no es necesario mantener otro número por separado.

## Agregar fotos

Guardar los archivos en `assets/photos/` y completar el arreglo `photos`:

```js
photos: [
  {
    src: "./assets/photos/entrada.webp",
    full: "./assets/photos/entrada-grande.webp",
    alt: "Entrada del Estacionamiento Newbery",
    caption: "La entrada",
  },
],
```

Los archivos del ejemplo deben existir. `full` y `caption` son opcionales. La galería carga las miniaturas de forma diferida y la imagen grande al abrirla. El visor tiene navegación por flechas, cierre con Escape y retorno del foco al botón original.

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
5. Agregar la URL definitiva como etiqueta `canonical`, `og:url` y, si se desea, la imagen social absoluta en `index.html`.

El dominio se configura en GitHub y en DNS; no requiere cambiar los enlaces internos del sitio. No se incluye un archivo `CNAME` con un dominio ficticio.

[Guía oficial de dominio propio](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) · [HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Diseño y accesibilidad

Diseño adaptable a celular, tablet y escritorio, con fondo claro, texto oscuro, azul profundo y acentos celestes. La marca usa la E de estacionamiento y la portada destaca el traslado al aeropuerto junto al lema «Dejá el auto. Seguí tu viaje». La galería ocupa el ancho principal, inmediatamente después de una portada breve. Tipografías del sistema y ausencia de mapas incrustados o scripts de terceros para mantener la carga liviana. Google Maps se abre únicamente al elegir cómo llegar. El sitio no instala cookies ni envía formularios. Los controles tienen foco visible y se respeta la preferencia de movimiento reducido.
