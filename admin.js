document.addEventListener("DOMContentLoaded", function() {
    const menuButtons = document.querySelectorAll(".menu-button");
    const contentContainer = document.getElementById("admin-content");
    const addProductButton = document.getElementById("add-product-btn");

    function loadContent(section) {
        fetch(`admin-sections/${section}.html`)
            .then(response => response.text())
            .then(data => {
                contentContainer.innerHTML = data;
            })
            .catch(error => console.error("Грешка при зареждане на съдържанието:", error));
    }

    // Клик на меню бутон
    menuButtons.forEach(button => {
        button.addEventListener("click", function() {
            menuButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            const section = this.getAttribute("data-section");
            loadContent(section);
        });
    });

    // Бутон "Добави продукт"
    if (addProductButton) {
        addProductButton.addEventListener("click", function() {
            loadContent("add-product");
        });
    }

    // Зареждаме "Табло" по подразбиране
    loadContent("dashboard");
});
