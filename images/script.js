console.log("✅ script.js е зареден успешно!");

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
