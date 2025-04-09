async function waitForElement(selector, timeout = 1500) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(`⏱️ Timeout: ${selector} не се зареди навреме`);
      }
    }, 50);
  });
}

function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

function createImageSlider(images) {
  if (!images || images.length === 0) return `<div class="slider">⚠️ Без снимка</div>`;
  const slides = images.map((img, i) =>
    `<img src="https://api.dp-design.art/uploads/${img}" class="${i === 0 ? "active" : ""}" alt="снимка">`
  ).join("");

  return `
    <div class="slider" onmousedown="startDrag(event, this)" ontouchstart="startDrag(event, this)">
      ${slides}
      <button class="slider-btn left" onclick="prevSlide(this)">◀</button>
      <button class="slider-btn right" onclick="nextSlide(this)">▶</button>
    </div>
  `;
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name || "", query);
  const short = highlightMatch(product.shortDescription || "", query);

  const priceHTML = product.promo
    ? `<span class="price old">${Number(product.price).toFixed(2)} лв</span> <span class="price promo">${Number(product.promo).toFixed(2)} лв</span>`
    : `<span class="price">${Number(product.price).toFixed(2)} лв</span>`;

  const promoBadge = product.promo ? `<span class="promo-badge">Промо</span>` : "";

  return `
    <div class="search-card">
      <div class="search-card-image">
        ${createImageSlider(product.images)}
      </div>
      <div class="search-card-info">
        <h3>${name} ${promoBadge}</h3>
        <p>${short}</p>
        <div class="search-card-footer">
          ${priceHTML}
          <a class="search-view-btn" href="product-template.html?id=${product.id}">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

function sortByRelevance(products, query) {
  return products.sort((a, b) => {
    const aName = a.name?.toLowerCase() || "";
    const bName = b.name?.toLowerCase() || "";
    const q = query.toLowerCase();

    const aScore = aName.startsWith(q) ? 2 : aName.includes(q) ? 1 : 0;
    const bScore = bName.startsWith(q) ? 2 : bName.includes(q) ? 1 : 0;
    return bScore - aScore;
  });
}

async function initSearchResults() {
  console.log("🔎 Зареждане на резултатите от търсачката...");

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    document.getElementById("search-term").textContent = `"${query}"`;

    const container = document.getElementById("results-container");
    if (!container) return console.error("❌ Контейнерът за резултати не е намерен!");

    const res = await fetch("https://api.dp-design.art/products");
    const products = await res.json();

    const filtered = products.filter(p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    );

    if (filtered.length === 0) {
      container.innerHTML = `<p class="no-results">❌ Няма намерени резултати.</p>`;
      return;
    }

    const sorted = sortByRelevance(filtered, query);
    container.innerHTML = sorted.map(p => createProductCard(p, query)).join("");

    console.log(`✅ Намерени резултати: ${filtered.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    document.getElementById("error-message").style.display = "block";
  }
}

// Drag слайдер
let isDragging = false, startX = 0, scrollLeft = 0;
window.startDrag = function (e, slider) {
  const sliderContainer = slider;
  isDragging = true;
  startX = (e.pageX || e.touches[0].pageX) - sliderContainer.offsetLeft;
  scrollLeft = sliderContainer.scrollLeft;

  function onMove(ev) {
    if (!isDragging) return;
    const x = (ev.pageX || ev.touches[0].pageX) - sliderContainer.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderContainer.scrollLeft = scrollLeft - walk;
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", stopDrag);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onMove);
  document.addEventListener("touchend", stopDrag);
};

window.prevSlide = function (btn) {
  const container = btn.closest(".slider");
  container.scrollBy({ left: -300, behavior: "smooth" });
};

window.nextSlide = function (btn) {
  const container = btn.closest(".slider");
  container.scrollBy({ left: 300, behavior: "smooth" });
};

// Старт
document.addEventListener("DOMContentLoaded", () => {
  waitForElement("#results-container", 2000)
    .then(() => initSearchResults())
    .catch(err => {
      console.warn("⚠️ Контейнерът за резултати не се зареди навреме:", err);
      initSearchResults();
    });
});
