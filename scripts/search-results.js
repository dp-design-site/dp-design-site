function highlightMatch(text, query) {
  if (!text) return "";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name, query);
  const short = highlightMatch(product.shortDescription || "", query);

  const price = Number(product.price) || 0;
  const promo = Number(product.promo_price) || null;

  const priceHTML = promo
    ? `<span class="price old">${price.toFixed(2)} лв</span> <span class="price">${promo.toFixed(2)} лв</span>`
    : `<span class="price">${price.toFixed(2)} лв</span>`;

  const badge = promo ? `<span class="promo-badge">Промо</span>` : "";

  return `
    <div class="search-card">
      <div class="search-card-image">
        <img src="${product.images?.[0] || 'images/placeholder.png'}" alt="${product.name}">
      </div>
      <div class="search-card-info">
        <h3>${name} ${badge}</h3>
        <p>${short}</p>
        <div class="search-card-footer">
          ${priceHTML}
          <a href="product-template.html?id=${product.id}" class="search-view-btn">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

function sortByRelevance(products, query) {
  return products.sort((a, b) => {
    const aMatch = (a.name || "").toLowerCase().indexOf(query.toLowerCase());
    const bMatch = (b.name || "").toLowerCase().indexOf(query.toLowerCase());

    if (aMatch === -1 && bMatch === -1) return 0;
    if (aMatch === -1) return 1;
    if (bMatch === -1) return -1;
    return aMatch - bMatch;
  });
}

async function initSearchResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    const title = document.getElementById("search-results-title");
    const container = document.getElementById("search-results-container");
    const noResults = document.getElementById("no-results");
    const errorMsg = document.getElementById("error-message");

    title.innerHTML = `"${highlightMatch(query, query)}"`;

    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("❌ Грешка при заявка към API");

    const products = await res.json();

    const filtered = products.filter(p =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      container.style.display = "none";
      noResults.style.display = "block";
      return;
    }

    const sorted = sortByRelevance(filtered, query);
    container.innerHTML = sorted.map(p => createProductCard(p, query)).join("");

    console.log(`✅ Намерени резултати: ${sorted.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    document.getElementById("error-message").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSearchResults();
});
