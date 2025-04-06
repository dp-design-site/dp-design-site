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

  console.log(menu.classList.contains("open") ? "✅ Менюто е отворено!" : "❌ Менюто е затворено!");
}

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

// ✅ Обновяване на заглавието и активната страница
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
    if (currentPage === href) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
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
        setTimeout(() => {
          updatePageState();
          checkAdminPanelButton(); // ✅ Преместено тук!
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
function checkAdminPanelButton() {
  const adminPanelLink = document.getElementById("admin-panel-link");
  const userRole = localStorage.getItem("userRole");

  if (!adminPanelLink) {
    console.warn("⚠️ Admin бутонът още не е зареден – пробваме отново след 300ms");
    setTimeout(checkAdminPanelButton, 300); // 🔁 Повторен опит
    return;
  }

  if (userRole === "admin") {
    adminPanelLink.style.display = "block";
    console.log("✅ Потребителят е админ – показваме бутона");
  } else {
    adminPanelLink.style.display = "none";
  }
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

// ✅ Основна инициализация
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("header")) {
    loadComponents();
  } else {
    updatePageState();
  }

  checkAdminPanelButton();
  handleCookieBanner();
});
