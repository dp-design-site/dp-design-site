// scripts/search-results.js

async function waitForElement(selector, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (Date.now() - start >= timeout) {
        clearInterval(interval);
        reject(`⏱️ Timeout: ${selector} не се зареди навреме`);
      }
    }, 50);
  });
}

function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name, query);
  const short = highlightMatch(product.shortDescription || "", query);
  const price = product.promo
    ? `<span class="price old">${parseFloat(product.price).toFixed(2)} лв</span> <span class="price promo">${parseFloat(product.promo).toFixed(2)} лв</span>`
    : `<span class="price">${parseFloat(product.price).toFixed(2)} лв</span>`;
  const promoBadge = product.promo ? `<span class="promo-badge">Промо</span>` : "";

  return `
    <div class="search-card">
      <div class="search-card-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="search-card-info">
        <h3>${name} ${promoBadge}</h3>
        <p>${short}</p>
        <div class="search-card-footer">
          ${price}
          <a class="search-view-btn" href="product-template.html?id=${product.id}">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

async function initSearchResults() {
  console.log("🔎 Зареждане на резултатите от търсачката...");

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    const title = document.getElementById("search-results-title");
    if (title) {
      title.innerHTML = `Търсене по: "<strong>${query}</strong>"`;
    }

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("Неуспешна заявка към API");
    const products = await res.json();

    const filtered = products.filter(p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    );

    const container = document.getElementById("search-results-container");
    if (!container) return console.error("❌ Контейнерът за резултати не е намерен!");

    if (filtered.length === 0) {
      container.innerHTML = `<p class="no-results">❌ Няма намерени резултати.</p>`;
    } else {
      container.innerHTML = filtered.map(p => createProductCard(p, query)).join("");
      console.log(`✅ Намерени резултати: ${filtered.length}`);
    }

  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    const container = document.getElementById("search-results-container");
    if (container) {
      container.innerHTML = `<p class="no-results">⚠️ Проблем при зареждане на резултатите.</p>`;
    }
  }
}

// ✅ Изчакваме компонентите и стартираме
document.addEventListener("DOMContentLoaded", () => {
  waitForElement("#header", 2000)
    .then(() => {
      console.log("✅ Компонентите са заредени – стартираме търсенето");
      initSearchResults();
    })
    .catch(err => {
      console.warn("⚠️ Header не беше намерен навреме:", err);
      initSearchResults(); // Опитваме дори и без хедъра
    });
});
