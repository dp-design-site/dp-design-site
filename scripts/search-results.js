document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("search-results");
  const searchTitle = document.getElementById("search-title");

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (!query) {
    searchTitle.textContent = "❌ Няма въведена заявка за търсене.";
    return;
  }

  searchTitle.innerHTML = `Търсене по: "<strong>${query}</strong>"`;

  fetch("/api/products")
    .then((res) => {
      if (!res.ok) throw new Error("Продуктите не бяха заредени.");
      return res.json();
    })
    .then((products) => {
      const results = products.filter((p) => {
        const lowerQuery = query.toLowerCase();
        return (
          p.name?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery)
        );
      });

      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-message">
            <span class="no-results">❌ Няма намерени резултати.</span>
          </div>`;
        return;
      }

      resultsContainer.innerHTML = ""; // Изчистваме съдържанието

      results.forEach((product) => {
        const container = document.createElement("div");
        container.classList.add("search-product");

        const image = product.images?.[0] || "images/placeholder.png";

        const priceBlock = product.promo
          ? `<div class="price"><span class="old-price">${product.price} лв.</span> <span class="promo-price">${product.promo} лв.</span></div>
             <div class="promo-badge">ПРОМО</div>`
          : `<div class="price">${product.price} лв.</div>`;

        container.innerHTML = `
          <div class="image-col">
            <img src="${image}" alt="${product.name}" />
          </div>
          <div class="info-col">
            <h3>${product.name}</h3>
            <p class="short-description">${product.description || "Без описание."}</p>
            ${priceBlock}
            <a href="product-template.html?id=${product.id}" class="view-btn">👁 Виж още</a>
          </div>`;

        resultsContainer.appendChild(container);
      });
    })
    .catch((err) => {
      console.error("❌ Грешка при зареждане на продуктите:", err);
      resultsContainer.innerHTML = `<div class="search-message">⚠️ Проблем при зареждане на резултатите.</div>`;
    });
});
