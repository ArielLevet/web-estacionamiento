(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (typeof config.hours === "string" && config.hours.trim()) {
    document.querySelectorAll("[data-hours]").forEach((element) => {
      element.textContent = config.hours.trim();
    });
    const description = `Estacionamiento Newbery con traslado al aeropuerto. Dejá el auto. Seguí con tu día. Newbery 9050, Rosario. Horario de atención: ${config.hours.trim()}.`;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:description"]').content = description;
  }

  const phone = String(config.whatsappNumber || "").trim();
  if (/^[1-9]\d{7,14}$/.test(phone)) {
    const message = config.whatsappMessage || "Hola, quisiera consultar por Estacionamiento Newbery.";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.href = whatsappUrl;
      link.hidden = false;
    });
    document.body.classList.add("has-whatsapp");
    const phoneLabel = `+${phone.replace(/^549(341)(\d{3})(\d{4})$/, "54 9 $1 $2-$3")}`;
    document.querySelectorAll("[data-phone]").forEach((link) => {
      link.href = `tel:+${phone}`;
      link.setAttribute("aria-label", `Llamar al ${phoneLabel}`);
      const number = link.querySelector("[data-phone-number]");
      if (number) number.textContent = phoneLabel;
      link.hidden = false;
    });
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

  const photos = (Array.isArray(window.SITE_PHOTOS) ? window.SITE_PHOTOS : [])
    .filter((photo) => photo && imageUrl(photo.src))
    .slice()
    .sort((a, b) => (a.full || a.src).localeCompare(b.full || b.src, "es", { numeric: true, sensitivity: "base" }))
    .map((photo) => ({
      src: imageUrl(photo.src),
      full: imageUrl(photo.full) || imageUrl(photo.src),
    }));

  const gallery = document.getElementById("gallery");
  const empty = document.getElementById("gallery-empty");
  const galleryHint = document.getElementById("gallery-hint");
  const galleryCount = document.getElementById("gallery-count");
  const dialog = document.getElementById("lightbox");
  if (!photos.length || !gallery || !dialog) return;

  const largeImage = document.getElementById("lightbox-image");
  const counter = document.getElementById("lightbox-counter");
  const closeButton = document.getElementById("lightbox-close");
  const previousButton = document.getElementById("lightbox-prev");
  const nextButton = document.getElementById("lightbox-next");
  const galleryButtons = [];
  const failedPhotos = new Set();
  let activeIndex = 0;
  let opener = null;
  let swipeStart = null;
  largeImage.draggable = false;
  const viewport = window.visualViewport;
  const isZoomed = () => viewport?.scale > 1;

  function syncZoom() {
    const zoomed = Boolean(isZoomed());
    dialog.classList.toggle("is-zoomed", zoomed);
    if (zoomed) swipeStart = null;
  }

  viewport?.addEventListener("resize", syncZoom);

  const availableIndices = () => photos.map((_, index) => index).filter((index) => !failedPhotos.has(index));

  function syncGallery() {
    const visibleButtons = galleryButtons.filter((button) => !button.hidden);
    const count = visibleButtons.length;
    galleryButtons.forEach((button) => button.classList.toggle("is-featured", button === visibleButtons[0]));
    gallery.dataset.layout = count === 1 ? "single" : count === 2 ? "pair" : "mosaic";
    gallery.hidden = !count;
    empty.hidden = Boolean(count);
    if (galleryHint) galleryHint.hidden = !count;
    if (galleryCount) galleryCount.textContent = `${count} ${count === 1 ? "foto" : "fotos"}`;
  }

  function renderPhoto(index) {
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    const available = availableIndices();
    largeImage.src = photo.full;
    largeImage.alt = `Foto ${activeIndex + 1} del estacionamiento`;
    counter.textContent = `${available.indexOf(activeIndex) + 1} / ${available.length}`;
    previousButton.disabled = available.length < 2;
    nextButton.disabled = available.length < 2;
  }

  function changePhoto(direction) {
    const available = availableIndices();
    if (!available.length) return;
    const position = available.indexOf(activeIndex);
    renderPhoto(available[(position + direction + available.length) % available.length]);
  }

  function openPhoto(index, button) {
    opener = button;
    renderPhoto(index);
    syncZoom();
    dialog.showModal();
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function restorePage() {
    if (dialog.open) return;
    swipeStart = null;
    document.body.classList.remove("lightbox-open");
    largeImage.removeAttribute("src");
    if (opener && !opener.hidden) opener.focus();
  }

  function closePhoto() {
    dialog.close();
    restorePage();
  }

  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.setAttribute("aria-label", `Ampliar foto ${index + 1}`);
    button.setAttribute("aria-haspopup", "dialog");
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = "";
    img.loading = index === 0 ? "eager" : "lazy";
    if (index === 0) img.fetchPriority = "high";
    img.decoding = "async";
    img.width = 900;
    img.height = 650;
    // Si una foto falla, conservar la galería con las demás imágenes disponibles.
    img.addEventListener("error", () => {
      failedPhotos.add(index);
      button.hidden = true;
      syncGallery();
      if (dialog.open) {
        if (!availableIndices().length) closePhoto();
        else if (activeIndex === index) changePhoto(1);
        else renderPhoto(activeIndex);
      }
    });
    const photoFrame = document.createElement("span");
    photoFrame.className = "gallery-photo";
    const zoom = document.createElement("span");
    zoom.className = "gallery-zoom";
    zoom.textContent = "↗";
    zoom.setAttribute("aria-hidden", "true");
    photoFrame.append(img, zoom);
    button.append(photoFrame);
    button.addEventListener("click", () => openPhoto(index, button));
    galleryButtons.push(button);
    gallery.append(button);
  });

  syncGallery();
  closeButton.addEventListener("click", closePhoto);
  previousButton.addEventListener("click", () => changePhoto(-1));
  nextButton.addEventListener("click", () => changePhoto(1));
  // Solo gestos táctiles horizontales: ignorar toques, arrastres verticales y zoom.
  dialog.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    swipeStart = event.isPrimary && event.target === largeImage && !isZoomed()
      ? { id: event.pointerId, x: event.clientX, y: event.clientY }
      : null;
  });
  dialog.addEventListener("pointerup", (event) => {
    if (!swipeStart || event.pointerId !== swipeStart.id) return;
    const start = swipeStart;
    swipeStart = null;
    if (!dialog.open || isZoomed()) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      changePhoto(dx < 0 ? 1 : -1);
    }
  });
  dialog.addEventListener("pointercancel", () => { swipeStart = null; });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      changePhoto(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.classList.contains("lightbox-stage")) closePhoto();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closePhoto();
  });
  dialog.addEventListener("close", restorePage);
})();
