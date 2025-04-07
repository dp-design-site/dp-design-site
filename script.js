console.log("🔥 script.js е зареден успешно!");

// ✅ Управление на менюто
function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (!menu || !menuOverlay) {
    console.warn("⚠️ Менюто или фонът не са намерени!");
    return;
  }

  menu.classList.toggle("open");
  menuOverlay.classList.toggle("visible");
}

// ✅ Инициализация на менюто
function initMenu() {
  const menuButton = document.getElementById("menuButton");
  const menuOverlay = document.getElementById("menuOverlay");

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  } else {
    console.warn("⚠️ menuButton не е намерен");
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", toggleMenu);
  } else {
    console.warn("⚠️ menuOverlay не е намерен");
  }
}

// ✅ Обновяване на заглавие и активна страница
function updatePageState() {
  const titles = {
    "index.html": "DP Design",
    "": "DP Design",
    "personalized.html": "Персонализирани продукти",
    "home_decor.html": "Дом и декорация",
    "prototyping.html": "3D Прототипиране",
    "contacts.html": "Контакти"
  };

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const headerTitle = document.querySelector(".header-title");

  if (headerTitle) {
    headerTitle.textContent = titles[currentPage] || "DP Design";
  }

  const menuLinks = document.querySelectorAll(".nav-menu a");
  menuLinks.forEach(link => {
    const href = link.getAttribute("href").split("/").pop() || "index.html";
    link.classList.toggle("active", currentPage === href);
  });

  initMenu();
}

// ✅ Зареждане на хедър и футър
function loadComponents() {
  console.log("🔄 Зареждане на динамични компоненти...");

  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      const header = document.getElementById("header");
      if (header) {
        header.innerHTML = data;
        console.log("✅ Хедърът е зареден!");
        setTimeout(() => {
          updatePageState();
          checkAdminPanelButton();
          initSearch(); // 👈 Тук активираме търсачката
        }, 100);
      }
    });

  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      const footer = document.getElementById("footer");
      if (footer) {
        footer.innerHTML = data;
        console.log("✅ Футърът е зареден!");
      }
    });
}

// ✅ Проверка за админ бутон
function checkAdminPanelButton(retryCount = 0) {
  const adminPanelLink = document.getElementById("admin-panel-link");
  const userRole = localStorage.getItem("userRole");

  if (!adminPanelLink) {
    if (retryCount < 5) {
      console.warn(`⚠️ Admin бутонът още не е зареден – пробваме отново след 300ms`);
      setTimeout(() => checkAdminPanelButton(retryCount + 1), 300);
    } else {
      console.error("❌ Admin бутонът не се зареди дори след 5 опита");
    }
    return;
  }

  adminPanelLink.style.display = userRole === "admin" ? "block" : "none";
  console.log(`✅ Потребителят е ${userRole === "admin" ? "админ – показваме бутона" : "не е админ – скриваме бутона"}`);
}

// ✅ Банер за бисквитки
function handleCookieBanner() {
  setTimeout(() => {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const declineBtn = document.getElementById("decline-cookies");

    if (!banner || !acceptBtn || !declineBtn) {
      console.warn("⚠️ Cookie банер не е намерен");
      return;
    }

    if (localStorage.getItem("cookiesAccepted") !== null) return;

    banner.style.display = "flex";

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      banner.style.display = "none";
    });

    declineBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "false");
      banner.style.display = "none";
    });
  }, 500);
}

// ✅ Инициализация на търсачката
function initSearch() {
  console.log("🔍 Инициализация на търсачката!");

  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const icon = document.getElementById("search-icon");

  if (!form || !input) {
    console.warn("❌ Търсачката не е намерена!");
    return;
  }

  // ✅ При натискане на Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query.length === 0) return;
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
  });

  // ✅ В мобилен режим: показване на полето
  if (icon) {
    icon.addEventListener("click", () => {
      input.classList.toggle("visible");
      if (input.classList.contains("visible")) {
        input.focus();
      }
    });
  }
}

// ✅ Основна инициализация
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("header")) {
    loadComponents();
  } else {
    updatePageState();
    checkAdminPanelButton();
    initSearch(); // ❗ Ако header.html не се зарежда динамично
  }

  handleCookieBanner();
});
