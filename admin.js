document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".menu-button");
    const contentContainer = document.getElementById("admin-content");
    const addProductButton = document.getElementById("add-product-btn");

    function loadContent(section) {
        fetch(`admin-sections/${section}.html`)
            .then(response => {
                if (!response.ok) throw new Error("Грешка при зареждане на HTML");
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                console.log(`✅ Заредено съдържание: ${section}.html`);

                // 👉 Зареждаме свързания JS скрипт, ако има
                if (section === "orders") {
                    loadScript("scripts/orders.js").then(() => {
                        console.log("▶️ Извикваме loadOrders() след зареждане на скрипта");
                        if (typeof loadOrders === "function") loadOrders();
                    });
                }

                } else if (section === "products") {
                    loadScript("scripts/products.js");
                } else if (section === "dashboard") {;
                    // тук можеш да добавиш скрипт за таблото ако имаш
                } else if (section === "messages") {
                    loadScript("scripts/messages.js");
            }

            })
            .catch(error => console.error("❌ Грешка при зареждане на съдържание:", error));
    }

    // 👉 Зарежда JS скриптове динамично
            function loadScript(src) {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                console.log(`ℹ️ Скриптът вече е зареден: ${src}`);
                return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            document.body.appendChild(script);
            console.log(`📜 Зареден е скриптът: ${src}`);
        }


    // 👉 Клик на меню бутон
    menuButtons.forEach(button => {
        button.addEventListener("click", function () {
            menuButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            const section = this.getAttribute("data-section");
            loadContent(section);
        });
    });

    // 👉 Бутон "Добави продукт"
    if (addProductButton) {
        addProductButton.addEventListener("click", function () {
            loadContent("add-product");
        });
    }

    // 👉 Зареждаме началната секция по подразбиране
    loadContent("dashboard");
});
