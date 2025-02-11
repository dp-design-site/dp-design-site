console.log("🔥 script.js е зареден успешно!");

// ✅ Глобално задаване на toggleMenu
function toggleMenu() {
    console.log("☰ Кликнато е върху бутона за меню!");

    let menu = document.getElementById("menu");
    let menuOverlay = document.getElementById("menuOverlay");

    if (!menu || !menuOverlay) {
        console.error("❌ Менюто или фонът не са намерени!");
        return;
    }

    menu.classList.toggle("open");
    menuOverlay.classList.toggle("visible");

    console.log(menu.classList.contains("open") ? "✅ Менюто е отворено!" : "❌ Менюто е затворено!");
}

// ✅ Присвояване на функцията към window
window.toggleMenu = toggleMenu;

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Страницата е заредена!");

    const menuButton = document.getElementById("menuButton");
    const menuOverlay = document.getElementById("menuOverlay");

    if (menuButton) {
        menuButton.addEventListener("click", toggleMenu);
    } else {
        console.error("❌ Бутонът за меню не е намерен!");
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", toggleMenu);
    } else {
        console.error("❌ Фонът на менюто не е намерен!");
    }

    console.log("🚀 Проверка на window.toggleMenu:", window.toggleMenu);
});

// ✅ Динамично заглавие
window.addEventListener("load", function () {
    console.log("✅ Динамично заглавие и активна страница - старт!");

    // Обект с заглавия за различните страници
    let titles = {
        "index.html": "DP Design",
        "": "DP Design", // За root URL без 'index.html'
        "personalized.html": "Персонализирани продукти",
        "home_decor.html": "Дом и декорация",
        "prototyping.html": "3D Прототипиране",
        "contacts.html": "Контакти"
    };

    let currentPage = window.location.pathname.split("/").pop() || "index.html"; // Ако е празно -> значи е 'index.html'
    let headerTitle = document.querySelector(".header-title"); // Търсим заглавието в хедъра

    if (headerTitle) {
        headerTitle.textContent = titles[currentPage] || "DP Design"; // Ако страницата не е в списъка -> "DP Design"
        console.log("✅ Заглавието е сменено на: ", headerTitle.textContent);
    } else {
        console.error("❌ Не е намерен елемент .header-title!");
    }

    // ✅ Активна страница в менюто
    let menuLinks = document.querySelectorAll(".nav-menu a");

    menuLinks.forEach(link => {
        let href = link.getAttribute("href").split("/").pop() || "index.html"; // Ако е празно, значи е index.html
        if (currentPage === href) {
            link.classList.add("active");
            console.log("✅ Активната страница е: ", href);
        } else {
            link.classList.remove("active"); // Премахва .active от всички останали
        }
    });
});


// ✅ Активна страница в менюто
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Активна страница - старт!");

    let currentPage = window.location.pathname.split("/").pop(); // Взимаме текущия файл
    let menuLinks = document.querySelectorAll(".nav-menu a"); // Взимаме всички линкове в менюто

    menuLinks.forEach(link => {
        let href = link.getAttribute("href").split("/").pop(); // Взимаме href на всеки линк
        if (currentPage === href) {
            link.classList.add("active"); // Добавяме клас .active към съвпадащата страница
            console.log("✅ Активната страница е: ", href);
        }
    });
});
