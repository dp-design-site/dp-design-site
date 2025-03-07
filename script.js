console.log("🔥 script.js е зареден успешно!");

// ✅ Функция за управление на менюто
function toggleMenu() {
    console.log("☰ Кликнато е върху бутона за меню!");

    let menu = document.getElementById("menu");
    let menuOverlay = document.getElementById("menuOverlay");

    if (!menu || !menuOverlay) {
        console.warn("⚠️ Менюто или фонът не са намерени! Прекратяване на toggleMenu.");
        return;
    }

    menu.classList.toggle("open");
    menuOverlay.classList.toggle("visible");

    console.log(menu.classList.contains("open") ? "✅ Менюто е отворено!" : "❌ Менюто е затворено!");
}

// ✅ Функция за инициализиране на менюто
function initMenu() {
    console.log("🚀 Инициализация на менюто!");

    let menuButton = document.getElementById("menuButton");
    let menuOverlay = document.getElementById("menuOverlay");

    if (menuButton) {
        menuButton.addEventListener("click", toggleMenu);
        console.log("✅ Бутонът за меню е свързан!");
    } else {
        console.warn("⚠️ Бутонът за меню не е намерен!");
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", toggleMenu);
        console.log("✅ Фонът на менюто е свързан!");
    } else {
        console.warn("⚠️ Фонът на менюто не е намерен!");
    }
}

// ✅ Функция за динамично заглавие и активна страница
function updatePageState() {
    console.log("✅ Обновяване на заглавие и активна страница!");

    let titles = {
        "index.html": "DP Design",
        "": "DP Design", // За root URL без 'index.html'
        "personalized.html": "Персонализирани продукти",
        "home_decor.html": "Дом и декорация",
        "prototyping.html": "3D Прототипиране",
        "contacts.html": "Контакти"
    };

    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    let headerTitle = document.querySelector(".header-title");

    if (headerTitle) {
        headerTitle.textContent = titles[currentPage] || "DP Design";
        console.log("✅ Заглавието е сменено на: ", headerTitle.textContent);
    } else {
        console.warn("⚠️ Не е намерен елемент .header-title! Заглавието няма да се промени.");
    }

    let menuLinks = document.querySelectorAll(".nav-menu a");

    menuLinks.forEach(link => {
        let href = link.getAttribute("href").split("/").pop() || "index.html";
        if (currentPage === href) {
            link.classList.add("active");
            console.log("✅ Активната страница е: ", href);
        } else {
            link.classList.remove("active");
        }
    });

    // ❗ Инициализираме менюто при смяна на страницата
    initMenu();
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        const banner = document.getElementById("cookie-banner");
        const acceptBtn = document.getElementById("accept-cookies");
        const declineBtn = document.getElementById("decline-cookies");

        if (!banner || !acceptBtn || !declineBtn) {
            console.error("❌ Банерът за бисквитки не беше намерен!");
            return;
        }

        // ✅ Ако вече има избор, изобщо не показваме банера
        if (localStorage.getItem("cookiesAccepted") !== null) {
            return; // ❌ Спираме тук, банерът никога няма да се покаже
        }

        // ✅ Ако няма избор, банерът се показва
        banner.style.display = "flex";

        acceptBtn.addEventListener("click", function () {
            localStorage.setItem("cookiesAccepted", "true");
            banner.style.display = "none";
        });

        declineBtn.addEventListener("click", function () {
            localStorage.setItem("cookiesAccepted", "false");
            banner.style.display = "none";
        });

    }, 5); // 🔥 Леко забавяне, за да е сигурно, че футерът е зареден
});

// ✅ Чакаме хедъра да се зареди, преди да изпълним основния код
function loadComponents() {
    console.log("🔄 Зареждане на динамични компоненти...");

    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            console.log("✅ Хедърът е зареден!");
            
            // Изчакваме малко, за да гарантираме, че всички елементи са добавени
            setTimeout(() => {
                updatePageState();
                initMenu();
            }, 100);
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
            console.log("✅ Футърът е зареден!");
        });
}

// ✅ Изпълняваме `loadComponents()` само ако има динамичен хедър
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("header")) {
        loadComponents();
    } else {
        console.log("⚠️ Няма динамичен хедър, изпълняваме updatePageState и initMenu директно.");
        updatePageState();
        initMenu();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Симулираме проверка на администраторски достъп (тук ще е от бекенда)
    const userRole = localStorage.getItem("userRole"); // Вземаме ролята от локалното хранилище

    if (userRole === "admin") {
        document.getElementById("admin-panel-link").style.display = "block";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Проверка за администратор!");

    const adminPanelLink = document.getElementById("admin-panel-link");
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
        console.log("✅ Потребителят е админ - показваме бутона!");
        adminPanelLink.style.display = "block"; // Показва линка
    } else {
        console.log("❌ Потребителят НЕ е админ - скриваме бутона!");
        adminPanelLink.style.display = "none"; // Уверяваме се, че е скрит
    }
});


window.addEventListener("popstate", updatePageState);
