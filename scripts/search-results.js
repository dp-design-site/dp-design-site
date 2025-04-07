document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const rawQuery = urlParams.get("q") || "";
  const query = rawQuery.toLowerCase().trim(); // За сравнение
  document.getElementById("search-query").textContent = `Търсене по: "${rawQuery}"`;

  fetch("/api/products") // 👈 Заместваме с реален API
    .then(res => res.json())
    .then(products => {
      const results = products.filter(p => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        return name.includes(query) || desc.includes(query);
      });

      const grid = document.getElementById("results-grid");
      const noResults = document.getElementById("no-results");

      if (results.length === 0) {
        noResults.style.display = "block";
        return;
      }

      noResults.style.display = "none";
      grid.innerHTML = "";

      results.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}" class="product-img"/>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <a href="product-template.html?id=${p.id}" class="view-btn">🔎 Разгледай</a>
        `;
        grid.appendChild(card);
      });
    })
    .catch(err => {
      console.error("❌ Грешка при търсене: ", err);
    });
});
