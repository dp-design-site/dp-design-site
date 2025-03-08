document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Зареждане на scripts/products.js...");

    const tableBody = document.getElementById("products-table-body");
    const addProductButton = document.getElementById("add-product-btn");

    // 🛒 Динамично зареждане на фиктивни продукти (ако няма API)
    if (tableBody) {
        tableBody.innerHTML = `
            <tr class="product-row">
                <td>1</td>
                <td><img src="images/sample1.jpg" alt="Product 1" width="50"></td>
                <td>3D Принтирана Фигура</td>
                <td>Персонализирани</td>
                <td>100 лв.</td>
                <td>80 лв.</td>
                <td class="actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </td>
            </tr>
            <tr class="product-row">
                <td>2</td>
                <td><img src="images/sample2.jpg" alt="Product 2" width="50"></td>
                <td>3D Декоративна Статуетка</td>
                <td>Дом и декорация</td>
                <td>120 лв.</td>
                <td>-</td>
                <td class="actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </td>
            </tr>
        `;
    }

    // ✅ Добавяне на селекция на реда при клик
    document.querySelectorAll(".product-row").forEach(row => {
        row.addEventListener("click", function() {
            document.querySelectorAll(".product-row").forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");

            // Показване на бутоните само за избрания ред
            document.querySelectorAll(".actions button").forEach(btn => btn.style.display = "none");
            this.querySelectorAll(".actions button").forEach(btn => btn.style.display = "inline-block");

            console.log("✅ Избран продукт:", this.children[2].textContent);
        });
    });

    // ✅ Бутон "Добави продукт" – пренасочва към add-product.html
    if (addProductButton) {
        addProductButton.addEventListener("click", function() {
            window.location.href = "admin-sections/add-product.html";
        });
    }

    // ✅ Бутон за редактиране на продукт
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function(event) {
            event.stopPropagation(); // Спира пропагирането, за да не тригерира селекцията
            const productId = this.closest("tr").children[0].textContent;
            console.log("📝 Редактиране на продукт ID:", productId);
            window.location.href = `edit-product.html?id=${productId}`;
        });
    });

    // ✅ Бутон за изтриване на продукт
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function(event) {
            event.stopPropagation();
            const productRow = this.closest("tr");
            const productName = productRow.children[2].textContent;

            if (confirm(`⚠️ Сигурни ли сте, че искате да изтриете "${productName}"?`)) {
                productRow.remove();
                console.log("🗑️ Продуктът е изтрит:", productName);
            }
        });
    });
});

function initProductTable() {
    const productRows = document.querySelectorAll(".product-row");

    productRows.forEach(row => {
        row.addEventListener("click", function() {
            productRows.forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");

            console.log("✅ Избран продукт:", this.querySelector("td:nth-child(3)").textContent);
        });
    });

    console.log("✅ Таблицата с продукти е инициализирана!");
}

// ✅ Извикваме функцията след зареждане на съдържанието
setTimeout(initProductTable, 500);

