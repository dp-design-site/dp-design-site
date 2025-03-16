document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("save-product-btn").addEventListener("click", function(event) {
        event.preventDefault(); // Предотвратяваме стандартното поведение

        // 🚀 Запазване на продукта (тук ще бъде добавена логика за API)
        console.log("✅ Продуктът е запазен!");

        // ✅ Пренасочване обратно към admin.html -> Продукти
        window.location.href = "admin.html?section=products";
    });
});
async function saveProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const promoPrice = document.getElementById('promo-price').value;
    const category = document.getElementById('product-category').value;
    const imageUpload = document.getElementById('image-upload').files;

    if (!name || !price || !category) {
        alert("❌ Моля, попълнете задължителните полета!");
        return;
    }

    console.log("📌 Запазване на продукта:", { name, description, price, promoPrice, category });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("promo_price", promoPrice);
    formData.append("category", category);

    for (let i = 0; i < imageUpload.length; i++) {
    formData.append("images", imageUpload[i], imageUpload[i].name);
}


    try {
        const response = await fetch("https://api.dp-design.art/products", {
            method: "POST",
            headers: { "Accept": "application/json" }, // Приема само JSON
            body: formData
        });


        const result = await response.json();
        if (response.ok) {
            console.log("✅ Продуктът е добавен:", result);
            alert("✅ Продуктът е качен успешно!");
            window.location.href = "admin.html?section=products";
        } else {
            console.error("❌ Грешка при качване:", result);
            alert("❌ Неуспешно качване!");
        }
    } catch (error) {
        console.error("❌ Грешка:", error);
        alert("❌ Възникна грешка при качването.");
    }
}
