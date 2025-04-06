document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".menu-button");
    const contentContainer = document.getElementById("admin-content");
    const addProductButton = document.getElementById("add-product-btn");

    function loadContent(section, params = "") {
        console.log(`🛠️ Опит за зареждане на: admin-sections/${section}.html`);
        const contentContainer = document.getElementById("admin-content");
        const sectionPath = `admin-sections/${section}.html${params}`;

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

                } else if (section === "view-message") {
                loadScript("scripts/view-message.js").then(() => {
                    if (typeof loadViewMessage === "function") loadViewMessage();
                });
                }
            })
            .catch(error => console.error("❌ Грешка при зареждане на съдържание:", error));
    }

            function updateMenuCounters() {
              Promise.all([
                fetch("https://api.dp-design.art/api/messages").then(res => res.json()),
                fetch("https://api.dp-design.art/api/orders").then(res => res.json())
              ])
              .then(([messages, orders]) => {
                const unreadMessages = Array.isArray(messages) ? messages.filter(m => !m.is_read).length : 0;
                const unreadOrders = Array.isArray(orders) ? orders.filter(o => !o.is_read).length : 0;
            
                const msgCounter = document.getElementById("msg-counter");
                const orderCounter = document.getElementById("order-counter");
            
                // ✅ Обновяваме текстовете
                msgCounter.textContent = unreadMessages > 0 ? unreadMessages : "";
                orderCounter.textContent = unreadOrders > 0 ? unreadOrders : "";
            
                // ✅ Показваме/скриваме само при нужда
                msgCounter.style.display = unreadMessages > 0 ? "inline-flex" : "none";
                orderCounter.style.display = unreadOrders > 0 ? "inline-flex" : "none";
            
                console.log("🔄 Обновени броячи:", { unreadMessages, unreadOrders });
              })
              .catch(err => {
                console.error("❌ Грешка при зареждане на броячи:", err);
                // Скриваме броячите при грешка
                document.getElementById("msg-counter").style.display = "none";
                document.getElementById("order-counter").style.display = "none";
              });
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

document.addEventListener("DOMContentLoaded", function () {
    const addProductBtn = document.getElementById("add-product-btn");

    if (addProductBtn) {
        addProductBtn.addEventListener("click", function () {
            window.location.href = "add-product.html"; // Пренасочва към формата за добавяне
        });
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const productList = document.getElementById("product-list");

    if (!productList) return;

    try {
        const response = await fetch("https://api.dp-design.art/products");
        const products = await response.json();

        if (products.length === 0) {
            productList.innerHTML = "<p>❌ Няма налични продукти.</p>";
            return;
        }

        productList.innerHTML = ""; // Изчистваме съобщението за зареждане

        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `
                <p><strong>${product.name}</strong></p>
                <p>Цена: ${product.price} лв.</p>
                <p>Категория: ${product.category || "Няма категория"}</p>
                <button class="edit-btn" data-id="${product.id}">✏️ Редактиране</button>
                <button class="delete-btn" data-id="${product.id}">🗑️ Изтриване</button>
            `;

            productList.appendChild(productItem);
        });

        // Добавяме събития за бутоните
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const productId = this.getAttribute("data-id");
                window.location.href = `edit-product.html?id=${productId}`;
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async function () {
                const productId = this.getAttribute("data-id");
                if (confirm("❗ Сигурни ли сте, че искате да изтриете този продукт?")) {
                    await deleteProduct(productId);
                }
            });
        });

    } catch (error) {
        console.error("Грешка при зареждане на продуктите:", error);
        productList.innerHTML = "<p>⚠️ Проблем при зареждане на продуктите.</p>";
    }
});

async function deleteProduct(productId) {
    try {
        const response = await fetch(`https://api.dp-design.art/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert("✅ Продуктът беше изтрит успешно!");
            location.reload(); // Презареждаме страницата, за да обновим списъка
        } else {
            alert("❌ Грешка при изтриване на продукта.");
        }
    } catch (error) {
        console.error("Грешка:", error);
        alert("⚠️ Възникна проблем при изтриването.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const addProductButton = document.getElementById("add-product-btn");

    if (addProductButton) {
        addProductButton.addEventListener("click", function() {
            fetch("admin-sections/add-product.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("admin-content").innerHTML = data;
                    console.log("✅ Заредена е формата за добавяне на продукти!");
                })
                .catch(error => console.error("❌ Грешка при зареждане на формата:", error));
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll(".product-row");

    rows.forEach(row => {
        row.addEventListener("click", function() {
            rows.forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");

            console.log("✅ Избран продукт:", this.querySelector("td").textContent);
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll(".product-row");

    rows.forEach(row => {
        row.addEventListener("click", function() {
            // Премахваме "selected" от всички редове
            rows.forEach(r => r.classList.remove("selected"));

            // Добавяме "selected" само на текущия ред
            this.classList.add("selected");

            console.log("✅ Избран продукт:", this.querySelector("td:nth-child(3)").textContent);
        });
    });

    // Бутон "Добави продукт" отваря add-product.html
    document.getElementById("add-product-btn").addEventListener("click", function() {
        window.location.href = "add-product.html";
    });
});

document.getElementById("save-product-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Предотвратяваме стандартното поведение

    // 🚀 Запазване на продукта (тук ще бъде добавена логика за API)
    console.log("✅ Продуктът е запазен!");

    // ✅ Пренасочване обратно към admin.html -> Продукти
    window.location.href = "admin.html?section=products";
});

console.log("🔥 script.js е зареден успешно!");

window.addEventListener("popstate", updatePageState);

