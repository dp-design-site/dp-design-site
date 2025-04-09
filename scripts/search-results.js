function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<span class="search-highlight">$1</span>`);
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name || "", query);
  const desc = highlightMatch(product.shortDescription || "", query);
  const image = product.images?.[0] ? `https://api.dp-design.art/uploads/${product.images[0]}` : "images/placeholder.png";

  const promoBadge = product.promo ? `<span class="promo-badge">Промо</span>` : "";
  const priceHTML = product.promo
    ? `<span class="old-price">${Number(product.price || 0).toFixed(2)} лв</span> <span class="result-price">${Number(product.promo).toFixed(2)} лв</span>`
    : `<span class="result-price">${Number(product.price || 0).toFixed(2)} лв</span>`;

  return `
    <div class="result-item">
      <img class="result-image" src="${image}" alt="${product.name}" />
      <div class="result-details">
        <div class="result-title">${name} ${promoBadge}</div>
        <div class="result-description">${desc}</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${priceHTML}
          <a class="view-btn" href="product-template.html?id=${product.id}">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

async function initSearchResults() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q")?.trim();
  if (!query) return;

  const termElement = document.getElementById("search-term");
  if (termElement) termElement.innerHTML = highlightMatch(query, query);

  const container = document.getElementById("results-container");
  const errorBox = document.getElementById("error-message");
  const emptyBox = document.getElementById("no-results");
  if (!container) return console.error("❌ Контейнерът за резултати не е намерен!");

  try {
    const res = await fetch("https://api.dp-design.art/products");
    if (!res.ok) throw new Error("Неуспешна заявка към API");
    const allProducts = await res.json();

    const filtered = allProducts
      .filter(p =>
        (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const exactMatchA = aName === query.toLowerCase();
        const exactMatchB = bName === query.toLowerCase();
        const startsWithA = aName.startsWith(query.toLowerCase());
        const startsWithB = bName.startsWith(query.toLowerCase());

        if (exactMatchA && !exactMatchB) return -1;
        if (!exactMatchA && exactMatchB) return 1;
        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        return 0;
      });

    if (filtered.length === 0) {
      emptyBox.style.display = "block";
      return;
    }

    container.innerHTML = filtered.map(p => createProductCard(p, query)).join("");
    console.log(`✅ Намерени резултати: ${filtered.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    errorBox.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", initSearchResults);
