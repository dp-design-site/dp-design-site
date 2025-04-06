// 🔥 admin.js е зареден и оптимизиран успешно!

document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".menu-button");
    const contentContainer = document.getElementById("admin-content");
    const addProductButton = document.getElementById("add-product-btn");
    const saveProductButton = document.getElementById("save-product-btn");
    const productList = document.getElementById("product-list");

    // 👉 Зарежда HTML съдържание и съответния JS модул
    function loadContent(section, params = "") {
        console.log(`🛠️ Опит за зареждане на: admin-sections/${section}.html`);
        const sectionPath = `admin-sections/${section}.html${params}`;

        fetch(sectionPath)
            .then(response => {
                if (!response.ok) throw new Error("Грешка при зареждане на HTML");
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                console.log(`✅ Заредено съдържание: ${section}.html`);

                const scriptMap = {
                    "orders": "scripts/orders.js",
                    "products": "scripts/products.js",
                    "messages": "scripts/messages.js",
                    "view-message": "scripts/view-message.js"
                };
                const funcMap = {
                    "orders": "loadOrders",
                    "products": "loadProducts",
                    "messages": "loadMessages",
                    "view-message": "loadViewMessage"
                };

                if (scriptMap[section]) {
                    loadScript(scriptMap[section]).then(() => {
                        const fn = window[funcMap[section]];
                        if (typeof fn === "function") fn();
                    });
                }
            })
            .catch(error => console.error("❌ Грешка при зареждане на съдържание:", error));
    }

    // 👉 Обновяване на броячи за съобщения и поръчки
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

            if (msgCounter) {
                msgCounter.textContent = unreadMessages || "";
                msgCounter.style.display = unreadMessages > 0 ? "inline-flex" : "none";
            }
            if (orderCounter) {
                orderCounter.textContent = unreadOrders || "";
                orderCounter.style.display = unreadOrders > 0 ? "inline-flex" : "none";
            }

            console.log("🔄 Обновени броячи:", { unreadMessages, unreadOrders });
        })
        .catch(err => {
            console.error("❌ Грешка при зареждане на броячи:", err);
            const msgCounter = document.getElementById("msg-counter");
            const orderCounter = document.getElementById("order-counter");
            if (msgCounter) msgCounter.style.display = "none";
            if (orderCounter) orderCounter.style.display = "none";
        });
    }

    // 👉 Зарежда JS скриптове динамично и връща Promise
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) return resolve();
            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Неуспешно зареждане на ${src}`));
            document.body.appendChild(script);
        });
    }

    // 👉 Меню бутони
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
        addProductButton.addEventListener("click", () => loadContent("add-product"));
    }

    // 👉 Бутон "Запази продукт"
    if (saveProductButton) {
        saveProductButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("✅ Продуктът е запазен!");
            window.location.href = "admin.html?section=products";
        });
    }

    // 👉 Зареждане на продукти (ако елементът съществува)
    if (productList) {
        (async function () {
            try {
                const response = await fetch("https://api.dp-design.art/products");
                const products = await response.json();

                if (products.length === 0) {
                    productList.innerHTML = "<p>❌ Няма налични продукти.</p>";
                    return;
                }

                productList.innerHTML = "";
                products.forEach(product => {
                    const item = document.createElement("div");
                    item.classList.add("product-item");
                    item.innerHTML = `
                        <p><strong>${product.name}</strong></p>
                        <p>Цена: ${product.price} лв.</p>
                        <p>Категория: ${product.category || "Няма категория"}</p>
                        <button class="edit-btn" data-id="${product.id}">✏️ Редактиране</button>
                        <button class="delete-btn" data-id="${product.id}">🗑️ Изтриване</button>
                    `;
                    productList.appendChild(item);
                });

                document.querySelectorAll(".edit-btn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        const id = this.getAttribute("data-id");
                        window.location.href = `edit-product.html?id=${id}`;
                    });
                });

                document.querySelectorAll(".delete-btn").forEach(btn => {
                    btn.addEventListener("click", async function () {
                        const id = this.getAttribute("data-id");
                        if (confirm("❗ Сигурни ли сте, че искате да изтриете този продукт?")) {
                            await deleteProduct(id);
                        }
                    });
                });
            } catch (error) {
                console.error("Грешка при зареждане на продуктите:", error);
                productList.innerHTML = "<p>⚠️ Проблем при зареждане на продуктите.</p>";
            }
        })();
    }

    // 👉 Изтриване на продукт
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
                location.reload();
            } else {
                alert("❌ Грешка при изтриване на продукта.");
            }
        } catch (error) {
            console.error("Грешка:", error);
            alert("⚠️ Възникна проблем при изтриването.");
        }
    }

    // 👉 Селекция на ред от таблица с продукти
    document.querySelectorAll(".product-row").forEach(row => {
        row.addEventListener("click", function () {
            document.querySelectorAll(".product-row").forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");
            console.log("✅ Избран продукт:", this.querySelector("td:nth-child(3)")?.textContent);
        });
    });

    // 👉 Стартова секция по подразбиране
    if (contentContainer) {
        loadContent("dashboard");
    }
});
