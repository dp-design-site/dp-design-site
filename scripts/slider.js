// 📦 Универсален слайдър за DP Design
// Използване: initSlider(container, options)

function initSlider(container, options = {}) {
  const slides = Array.from(container.querySelectorAll(".slide"));
  if (slides.length === 0) return;

  let currentIndex = 0;
  const total = slides.length;
  const opts = {
    autoplay: options.autoplay ?? false,
    interval: options.interval || 4000,
    loop: options.loop ?? true,
    swipe: options.swipe ?? true,
    pauseOnHover: options.pauseOnHover ?? true,
    showIndicators: options.showIndicators ?? false,
    showArrows: options.showArrows ?? true,
    fullscreen: options.fullscreen ?? false,
  };

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    currentIndex = index;
    updateIndicators();
  }

  function nextSlide() {
    let next = currentIndex + 1;
    if (next >= total) next = opts.loop ? 0 : total - 1;
    showSlide(next);
  }

  function prevSlide() {
    let prev = currentIndex - 1;
    if (prev < 0) prev = opts.loop ? total - 1 : 0;
    showSlide(prev);
  }

  if (opts.showArrows) {
    const left = document.createElement("button");
    left.className = "slider-arrow left";
    left.innerHTML = "&#x25C0;";
    left.onclick = prevSlide;

    const right = document.createElement("button");
    right.className = "slider-arrow right";
    right.innerHTML = "&#x25B6;";
    right.onclick = nextSlide;

    container.appendChild(left);
    container.appendChild(right);
  }

  let autoplayTimer;
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, opts.interval);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (opts.autoplay) {
    startAutoplay();
    if (opts.pauseOnHover) {
      container.addEventListener("mouseenter", stopAutoplay);
      container.addEventListener("mouseleave", startAutoplay);
    }
  }

  if (opts.swipe) {
    let startX = 0;
    container.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });
    container.addEventListener("touchend", e => {
      const deltaX = e.changedTouches[0].clientX - startX;
      if (deltaX > 50) prevSlide();
      else if (deltaX < -50) nextSlide();
    });

    let dragX = 0;
    container.addEventListener("mousedown", e => {
      dragX = e.clientX;
    });
    container.addEventListener("mouseup", e => {
      const diff = e.clientX - dragX;
      if (diff > 50) prevSlide();
      else if (diff < -50) nextSlide();
    });
  }

  // 🔍 Fullscreen
  if (opts.fullscreen) {
    slides.forEach(slide => {
      slide.addEventListener("click", () => {
        const modal = document.getElementById("fullscreen-modal");
        const img = document.getElementById("fullscreen-image");
        img.src = slide.querySelector("img").src;
        modal.classList.add("open");
      });
    });
    const overlay = document.querySelector(".fullscreen-overlay");
    const closeBtn = document.querySelector(".fullscreen-close");
    if (overlay && closeBtn) {
      overlay.onclick = closeBtn.onclick = () => {
        document.getElementById("fullscreen-modal").classList.remove("open");
      };
    }
  }

  // 🔘 Индикатори
  let indicators;
  function updateIndicators() {
    if (!indicators) return;
    indicators.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  if (opts.showIndicators) {
    indicators = document.createElement("div");
    indicators.className = "slider-indicators";
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.onclick = () => showSlide(i);
      indicators.appendChild(dot);
    });
    container.appendChild(indicators);
  }

  showSlide(currentIndex);
}
