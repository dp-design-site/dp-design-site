console.log("🚀 Зареждане на products.js...");

// ✅ Изчакваме DOM да бъде готов и проверяваме за таблицата
function waitForTableAndLoadProducts() {
    console.log("📦 Опит за намиране на таблицата с продукти...");
    const productList = document.getElementById("products-table-body");

    if (!productList) {
        console.error("❌ Продуктовата таблица НЕ е намерена! Опитваме отново след 500ms...");
        setTimeout(waitForTableAndLoadProducts, 500);
    } else {
        console.log("✅ Таблицата с продукти е намерена!");
        loadProducts();
    }
}

// ✅ Функция за зареждане на продукти от API или фиктивни
function loadProducts() {
    console.log("📦 Изпълнява се loadProducts()...");

    fetch("https://api.dp-design.art/products")
        .then(response => {
            if (!response.ok) throw new Error(`Грешен отговор от API: ${response.status}`);
            console.log("🌍 Отговор от API-то:", response);
            return response.json();
        })
        .then(data => {
            console.log("📊 Получени данни:", data);
            populateProductTable(data);
        })
        .catch(error => {
            console.error("❌ Грешка при fetch:", error);
            console.warn("⚠️ Зареждаме фиктивни продукти...");
            loadDummyProducts();
        });
}

// ✅ Функция за попълване на таблицата с продукти
function populateProductTable(products) {
    const productList = document.getElementById("products-table-body");

    if (!productList) {
        console.error("❌ Продуктовата таблица не е намерена!");
        return;
    }

    productList.innerHTML = "";

    if (products.length === 0) {
        document.getElementById("no-products").textContent = "Няма налични продукти.";
        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");
        row.classList.add("product-row");
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.images && product.images.length > 0 ? 'https://api.dp-design.art/uploads/' + product.images[0] : 'images/sample1.jpg'}" alt="Продуктово изображение" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category ? product.category : "Без категория"}</td>
            <td>${product.price} лв.</td>
            <td>${product.promo_price ? product.promo_price + " лв." : "—"}</td>
            <td class="actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </td>
        `;

        row.addEventListener("click", function () {
            document.querySelectorAll(".product-row").forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");
        });

        row.querySelector(".edit-btn").addEventListener("click", function (event) {
            event.stopPropagation();
            window.location.href = `edit-product.html?id=${product.id}`;
        });

        row.querySelector(".delete-btn").addEventListener("click", function (event) {
            event.stopPropagation();
            if (confirm(`⚠️ Сигурни ли сте, че искате да изтриете "${product.name}"?`)) {
                deleteProduct(product.id);
            }
        });

        productList.appendChild(row);
    });

    console.log("✅ Продуктите са заредени успешно!");
}

// ✅ Зареждаме фиктивни продукти ако няма API
function loadDummyProducts() {
    console.log("📦 Зареждаме фиктивни продукти...");

    const dummyProducts = [
        {
            id: 1,
            images: ["images/sample1.jpg"],
            name: "3D Принтирана Фигура",
            category: "Персонализирани",
            price: "100",
            promo_price: "80"
        },
        {
            id: 2,
            images: ["images/sample2.jpg"],
            name: "3D Декоративна Статуетка",
            category: "Дом и декорация",
            price: "120",
            promo_price: null
        }
    ];

    populateProductTable(dummyProducts);
}

// ✅ Функция за активиране на бутона "Добави продукт"
function activateAddProductButton() {
    const addProductBtn = document.getElementById("add-product-btn");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", function () {
            window.location.href = "https://dp-design.art/add-product.html";
        });
        console.log("✅ Бутонът 'Добави продукт' е активен!");
    } else {
        console.error("❌ Бутонът 'Добави продукт' не е намерен!");
        setTimeout(activateAddProductButton, 500);
    }
}

// ✅ Започваме проверка за таблицата и бутона "Добави продукт"
waitForTableAndLoadProducts();
activateAddProductButton();
