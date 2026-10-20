(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (typeof config.hours === "string" && config.hours.trim()) {
    document.querySelectorAll("[data-hours]").forEach((element) => {
      element.textContent = config.hours.trim();
    });
    const description = `Estacionamiento Newbery. Newbery 9050, Rosario. Horario de atención: ${config.hours.trim()}. Consultá cómo llegar y conocé el lugar.`;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:description"]').content = description;
  }

  const phone = String(config.whatsappNumber || "").trim();
  if (/^[1-9]\d{7,14}$/.test(phone)) {
    const message = config.whatsappMessage || "Hola, quisiera consultar por el estacionamiento.";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.href = whatsappUrl;
      link.hidden = false;
    });
    document.body.classList.add("has-whatsapp");
  }

  // Solo se admiten imágenes locales o URLs HTTP(S).
  const imageUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };

  const photos = (Array.isArray(config.photos) ? config.photos : [])
    .filter((photo) => photo && typeof photo.alt === "string" && photo.alt.trim() && imageUrl(photo.src))
    .map((photo) => ({
      src: imageUrl(photo.src),
      full: imageUrl(photo.full) || imageUrl(photo.src),
      alt: photo.alt,
      caption: typeof photo.caption === "string" ? photo.caption : photo.alt,
    }));

  const gallery = document.getElementById("gallery");
  const empty = document.getElementById("gallery-empty");
  const dialog = document.getElementById("lightbox");
  if (!photos.length || !gallery || !dialog) return;

  const largeImage = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const counter = document.getElementById("lightbox-counter");
  const closeButton = document.getElementById("lightbox-close");
  const previousButton = document.getElementById("lightbox-prev");
  const nextButton = document.getElementById("lightbox-next");
  const galleryButtons = [];
  let activeIndex = 0;
  let opener = null;

  function renderPhoto(index) {
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    largeImage.src = photo.full;
    largeImage.alt = photo.alt;
    caption.textContent = photo.caption;
    counter.textContent = `${activeIndex + 1} / ${photos.length}`;
    previousButton.disabled = photos.length < 2;
    nextButton.disabled = photos.length < 2;
  }

  function openPhoto(index, button) {
    opener = button;
    renderPhoto(index);
    dialog.showModal();
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.setAttribute("aria-label", `Ampliar foto: ${photo.alt}`);
    button.setAttribute("aria-haspopup", "dialog");
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 900;
    img.height = 650;
    // Si una foto falla, conservar la galería con las demás imágenes disponibles.
    img.addEventListener("error", () => {
      button.hidden = true;
      const hasVisiblePhotos = galleryButtons.some((item) => !item.hidden);
      gallery.hidden = !hasVisiblePhotos;
      empty.hidden = hasVisiblePhotos;
    });
    button.append(img);
    button.addEventListener("click", () => openPhoto(index, button));
    galleryButtons.push(button);
    gallery.append(button);
  });

  gallery.hidden = false;
  empty.hidden = true;
  closeButton.addEventListener("click", () => dialog.close());
  previousButton.addEventListener("click", () => renderPhoto(activeIndex - 1));
  nextButton.addEventListener("click", () => renderPhoto(activeIndex + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      renderPhoto(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.classList.contains("lightbox-stage")) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    largeImage.removeAttribute("src");
    if (opener && !opener.hidden) opener.focus();
  });
})();
