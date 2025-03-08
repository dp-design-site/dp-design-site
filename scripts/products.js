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
