document.addEventListener("DOMContentLoaded", async () => {
  console.log("🔎 Инициализация на търсачката!");

  const query = new URLSearchParams(window.location.search).get("q")?.trim();
  if (!query) return;

  // Визуализиране на търсената дума
  const titleEl = document.getElementById("search-term");
  if (titleEl) titleEl.textContent = `"${query}"`;

  try {
    const res = await fetch("https://api.dp-design.art/products");
    const products = await res.json();

    const filtered = products
      .filter(p =>
        (p.name?.toLowerCase().includes(query.toLowerCase()) ||
         p.shortDescription?.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const lowerQ = query.toLowerCase();
        if (aName === lowerQ) return -1;
        if (bName === lowerQ) return 1;
        if (aName.startsWith(lowerQ) && !bName.startsWith(lowerQ)) return -1;
        if (bName.startsWith(lowerQ) && !aName.startsWith(lowerQ)) return 1;
        return 0;
      });

    const container = document.getElementById("search-results-container");
    if (!container) {
      console.error("❌ Контейнерът за резултати не е намерен!");
      return;
    }

    if (filtered.length === 0) {
      document.getElementById("no-results").style.display = "block";
      return;
    }

    // Зареждаме всеки резултат
    container.innerHTML = "";
    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "search-card";

      // Слайдър със снимки
      const slider = document.createElement("div");
      slider.className = "search-slider";
      slider.setAttribute("draggable", "false");

      (product.images || []).forEach(img => {
        const imgEl = document.createElement("img");
        imgEl.src = `https://api.dp-design.art/uploads/${img}`;
        imgEl.alt = product.name;
        imgEl.draggable = false;
        slider.appendChild(imgEl);
      });

      // Добавяме drag функционалност
      let isDown = false;
      let startX;
      let scrollLeft;

      slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("dragging");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("dragging");
      });

      slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("dragging");
      });

      slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
      });

      // Поддръжка за touch
      slider.addEventListener("touchstart", (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener("touchend", () => {
        isDown = false;
      });

      slider.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
      });

      // Информация
      const info = document.createElement("div");
      info.className = "search-info";

      const title = document.createElement("h3");
      title.innerHTML = highlight(product.name, query);
      info.appendChild(title);

      const desc = document.createElement("p");
      desc.innerHTML = highlight(product.shortDescription || "", query);
      info.appendChild(desc);

      const footer = document.createElement("div");
      footer.className = "search-footer";

      const price = document.createElement("div");
      price.className = "price";

      if (product.promo) {
        price.innerHTML = `
          <span class="old-price">${(+product.price).toFixed(2)} лв</span>
          <span class="promo-price">${(+product.promo).toFixed(2)} лв</span>
        `;
        const badge = document.createElement("span");
        badge.className = "promo-badge";
        badge.textContent = "Промо";
        info.appendChild(badge);
      } else {
        price.textContent = `${(+product.price).toFixed(2)} лв`;
      }

      footer.appendChild(price);

      const link = document.createElement("a");
      link.href = `product-template.html?id=${product.id}`;
      link.className = "view-btn";
      link.textContent = "Виж още";

      footer.appendChild(link);
      info.appendChild(footer);

      card.appendChild(slider);
      card.appendChild(info);
      container.appendChild(card);
    });

    console.log(`✅ Намерени резултати: ${filtered.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    document.getElementById("error-message").style.display = "block";
  }
});

function highlight(text, query) {
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(safeQuery, "gi"), match => `<span class="search-highlight">${match}</span>`);
}
