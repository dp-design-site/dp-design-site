document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("save-product-btn").addEventListener("click", function(event) {
        event.preventDefault(); // Предотвратяваме стандартното поведение

        // 🚀 Запазване на продукта (тук ще бъде добавена логика за API)
        console.log("✅ Продуктът е запазен!");

        // ✅ Пренасочване обратно към admin.html -> Продукти
        window.location.href = "admin.html?section=products";
    });
});
