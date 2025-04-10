async function loadComponents() {
  const header = await fetch("header.html").then((r) => r.text());
  document.getElementById("header").innerHTML = header;

  const footer = await fetch("footer.html").then((r) => r.text());
  document.getElementById("footer").innerHTML = footer;

  loadProduct();
}

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // ⭐️ Добави рейтинг в product-details
  const rating = document.createElement("div");
  rating.appendChild(renderRating(product.rating || 0));
  document.querySelector(".product-details").prepend(rating);


  if (!id) return;

  try {
    const res = await fetch("https://api.dp-design.art/products");
    const data = await res.json();
    const product = data.find(p => p.id == id);

    if (!product) return;

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description || "Без описание.";
    document.getElementById("product-price").textContent = `${Number(product.promo_price || product.price).toFixed(2)} лв.`;

    if (product.promo_price && product.promo_price < product.price) {
      document.querySelector(".promo-badge").style.display = "inline-block";
      document.querySelector(".old-price-container").style.display = "block";
      document.getElementById("product-old-price").textContent = `${Number(product.price).toFixed(2)} лв.`;
    }

    loadSlider(product.images || []);
    loadActions(product.category, product.id);

  } catch (err) {
    console.error("Грешка при зареждане на продукта:", err);
  }
}

function loadSlider(images) {
  const slider = document.getElementById("product-slider");
  const thumbs = document.getElementById("product-thumbnails");

  slider.innerHTML = "";
  thumbs.innerHTML = "";

  if (!images.length) {
    slider.innerHTML = `<img src="images/placeholder.png" alt="Няма изображение" class="active">`;
    return;
  }

  images.forEach((img, index) => {
    const fullUrl = `https://api.dp-design.art/uploads/${img}`;

    const image = document.createElement("img");
    image.src = fullUrl;
    image.alt = `Снимка ${index + 1}`;
    image.className = index === 0 ? "active" : "";
    slider.appendChild(image);

    const thumb = document.createElement("img");
    thumb.src = fullUrl;
    thumb.alt = `Миниатюра ${index + 1}`;
    if (index === 0) thumb.classList.add("selected");

    image.onclick = () => {
      openFullscreen(index, images);
    };

    thumb.onclick = () => {
      [...slider.children].forEach(img => img.classList.remove("active"));
      slider.children[index].classList.add("active");

      [...thumbs.children].forEach(t => t.classList.remove("selected"));
      thumb.classList.add("selected");
    };

    thumbs.appendChild(thumb);
  });

  const leftBtn = document.createElement("button");
  leftBtn.className = "slider-btn left";
  leftBtn.textContent = "◀";
  leftBtn.onclick = () => navigateSlide(-1, slider, thumbs);

  const rightBtn = document.createElement("button");
  rightBtn.className = "slider-btn right";
  rightBtn.textContent = "▶";
  rightBtn.onclick = () => navigateSlide(1, slider, thumbs);

  slider.appendChild(leftBtn);
  slider.appendChild(rightBtn);
}

function navigateSlide(direction, slider, thumbs) {
  const images = slider.querySelectorAll("img");
  const thumbsList = thumbs.querySelectorAll("img");
  let index = [...images].findIndex(i => i.classList.contains("active"));

  images[index].classList.remove("active");
  thumbsList[index].classList.remove("selected");

  index = (index + direction + images.length) % images.length;

  images[index].classList.add("active");
  thumbsList[index].classList.add("selected");
}

function loadActions(category, id) {
  const container = document.getElementById("product-action-buttons");

  if (category === "personalized") {
    const btn = document.createElement("a");
    btn.href = `personalize-gift.html?id=${id}`;
    btn.textContent = "🎨 Персонализирай";
    container.appendChild(btn);
  } else if (category === "prototyping") {
    const btn = document.createElement("a");
    btn.href = `personalize-prototyping.html?id=${id}`;
    btn.textContent = "📩 Запитване";
    container.appendChild(btn);
  } else {
    const btn = document.createElement("button");
    btn.textContent = "🛒 Добави в количката";
    container.appendChild(btn);
  }
}

// ⭐️ Зареждане на рейтинг
function renderRating(rating) {
  const container = document.createElement("div");
  container.className = "product-rating";
  const rounded = Math.round(rating);
  container.innerHTML = "★".repeat(rounded) + "☆".repeat(5 - rounded);
  return container;
}

// 🖼️ Фулскрийн логика
let fullscreenImages = [];
let fullscreenIndex = 0;

function openFullscreen(index, images) {
  fullscreenImages = images;
  fullscreenIndex = index;
  const modal = document.getElementById("fullscreen-modal");
  const img = document.getElementById("fullscreen-image");
  img.src = `https://api.dp-design.art/uploads/${fullscreenImages[fullscreenIndex]}`;
  modal.style.display = "flex";
}

function closeFullscreen() {
  document.getElementById("fullscreen-modal").style.display = "none";
}

function navigateFullscreen(dir) {
  fullscreenIndex = (fullscreenIndex + dir + fullscreenImages.length) % fullscreenImages.length;
  const img = document.getElementById("fullscreen-image");
  img.src = `https://api.dp-design.art/uploads/${fullscreenImages[fullscreenIndex]}`;
}

// 👉 Добави и тези слушатели най-долу:
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("fullscreen-modal");
  if (modal.style.display === "flex") {
    if (e.key === "Escape") closeFullscreen();
    if (e.key === "ArrowLeft") navigateFullscreen(-1);
    if (e.key === "ArrowRight") navigateFullscreen(1);
  }
});

document.querySelector(".fullscreen-close").onclick = closeFullscreen;
document.querySelector(".fullscreen-overlay").onclick = closeFullscreen;
document.querySelector(".fullscreen-nav.left").onclick = () => navigateFullscreen(-1);
document.querySelector(".fullscreen-nav.right").onclick = () => navigateFullscreen(1);

