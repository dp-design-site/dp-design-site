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
        console.warn(`⏱ Timeout: ${selector} не се зареди навреме`);
        reject();
      }
    }, 50);
  });
}

function highlightMatch(text = "", query) {
  if (!text || !query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

function createSlider(images) {
  if (!Array.isArray(images) || images.length === 0) return "";

  const sliderImages = product.images.map((img, i) =>
  `<img src="https://api.dp-design.art/uploads/${img}" 
        class="${i === 0 ? 'active' : ''}" 
        alt="${product.name}">`
).join("");

const slider = `
  <div class="slider" onmousedown="startDrag(event, this)" ontouchstart="startDrag(event, this)">
    ${sliderImages}
    <button class="slider-btn left" onclick="prevSlide(this)">◀</button>
    <button class="slider-btn right" onclick="nextSlide(this)">▶</button>
  </div>`;


  return `
    <div class="slider" onmousedown="startDrag(event, this)" ontouchstart="startDrag(event, this)">
      ${slides}
      <button class="slider-btn left" onclick="prevSlide(this)">◀</button>
      <button class="slider-btn right" onclick="nextSlide(this)">▶</button>
    </div>
  `;
}

function createProductCard(product, query) {
  const name = highlightMatch(product.name, query);
  const short = highlightMatch(product.shortDescription || "", query);
  const price = parseFloat(product.price) || 0;
  const promo = parseFloat(product.promo) || null;

  const priceHTML = promo
    ? `<span class="price old">${price.toFixed(2)} лв</span> <span class="price promo">${promo.toFixed(2)} лв</span>`
    : `<span class="price">${price.toFixed(2)} лв</span>`;

  const promoBadge = promo ? `<span class="promo-badge">Промо</span>` : "";
  const sliderHTML = createSlider(product.images);

  return `
    <div class="search-card">
      <div class="search-slider">${sliderHTML}</div>
      <div class="search-card-info">
        <h3>${name} ${promoBadge}</h3>
        <p>${short}</p>
        <div class="search-card-footer">
          ${priceHTML}
          <a class="search-view-btn" href="product-template.html?id=${product.id}">Виж още</a>
        </div>
      </div>
    </div>
  `;
}

// Сортиране: най-точни съвпадения най-отгоре
function sortByRelevance(products, query) {
  const q = query.toLowerCase();
  return products.sort((a, b) => {
    const aName = a.name?.toLowerCase() || "";
    const bName = b.name?.toLowerCase() || "";
    const aIndex = aName.indexOf(q);
    const bIndex = bName.indexOf(q);
    if (aIndex === bIndex) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

async function initSearchResults() {
  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;

    await waitForElement("#results-container");

    const title = document.getElementById("search-results-title");
    if (title) {
      title.textContent = `"${query}"`;
    }

    const res = await fetch("https://api.dp-design.art/products");
    const all = await res.json();

    const results = all.filter(p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    );

    const sorted = sortByRelevance(results, query);
    const container = document.getElementById("results-container");

    if (!container) return;

    if (sorted.length === 0) {
      document.getElementById("no-results").style.display = "block";
      return;
    }

    container.innerHTML = sorted.map(p => createProductCard(p, query)).join("");
    console.log(`✅ Намерени резултати: ${sorted.length}`);
  } catch (err) {
    console.error("❌ Грешка при зареждане на резултатите:", err);
    document.getElementById("error-message").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", initSearchResults);

// Слайдване с бутони
function nextSlide(btn) {
  const slider = btn.closest(".slider");
  const images = slider.querySelectorAll("img");
  const current = slider.querySelector("img.active");
  const index = Array.from(images).indexOf(current);
  images[index].classList.remove("active");
  const next = (index + 1) % images.length;
  images[next].classList.add("active");
}

function prevSlide(btn) {
  const slider = btn.closest(".slider");
  const images = slider.querySelectorAll("img");
  const current = slider.querySelector("img.active");
  const index = Array.from(images).indexOf(current);
  images[index].classList.remove("active");
  const prev = (index - 1 + images.length) % images.length;
  images[prev].classList.add("active");
}

// Drag (мишка/пръст)
let startX = 0;
let isDragging = false;

function startDrag(e, slider) {
  isDragging = true;
  startX = (e.touches?.[0] || e).clientX;

  const move = ev => {
    if (!isDragging) return;
    const currentX = (ev.touches?.[0] || ev).clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 50) {
      isDragging = false;
      if (diff > 0) prevSlide(slider.querySelector(".slider-btn.left"));
      else nextSlide(slider.querySelector(".slider-btn.right"));
    }
  };

  const end = () => {
    isDragging = false;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", end);
    document.removeEventListener("touchmove", move);
    document.removeEventListener("touchend", end);
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", end);
  document.addEventListener("touchmove", move);
  document.addEventListener("touchend", end);
}

function prevSlide(btn) {
  const slider = btn.parentElement;
  const imgs = slider.querySelectorAll("img");
  let idx = [...imgs].findIndex(img => img.classList.contains("active"));
  imgs[idx].classList.remove("active");
  imgs[(idx - 1 + imgs.length) % imgs.length].classList.add("active");
}

function nextSlide(btn) {
  const slider = btn.parentElement;
  const imgs = slider.querySelectorAll("img");
  let idx = [...imgs].findIndex(img => img.classList.contains("active"));
  imgs[idx].classList.remove("active");
  imgs[(idx + 1) % imgs.length].classList.add("active");
}

let startX = 0;
function startDrag(e, slider) {
  const imgs = slider.querySelectorAll("img");
  const isTouch = e.type === "touchstart";
  startX = isTouch ? e.touches[0].clientX : e.clientX;

  function onMove(ev) {
    const x = isTouch ? ev.touches[0].clientX : ev.clientX;
    const diff = x - startX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) prevSlide(slider.querySelector(".slider-btn.left"));
      else nextSlide(slider.querySelector(".slider-btn.right"));
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

