// 🔍 Инициализация на резултатите при зареждане
document.addEventListener("DOMContentLoaded", async () => {
  await waitForElement("#results-container");
  initSearchResults();
});

// ⏳ Изчакване на елемент
function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 100;
    let elapsed = 0;
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else {
        elapsed += intervalTime;
        if (elapsed >= timeout) {
          clearInterval(interval);
          console.warn(`⚠️ Timeout: ${selector} не се зареди навреме`);
          reject();
        }
      }
    }, intervalTime);
  });
}

// 🧠 Подчертаване на съвпадения
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<span class="search-highlight">$1</span>`);
}

// 🧱 Създаване на продуктова карта с активен слайдър
function createProductCard(product, query) {
  const card = document.createElement("div");
  card.className = "search-card";

  const slider = document.createElement("div");
  slider.className = "search-slider"; // 👈 тук се сменя класът от "slider" на "search-slider"
  slider.setAttribute("onmousedown", "startDrag(event, this)");
  slider.setAttribute("ontouchstart", "startDrag(event, this)");

  if (product.promo_price && product.promo_price !== product.price) {
  const promoBadge = document.createElement("div");
  promoBadge.className = "promo-badge-overlay";
  promoBadge.textContent = "Промо";
  slider.appendChild(promoBadge);
}
  product.images.forEach((img, i) => {
    const image = document.createElement("img");
    image.src = `https://api.dp-design.art/uploads/${img}`;
    image.alt = product.name;
    image.className = i === 0 ? "active" : "";
    image.addEventListener("click", () => openFullscreenSlider(product.images, i));
    slider.appendChild(image);
  });

  // Добавяне на стрелки
  const leftBtn = document.createElement("button");
  leftBtn.className = "slider-btn left";
  leftBtn.innerHTML = "◀";
  leftBtn.onclick = () => prevSlide(slider);

  const rightBtn = document.createElement("button");
  rightBtn.className = "slider-btn right";
  rightBtn.innerHTML = "▶";
  rightBtn.onclick = () => nextSlide(slider);

  slider.appendChild(leftBtn);
  slider.appendChild(rightBtn);

  const info = document.createElement("div");
  info.className = "search-card-info";

  const name = document.createElement("h3");
    const nameLink = document.createElement("a");
    nameLink.href = `product-template.html?id=${product.id}`;
    nameLink.innerHTML = highlightMatch(product.name, query);
    nameLink.className = "product-title-link";
    name.appendChild(nameLink);
    info.appendChild(name);

  if (product.description) {
    const shortDesc = document.createElement("p");
    shortDesc.textContent = product.description.slice(0, 80) + "...";
    shortDesc.className = "short-desc";
    info.appendChild(shortDesc);
}
  
  const footer = document.createElement("div");
  footer.className = "search-card-footer";

  const priceWrapper = document.createElement("div");
  if (product.promo_price && product.promo_price !== product.price) {
    const priceBox = document.createElement("div");
    priceBox.className = "price-box";
  
    const oldPrice = document.createElement("div");
    oldPrice.className = "price old";
    oldPrice.textContent = `${Number(product.price).toFixed(2)} лв.`;
  
    const newPrice = document.createElement("div");
    newPrice.className = "price promo";
    newPrice.textContent = `${Number(product.promo_price).toFixed(2)} лв.`;
  
    priceBox.appendChild(oldPrice);
    priceBox.appendChild(newPrice);
    priceWrapper.appendChild(priceBox);
  }


  const viewBtn = document.createElement("a");
  viewBtn.href = `product-template.html?id=${product.id}`;
  viewBtn.className = "search-view-btn";
  viewBtn.textContent = "Виж още";

  footer.appendChild(priceWrapper);
  footer.appendChild(viewBtn);

  info.appendChild(footer);

  card.appendChild(slider);
  card.appendChild(info);

  return card;
}


// 🔁 Предишна снимка
function prevSlide(slider) {
  const images = slider.querySelectorAll("img");
  const currentIndex = [...images].findIndex((img) =>
    img.classList.contains("active")
  );
  images[currentIndex].classList.remove("active");
  const newIndex = (currentIndex - 1 + images.length) % images.length;
  images[newIndex].classList.add("active");
}

// 🔁 Следваща снимка
function nextSlide(slider) {
  const images = slider.querySelectorAll("img");
  const currentIndex = [...images].findIndex((img) =>
    img.classList.contains("active")
  );
  images[currentIndex].classList.remove("active");
  const newIndex = (currentIndex + 1) % images.length;
  images[newIndex].classList.add("active");
}

// 🖱️ Drag поддръжка
function startDrag(e, slider) {
  const isTouch = e.type === "touchstart";
  const startX = isTouch ? e.touches[0].clientX : e.clientX;

  function onMove(ev) {
    const x = isTouch ? ev.touches[0].clientX : ev.clientX;
    const diff = x - startX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) prevSlide(slider);
      else nextSlide(slider);
      stopDrag();
    }
  }

  function stopDrag() {
    document.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
    document.removeEventListener(isTouch ? "touchend" : "mouseup", stopDrag);
  }

  document.addEventListener(isTouch ? "touchmove" : "mousemove", onMove);
  document.addEventListener(isTouch ? "touchend" : "mouseup", stopDrag);
}

// 🧠 Главна функция за показване на резултати
async function initSearchResults() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q")?.trim();
    const title = document.getElementById("search-results-title");
    const resultsContainer = document.getElementById("results-container");
    const noResults = document.getElementById("no-results");
    const errorMsg = document.getElementById("error-message");

    if (!query || !resultsContainer || !title) return;

    title.textContent = query;

    const res = await fetch("https://api.dp-design.art/products");
    const data = await res.json();

    const results = data.filter((product) =>
      product.name?.toLowerCase().includes(query.toLowerCase())
    );

    resultsContainer.innerHTML = "";
    if (results.length === 0) {
      noResults.style.display = "block";
      return;
    }

    results.forEach((product) => {
      const card = createProductCard(product, query);
      resultsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Грешка при зареждане на резултатите:", err);
    document.getElementById("error-message").style.display = "block";
  }
}

// 🖼️ Отваряне на фулскрийн галерия
function openFullscreenSlider(images, index = 0) {
  const container = document.createElement("div");
  container.className = "fullscreen-view";
  container.innerHTML = `
    <div class="overlay" onclick="this.parentElement.remove()"></div>
    <img src="https://api.dp-design.art/uploads/${images[index]}" class="fullscreen-img">
    <div class="fullscreen-controls">
      <button class="nav-btn" onclick="changeFullscreenImage(-1)">◀</button>
      <button class="nav-btn" onclick="changeFullscreenImage(1)">▶</button>
    </div>
    <button class="close-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  document.body.appendChild(container);

  // Запазваме текущия индекс и снимки
  container.dataset.index = index;
  container.dataset.images = JSON.stringify(images);
}

// ⬅➡ Превключване на снимките във фулскрийн
function changeFullscreenImage(direction) {
  const container = document.querySelector(".fullscreen-view");
  if (!container) return;

  const images = JSON.parse(container.dataset.images);
  let index = parseInt(container.dataset.index);

  index = (index + direction + images.length) % images.length;
  container.dataset.index = index;

  const img = container.querySelector(".fullscreen-img");
  img.src = `https://api.dp-design.art/uploads/${images[index]}`;
}

