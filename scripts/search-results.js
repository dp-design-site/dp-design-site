document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q")?.toLowerCase() || "";

  document.getElementById("search-query").textContent = `Търсене по: "${query}"`;

  // 🔎 Вземаме резултатите от localStorage (реални продукти от API)
  const searchResults = JSON.parse(localStorage.getItem("searchResults")) || [];

  const grid = document.getElementById("results-grid");
  const noResults = document.getElementById("no-results");

  if (searchResults.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  grid.innerHTML = "";

  searchResults.forEach(p => {
    const imgSrc = (p.images && p.images.length > 0) ? `uploads/${p.images[0]}` : "images/no-image.jpg";

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.name}" class="product-img"/>
      <h3>${p.name}</h3>
      <p>${p.description || "Без описание."}</p>
      <a href="product-template.html?id=${p.id}" class="view-btn">🔎 Разгледай</a>
    `;

    grid.appendChild(card);
  });
});
