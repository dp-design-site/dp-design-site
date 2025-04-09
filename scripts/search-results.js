function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return text.replace(regex, match => `<mark class="search-highlight">${match}</mark>`);
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name || "", query);
  const short = highlightMatch(product.shortDescription || "", query);
  const hasPromo = product.promo && product.promo < product.price;

  const price = hasPromo
    ? `<span class="old-price">${product.price.toFixed(2)} лв</span> <span class="result-price">${product.promo.toFixed(2)} лв</span>`
    : `<span class="result-price">${(product.price || 0).toFixed(2)} лв</span>`;

  const promoBadge = hasPromo ? `<span class="promo-badge">Промо</span>` : "";

  const imageSrc = product.image?.startsWith("http") || product.image?.includes("uploads/")
    ? product.image
    : `uploads/${product.image}`;

  return `
    <div class="result-item">
      <img class="result-image" src="${imageSrc}" alt="${product.name}">
      <div class="result-details">
        <div class="result-title">${name} ${promoBadge}</div>
        <div class="result-description">${short}</div>
        <div class="result-footer">
          ${price}
          <a class="view-btn" href="product-template.html?id=${product.id}">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

function waitForElement(selector, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - start >= timeout) {
        clearInterval(interval);
        reject(`⏱️ Timeout: ${selector} не се зареди навреме`);
      }
    }, 100);
  });
}


async function initSearchResults() {
  console.log("🔎 Зареждане на резултатите от търсачката...");

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    const title = document.getElementById("search-term");
    if (title) {
      title.textContent = query;
    }

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("Неуспешна заявка към API");

    const products = await res.json();

    const filtered = products
      .map(p => ({
        ...p,
        matchIndex: (p.name || "").toLowerCase().indexOf(query.toLowerCase())
      }))
      .filter(p => p.matchIndex !== -1)
      .sort((a, b) => a.matchIndex - b.matchIndex);

    const container = document.getElementById("results-container");
    if (!container) return console.error("❌ Контейнерът за резултати не е намерен!");

    if (filtered.length === 0) {
      document.getElementById("no-results").style.display = "block";
      return;
    }

    container.innerHTML = filtered.map(p => createProductCard(p, query)).join("");
    console.log(`✅ Намерени резултати: ${filtered.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    const errorBox = document.getElementById("error-message");
    if (errorBox) errorBox.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  waitForElement("#header", 2000)
    .then(() => {
      console.log("✅ Компонентите са заредени – стартираме търсенето");
      initSearchResults();
    })
    .catch(err => {
      console.warn("⚠️ Header не беше намерен навреме:", err);
      initSearchResults();
    });
});
