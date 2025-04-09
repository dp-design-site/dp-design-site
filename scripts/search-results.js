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

function createSlider(images = []) {
  const slider = document.createElement("div");
  slider.className = "search-slider";

  let isDragging = false, startX = 0, scrollLeft = 0;

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => isDragging = false);
  slider.addEventListener("mouseup", () => isDragging = false);
  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  slider.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("touchend", () => isDragging = false);
  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });

  images.forEach(img => {
    const el = document.createElement("img");
    el.src = `https://api.dp-design.art/uploads/${img}`;
    el.alt = "Продуктово изображение";
    slider.appendChild(el);
  });

  return slider;
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name || "", query);
  const short = highlightMatch(product.shortDescription || "", query);
  const formatPrice = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "—" : num.toFixed(2);
};

const price = product.promo
  ? `<span class="price old">${formatPrice(product.price)} лв</span> <span class="price promo">${formatPrice(product.promo)} лв</span>`
  : `<span class="price">${formatPrice(product.price)} лв</span>`;

  const badge = product.promo ? `<span class="promo-badge">Промо</span>` : "";

  const card = document.createElement("div");
  card.className = "search-card";

  const slider = createSlider(product.images || []);
  const info = document.createElement("div");
  info.className = "search-card-info";
  info.innerHTML = `
    <h3>${name} ${badge}</h3>
    <p>${short}</p>
    <div class="search-card-footer">
      ${price}
      <a href="product-template.html?id=${product.id}" class="search-view-btn">Виж още</a>
    </div>
  `;

  card.appendChild(slider);
  card.appendChild(info);
  return card;
}

async function initSearchResults() {
  console.log("🔎 Зареждане на резултатите от търсачката...");

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    const title = document.getElementById("search-results-title");
    if (title) {
      title.innerHTML = `"${query}"`;
    }

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("Грешка при заявката");
    const products = await res.json();

    const filtered = products.filter(p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    );

    const container = await waitForElement("#results-container", 3000).catch(err => {
      console.warn("⏱️ Контейнерът за резултати не се зареди навреме:", err);
      return null;
    });

    if (!container) return;

    container.innerHTML = "";

    if (filtered.length === 0) {
      document.getElementById("no-results").style.display = "block";
      return;
    }

    filtered.sort((a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";
      const q = query.toLowerCase();
      const aIndex = aName.indexOf(q);
      const bIndex = bName.indexOf(q);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    filtered.forEach(p => {
      const card = createProductCard(p, query);
      container.appendChild(card);
    });

    console.log(`✅ Намерени резултати: ${filtered.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    document.getElementById("error-message").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  waitForElement("#header", 2000)
    .then(() => {
      console.log("✅ Хедърът е зареден – стартираме търсенето");
      initSearchResults();
    })
    .catch(err => {
      console.warn("⚠️ Хедърът не се зареди навреме:", err);
      initSearchResults(); // Опитваме независимо
    });
});
