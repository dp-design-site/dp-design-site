console.log("🔥 script.js е зареден успешно!");

// ✅ Глобални променливи за хедъра и менюто
let menu, menuOverlay, menuButton;

// ✅ Функция за управление на менюто
function toggleMenu() {
    console.log("☰ Кликнато е върху бутона за меню!");

    if (!menu || !menuOverlay) {
        console.warn("⚠️ Менюто или фонът не са налични!");
        return;
    }

    menu.classList.toggle("open");
    menuOverlay.classList.toggle("visible");

    console.log(menu.classList.contains("open") ? "✅ Менюто е отворено!" : "❌ Менюто е затворено!");
}

// ✅ Функция за инициализиране на менюто
function initMenu() {
    console.log("🚀 Инициализация на менюто!");

    menu = document.getElementById("menu");
    menuOverlay = document.getElementById("menuOverlay");
    menuButton = document.getElementById("menuButton");

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

// ✅ Функция за обновяване на заглавието и активната страница
function updatePageState() {
    console.log("✅ Обновяване на заглавие и активна страница!");

    let titles = {
        "index.html": "DP Design",
        "": "DP Design",
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
        console.warn("⚠️ Не е намерен елемент .header-title!");
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

    // ❗ Винаги инициализираме менюто отново след обновяване
    initMenu();
}

// ✅ Функция за зареждане на хедъра и футъра и изчакване да бъдат добавени в DOM
function loadComponents() {
    console.log("🔄 Зареждане на динамични компоненти...");

    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            let headerContainer = document.getElementById('header');
            if (headerContainer) {
                headerContainer.innerHTML = data;
                console.log("✅ Хедърът е зареден!");

                // ❗ Изчакваме малко, за да гарантираме, че всички елементи са в DOM
                setTimeout(() => {
                    updatePageState();
                    initMenu();
                }, 200);
            } else {
                console.error("❌ Не е намерен контейнер за хедъра!");
            }
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            let footerContainer = document.getElementById('footer');
            if (footerContainer) {
                footerContainer.innerHTML = data;
                console.log("✅ Футърът е зареден!");
            } else {
                console.error("❌ Не е намерен контейнер за футъра!");
            }
        });
}

// ✅ Изчакваме `header.html`, преди да изпълним основния код
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("header")) {
        loadComponents();
    } else {
        console.log("⚠️ Няма динамичен хедър, изпълняваме updatePageState и initMenu директно.");
        updatePageState();
        initMenu();
    }
});

window.addEventListener("popstate", updatePageState);
