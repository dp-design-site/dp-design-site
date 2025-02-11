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

    // ❗ Винаги инициализираме менюто отново, за да работи след динамично зареждане
    initMenu();
}

// ✅ Изчакваме `header.html`, преди да изпълним основния код
function loadComponents() {
    console.log("🔄 Зареждане на динамични компоненти...");

    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            console.log("✅ Хедърът е зареден!");

            // ❗ Изчакваме малко, за да гарантираме, че всички елементи са добавени
            setTimeout(() => {
                updatePageState();
                initMenu(); // 🔥 Менюто ще работи и на втората страница
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

window.addEventListener("popstate", updatePageState);
