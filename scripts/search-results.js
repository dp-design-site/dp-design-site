document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  document.getElementById("search-query").textContent = `Търсене по: "${query}"`;

  const grid = document.getElementById("results-grid");
  const noResults = document.getElementById("no-results");

  if (!query.trim()) {
    noResults.style.display = "block";
    return;
  }

  try {
    const res = await fetch("https://api.dp-design.art/api/products");
    const data = await res.json();

    const filtered = data.filter(p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );

    if (filtered.length === 0) {
      noResults.style.display = "block";
      return;
    }

    noResults.style.display = "none";
    grid.innerHTML = "";

    filtered.forEach(p => {
      const container = document.createElement("div");
      container.className = "search-result";

      container.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="result-img">
        <div class="result-details">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="price-info">
            ${
              p.promo_price
                ? `<span class="promo-price">${p.promo_price.toFixed(2)} лв.</span> <span class="old-price">${p.price.toFixed(2)} лв.</span>`
                : `<span class="normal-price">${p.price.toFixed(2)} лв.</span>`
            }
          </div>
          <a href="product-template.html?id=${p.id}" class="view-btn">🔎 Виж още</a>
        </div>
      `;

      grid.appendChild(container);
    });
  } catch (error) {
    console.error("❌ Грешка при зареждане на продуктите:", error);
    noResults.style.display = "block";
    noResults.textContent = "⚠️ Проблем при зареждане на резултатите.";
  }
});
