async function waitForElement(selector, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(`⏱ Timeout: ${selector} не се зареди навреме`);
      }
    }, 50);
  });
}

function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

function createSlider(images) {
  const slides = images.map((img, i) =>
    `<img src="https://api.dp-design.art/uploads/${img}" class="slide${i === 0 ? ' active' : ''}" alt="Продукт">`
  ).join("");

  return `
    <div class="slider" onmousedown="startDrag(event, this)" ontouchstart="startDrag(event, this)">
      ${slides}
    </div>
  `;
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name || "", query);
  const short = highlightMatch(product.shortDescription || "", query);

  const price = parseFloat(product.price);
  const promo = parseFloat(product.promo_price);

  const priceHTML = !isNaN(promo)
    ? `<span class="price old">${price.toFixed(2)} лв</span>
       <span class="price promo">${promo.toFixed(2)} лв</span>`
    : `<span class="price">${price.toFixed(2)} лв</span>`;

  const promoBadge = !isNaN(promo) ? `<span class="promo-badge">Промо</span>` : "";

  const imageSlider = createSlider(product.images || []);

  return `
    <div class="search-card">
      <div class="search-card-image">
        ${imageSlider}
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
  const q = query.toLowerCase();
  return products.sort((a, b) => {
    const aName = a.name?.toLowerCase() || "";
    const bName = b.name?.toLowerCase() || "";
    const aExact = aName === q ? -1 : aName.includes(q) ? 0 : 1;
    const bExact = bName === q ? -1 : bName.includes(q) ? 0 : 1;
    return aExact - bExact;
  });
}

async function initSearchResults() {
  console.log("🔍 Зареждане на резултатите от търсачката...");

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    await waitForElement("#search-results-container");
    await waitForElement("#search-term");

    const container = document.querySelector("#search-results-container");
    const termSpan = document.querySelector("#search-term");

    if (!container || !termSpan) {
      console.warn("❌ Контейнерът или заглавието не са налични.");
      return;
    }

    termSpan.textContent = `"${query}"`;

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("Неуспешна заявка към API");

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
    console.log(`✅ Намерени резултати: ${sorted.length}`);
  } catch (err) {
    console.warn("⚠️ Грешка при зареждане на резултатите:", err);
    const fallback = document.querySelector("#search-results-container");
    if (fallback) fallback.innerHTML = `<p class="error-message">⚠️ Проблем при зареждане на резултатите.</p>`;
  }
}

// 🎯 Слайдване с мишка и пръст
let isDragging = false, startX = 0, scrollLeft = 0;

window.startDrag = (e, el) => {
  const slider = el;
  isDragging = true;
  startX = e.pageX || e.touches[0].pageX;
  scrollLeft = slider.scrollLeft;
  slider.classList.add("dragging");

  const move = ev => {
    if (!isDragging) return;
    const x = ev.pageX || ev.touches[0].pageX;
    const walk = (startX - x);
    slider.scrollLeft = scrollLeft + walk;
  };

  const stop = () => {
    isDragging = false;
    slider.classList.remove("dragging");
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", stop);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", stop);
  };

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
  window.addEventListener("touchmove", move);
  window.addEventListener("touchend", stop);
};

// ✅ Старт
document.addEventListener("DOMContentLoaded", () => {
  initSearchResults();
});
