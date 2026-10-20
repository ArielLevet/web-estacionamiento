/* Datos editables del sitio. No requiere instalar herramientas ni compilar. */
window.SITE_CONFIG = {
  // Horario provisional. Cuando se confirmen los días, incluirlos acá.
  hours: "8 a 22 h",

  // Pendiente. Número internacional, solo dígitos, sin +, espacios ni guiones.
  // Para un celular argentino suele tener el formato 549 + área + número, sin 15.
  // Al completarlo, los dos enlaces de WhatsApp aparecen automáticamente.
  whatsappNumber: "",
  whatsappMessage: "Hola, quisiera consultar por el estacionamiento de Newbery 9050.",

  // Agregar fotos reales en assets/photos/ y sus datos acá.
  // src: miniatura optimizada. full: foto grande opcional; si falta, usa src.
  // Ejemplo (reemplazar por un archivo real antes de activarlo):
  // { src: "./assets/photos/entrada.webp", full: "./assets/photos/entrada-grande.webp",
  //   alt: "Entrada del Estacionamiento Newbery", caption: "La entrada" },
  photos: [],
};
