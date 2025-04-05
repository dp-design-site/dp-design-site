document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q")?.toLowerCase() || "";

  document.getElementById("search-query").textContent = `Търсене по: "${query}"`;

  // 🔧 Мокнати продукти (заменяме с API по-късно)
  const mockProducts = [
    { id: 1, name: "3D ключодържател", description: "Персонализиран подарък", image: "img1.jpg" },
    { id: 2, name: "Декорация за дома", description: "Уникална 3D закачалка", image: "img2.jpg" },
    { id: 3, name: "EV кабелна стойка", description: "Функционален аксесоар", image: "img3.jpg" },
  ];

  const filtered = mockProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );

  const grid = document.getElementById("results-grid");
  const noResults = document.getElementById("no-results");

  if (filtered.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  grid.innerHTML = "";

  filtered.forEach(p => {
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
});
