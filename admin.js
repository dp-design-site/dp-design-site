document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".menu-button");
    const contentContainer = document.getElementById("admin-content");
    const addProductButton = document.getElementById("add-product-btn");

    function loadContent(section) {
        console.log(`🛠️ Опит за зареждане на: admin-sections/${section}.html`);

        fetch(`admin-sections/${section}.html`)
            .then(response => {
                if (!response.ok) throw new Error("Грешка при зареждане на HTML");
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                console.log(`✅ Заредено съдържание: ${section}.html`);

                // 👉 Зареждаме съответния JS файл и функция
                if (section === "orders") {
                    loadScript("scripts/orders.js").then(() => {
                        if (typeof loadOrders === "function") {
                            console.log("▶️ Извикваме loadOrders()");
                            loadOrders();
                        }
                    });
                } else if (section === "products") {
                    loadScript("scripts/products.js").then(() => {
                        if (typeof loadProducts === "function") {
                            console.log("▶️ Извикваме loadProducts()");
                            loadProducts();
                        }
                    });
                } else if (section === "messages") {
                    loadScript("scripts/messages.js").then(() => {
                        if (typeof loadMessages === "function") {
                            console.log("▶️ Извикваме loadMessages()");
                            loadMessages();
                        }
                    });
                }
            })
            .catch(error => console.error("❌ Грешка при зареждане на съдържание:", error));
    }

    // 👉 Зарежда JS скриптове динамично и връща Promise
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                console.log(`ℹ️ Скриптът вече е зареден: ${src}`);
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            script.onload = () => {
                console.log(`📜 Скриптът е зареден: ${src}`);
                resolve();
            };
            script.onerror = () => reject(new Error(`Неуспешно зареждане на ${src}`));
            document.body.appendChild(script);
        });
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
