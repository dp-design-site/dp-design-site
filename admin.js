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

    if (section === "orders") {
        fetch("admin-sections/orders.html")
            .then(res => res.text())
            .then(html => {
                const container = document.getElementById("admin-content");
                container.innerHTML = html;
                console.log("✅ Заредено съдържание: admin-sections/orders.html");
    
                // ✅ Създаваме нов <script> таг за orders.js
                const script = document.createElement("script");
                script.src = "scripts/orders.js";
                script.defer = true;
                container.appendChild(script); // Добавяме го директно в контейнера
            });
    }

