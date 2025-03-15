console.log("🚀 Зареждане на products.js...");

// ✅ Правим проверка дали `products-table-body` съществува
const productList = document.getElementById("products-table-body");
if (!productList) {
    console.error("❌ Продуктовата таблица не е намерена! Скриптът няма да се изпълни.");
} else {
    console.log("✅ Таблицата с продукти е намерена!");
    initProducts();
}

// ✅ Функция за зареждане на продукти
function initProducts() {
    console.log("📦 Изпълнява се loadProducts()");
    console.log("🔄 Инициализиране на продуктовата таблица...");
    productList.innerHTML = `
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
    `;

    // ✅ Добавяне на събитие за селектиране на ред
    document.querySelectorAll(".product-row").forEach(row => {
        row.addEventListener("click", function() {
            document.querySelectorAll(".product-row").forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");
        });
    });

    console.log("✅ Продуктите са заредени успешно!");
}

// ✅ Свързваме бутона "Добави продукт"
setTimeout(() => {
    const addProductBtn = document.getElementById("add-product-btn");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", function() {
            window.location.href = "https://dp-design.art/add-product.html";
        });
        console.log("✅ Бутона 'Добави продукт' е активен!");
    } else {
        console.error("❌ Бутона 'Добави продукт' не е намерен!");
    }
}, 500);


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

    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(() => {
            const productList = document.getElementById("product-list");
            if (!productList) {
                console.error("❌ Продуктовата таблица все още не е заредена! Опитваме отново...");
                return;
            }
    
            console.log("✅ Продуктовата таблица е намерена!", productList);
            initializeProductTable(); // Функция за зареждане на продуктите
        }, 300); // Изчакване от 300ms
    });

console.log("🚀 Стартиране на products.js...");
setTimeout(() => {
    const tableBody = document.getElementById("products-table-body");
    if (tableBody) {
        console.log("✅ Таблицата с продукти е намерена!");
    } else {
        console.error("❌ Таблицата с продукти НЕ е намерена!");
    }
}, 1000);



// ✅ Извикваме функцията след зареждане на съдържанието
setTimeout(initProductTable, 500);

