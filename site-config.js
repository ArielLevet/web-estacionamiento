/* Datos editables del sitio. No requiere instalar herramientas ni compilar. */
window.SITE_CONFIG = {
  // true: portada de próxima apertura. false: sitio completo.
  // Guardar y publicar el cambio para aplicarlo en el dominio.
  underConstruction: true,

  // Horario provisional. Cuando se confirmen los días, incluirlos acá.
  hours: "8 a 22 h",

  // Número internacional, solo dígitos, sin +, espacios ni guiones.
  // Para un celular argentino suele tener el formato 549 + área + número, sin 15.
  // Pendiente de comprar el número definitivo. Vacío: no mostrar contacto telefónico.
  whatsappNumber: "",
  whatsappMessage: "Hola, quisiera consultar por Estacionamiento Newbery.",

  // Fotos: scripts/generate-thumbnails.py genera assets/photos/gallery.js.
};
