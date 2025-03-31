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

    // ❗ Инициализираме менюто при смяна на страницата
    initMenu();
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        const banner = document.getElementById("cookie-banner");
        const acceptBtn = document.getElementById("accept-cookies");
        const declineBtn = document.getElementById("decline-cookies");

        if (!banner || !acceptBtn || !declineBtn) {
            console.error("❌ Банерът за бисквитки не беше намерен!");
            return;
        }

        // ✅ Ако вече има избор, изобщо не показваме банера
        if (localStorage.getItem("cookiesAccepted") !== null) {
            return; // ❌ Спираме тук, банерът никога няма да се покаже
        }

        // ✅ Ако няма избор, банерът се показва
        banner.style.display = "flex";

        acceptBtn.addEventListener("click", function () {
            localStorage.setItem("cookiesAccepted", "true");
            banner.style.display = "none";
        });

        declineBtn.addEventListener("click", function () {
            localStorage.setItem("cookiesAccepted", "false");
            banner.style.display = "none";
        });

    }, 5); // 🔥 Леко забавяне, за да е сигурно, че футерът е зареден
});

// ✅ Чакаме хедъра да се зареди, преди да изпълним основния код
function loadComponents() {
    console.log("🔄 Зареждане на динамични компоненти...");

    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            console.log("✅ Хедърът е зареден!");
            
            // Изчакваме малко, за да гарантираме, че всички елементи са добавени
            setTimeout(() => {
                updatePageState();
                initMenu();
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

document.addEventListener("DOMContentLoaded", function () {
    // Симулираме проверка на администраторски достъп (тук ще е от бекенда)
    const userRole = localStorage.getItem("userRole"); // Вземаме ролята от локалното хранилище

    if (userRole === "admin") {
        document.getElementById("admin-panel-link").style.display = "block";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Проверка за администратор!");

    const adminPanelLink = document.getElementById("admin-panel-link");
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
        console.log("✅ Потребителят е админ - показваме бутона!");
        adminPanelLink.style.display = "block"; // Показва линка
    } else {
        console.log("❌ Потребителят НЕ е админ - скриваме бутона!");
        adminPanelLink.style.display = "none"; // Уверяваме се, че е скрит
    }
});

console.log("✅ script.js е зареден правилно!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 Проверка на потребителската роля...");

    setTimeout(() => {
        const adminPanelLink = document.getElementById("admin-panel-link");
        const userRole = localStorage.getItem("userRole");

        console.log("User role:", userRole);
        console.log("Admin panel link:", adminPanelLink);

        if (adminPanelLink) {
            if (userRole === "admin") {
                adminPanelLink.style.display = "block"; // 👈 Показваме бутона
                console.log("✅ Админ бутонът е активен!");
            } else {
                adminPanelLink.style.display = "none"; // Скриваме го за не-админи
                console.log("🚫 Админ бутонът е скрит.");
            }
        } else {
            console.error("❌ Админ панел елементът не е намерен!");
        }
    }, 500); // ⏳ Изчакваме 500ms за да сме сигурни, че елементът е зареден
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
