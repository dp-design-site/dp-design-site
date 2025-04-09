function waitForElement(selector, timeout = 1000) {
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
  if (!text || !query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name, query);
  const short = highlightMatch(product.shortDescription || "", query);
  const price = product.price && typeof product.price === 'number' ? product.price.toFixed(2) : "0.00";
  const promo = product.promo && typeof product.promo === 'number' ? product.promo.toFixed(2) : null;

  const priceHtml = promo
    ? `<span class="price old">${price} лв</span> <span class="price promo">${promo} лв</span>`
    : `<span class="price">${price} лв</span>`;

  const promoBadge = promo ? `<span class="promo-badge">Промо</span>` : "";

  // 🔄 Слайдер с drag – показва се само една снимка
  const images = (product.images || []).map((img, index) => `
    <img src="https://api.dp-design.art/uploads/${img}" alt="${product.name}" class="${index === 0 ? 'active' : ''}">
  `).join("");

  return `
    <div class="search-card">
      <div class="search-slider" onmousedown="startDrag(event, this)" ontouchstart="startDrag(event, this)">
        ${images}
      </div>
      <div class="search-card-info">
        <h3>${name} ${promoBadge}</h3>
        <p>${short}</p>
        <div class="search-card-footer">
          ${priceHtml}
          <a class="search-view-btn" href="product-template.html?id=${product.id}">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

// 🔄 Drag логика за слайдване
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function startDrag(e, slider) {
  isDragging = true;
  slider.classList.add("dragging");
  startX = e.pageX || e.touches[0].pageX;
  scrollLeft = slider.scrollLeft;

  function move(e) {
    if (!isDragging) return;
    const x = e.pageX || e.touches[0].pageX;
    const walk = (startX - x);
    slider.scrollLeft = scrollLeft + walk;
  }

  function stop() {
    isDragging = false;
    slider.classList.remove("dragging");
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", stop);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", stop);
  }

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
  window.addEventListener("touchmove", move);
  window.addEventListener("touchend", stop);
}

async function initSearchResults() {
  console.log("🔍 Инициализация на търсачката!");
  try {
    const termEl = document.getElementById("search-results-title");
    const container = await waitForElement("#results-container", 2000);

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    if (termEl) {
      termEl.innerHTML = `"${query}"`;
    }

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("API заявката не е успешна");
    const products = await res.json();

    const filtered = products.filter(p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    );

    // 🔠 Подреждаме по най-точно съвпадение
    filtered.sort((a, b) => {
      const aIndex = a.name?.toLowerCase().indexOf(query.toLowerCase()) ?? 9999;
      const bIndex = b.name?.toLowerCase().indexOf(query.toLowerCase()) ?? 9999;
      return aIndex - bIndex;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p class="no-results">❌ Няма намерени резултати.</p>`;
      return;
    }

    container.innerHTML = filtered.map(p => createProductCard(p, query)).join("");
    console.log(`✅ Намерени резултати: ${filtered.length}`);
  } catch (err) {
    console.warn("⚠️ Грешка при зареждане на резултатите:", err);
    const fallback = document.getElementById("error-message");
    if (fallback) fallback.style.display = "block";
  }
}

// ✅ Стартираме след зареждане на DOM
document.addEventListener("DOMContentLoaded", () => {
  initSearchResults();
});
