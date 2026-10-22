/* Datos editables del sitio. No requiere instalar herramientas ni compilar. */
window.SITE_CONFIG = {
  // Horario provisional. Cuando se confirmen los días, incluirlos acá.
  hours: "8 a 22 h",

  // Número internacional, solo dígitos, sin +, espacios ni guiones.
  // Para un celular argentino suele tener el formato 549 + área + número, sin 15.
  // Al completarlo, los dos enlaces de WhatsApp aparecen automáticamente.
  whatsappNumber: "5493412820443",
  whatsappMessage: "Hola, quisiera consultar por Estacionamiento Newbery.",

  // Imágenes de prueba de otra web. Reemplazarlas por fotos reales del lugar.
  // src: miniatura (_thumb). full: imagen grande que se abre al hacer clic.
  // PNG también funciona; full es opcional y, si falta, se usa src.
  photos: [
    {
      src: "./assets/photos/gallery-bathroom_thumb.png",
      full: "./assets/photos/gallery-bathroom.png",
      alt: "Imagen de prueba: baño",
      caption: "Prueba · Baño",
    },
    {
      src: "./assets/photos/gallery-bedroom_thumb.png",
      full: "./assets/photos/gallery-bedroom.png",
      alt: "Imagen de prueba: dormitorio",
      caption: "Prueba · Dormitorio",
    },
    {
      src: "./assets/photos/gallery-desktop_thumb.png",
      full: "./assets/photos/gallery-desktop.png",
      alt: "Imagen de prueba: escritorio",
      caption: "Prueba · Escritorio",
    },
    {
      src: "./assets/photos/gallery-error_thumb.png",
      full: "./assets/photos/gallery-error.png",
      alt: "Imagen de prueba: error",
      caption: "Prueba · Error",
    },
    {
      src: "./assets/photos/gallery-kitchen_thumb.png",
      full: "./assets/photos/gallery-kitchen.png",
      alt: "Imagen de prueba: cocina",
      caption: "Prueba · Cocina",
    },
    {
      src: "./assets/photos/gallery-living_thumb.png",
      full: "./assets/photos/gallery-living.png",
      alt: "Imagen de prueba: living",
      caption: "Prueba · Living",
    },
    {
      src: "./assets/photos/gallery-playroom_thumb.png",
      full: "./assets/photos/gallery-playroom.png",
      alt: "Imagen de prueba: sala de juegos",
      caption: "Prueba · Sala de juegos",
    },
    {
      src: "./assets/photos/gallery-scream_thumb.png",
      full: "./assets/photos/gallery-scream.png",
      alt: "Imagen de prueba: scream",
      caption: "Prueba · Scream",
    },
    {
      src: "./assets/photos/gallery-simon_thumb.png",
      full: "./assets/photos/gallery-simon.png",
      alt: "Imagen de prueba: Simon",
      caption: "Prueba · Simon",
    },
  ],
};
