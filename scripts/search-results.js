async function waitForElement(selector, timeout = 2000) {
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
    }, 50);
  });
}

function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, (match) => `<span class="search-highlight">${match}</span>`);
}

function getMatchScore(text, query) {
  if (!text) return 0;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (lowerText === lowerQuery) return 100;             // Точно съвпадение
  if (lowerText.startsWith(lowerQuery)) return 80;      // Започва с
  if (lowerText.includes(lowerQuery)) return 50;        // Съдържа
  return 0;
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name, query);
  const short = highlightMatch(product.shortDescription || "", query);
  const price = parseFloat(product.price) || 0;
  const promo = parseFloat(product.promo) || null;

  const priceHTML = promo
    ? `<span class="old-price">${price.toFixed(2)} лв</span> <span class="result-price">${promo.toFixed(2)} лв</span>`
    : `<span class="result-price">${price.toFixed(2)} лв</span>`;

  const promoBadge = promo ? `<span class="promo-badge">Промо</span>` : "";

  return `
    <div class="result-item">
      <img class="result-image" src="${product.image || 'images/placeholder.png'}" alt="${product.name}">
      <div class="result-details">
        <div class="result-title">${name} ${promoBadge}</div>
        <div class="result-description">${short}</div>
        <div>
          ${priceHTML}
          <a class="view-btn" href="product-template.html?id=${product.id}">Виж още</a>
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

    const title = document.getElementById("search-term");
    if (title) {
      title.innerHTML = `<span class="search-highlight">"${query}"</span>`;
    }

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("Неуспешна заявка към API");
    const products = await res.json();

    const scored = products
      .map(p => {
        const nameScore = getMatchScore(p.name, query);
        const descScore = getMatchScore(p.shortDescription, query);
        const score = Math.max(nameScore, descScore);
        return { ...p, matchScore: score };
      })
      .filter(p => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    const container = document.getElementById("results-container");
    const noResults = document.getElementById("no-results");
    const errorMessage = document.getElementById("error-message");

    if (!container) {
      console.error("❌ Контейнерът за резултати не е намерен!");
      return;
    }

    if (scored.length === 0) {
      container.innerHTML = "";
      noResults.style.display = "block";
      return;
    }

    noResults.style.display = "none";
    errorMessage.style.display = "none";
    container.innerHTML = scored.map(p => createProductCard(p, query)).join("");
    console.log(`✅ Намерени резултати: ${scored.length}`);
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
    .catch((err) => {
      console.warn("⚠️ Header не беше намерен навреме:", err);
      initSearchResults(); // Все пак пробваме
    });
});
