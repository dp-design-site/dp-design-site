document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Зареждане на продукта за редакция...");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("❌ Липсва ID на продукта!");
        window.location.href = "admin.html"; // Пренасочване
        return;
    }

    fetch(`https://api.dp-design.art/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error("❌ Продуктът не е намерен!");
                alert("⚠️ Продуктът не беше намерен!");
                return;
            }

            const product = data[0]; // Взимаме първия елемент от масива
            console.log("📦 Зареден продукт:", product);

            document.getElementById("product-name").value = product.name;
            document.getElementById("product-description").value = product.description;
            document.getElementById("product-price").value = product.price;
            document.getElementById("promo-price").value = product.promo_price || "";
            document.getElementById("product-category").value = product.category || "";

            // Зареждане на снимки
            const productPreview = document.getElementById("product-preview");
            const thumbnails = document.getElementById("thumbnail-container");
            thumbnails.innerHTML = "";

            if (product.images && product.images.length > 0) {
                productPreview.src = `https://dp-design.art/images/${product.images[0]}`; // Променяме линка към реалния URL
                product.images.forEach(image => {
                    const img = document.createElement("img");
                    img.src = `https://dp-design.art/images/${image}`;
                    thumbnails.appendChild(img);
                });
            }
        })
        .catch(error => console.error("❌ Грешка при зареждане:", error));
});

document.getElementById("save-btn").addEventListener("click", function () {
    console.log("💾 Обновяване на продукта...");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    const updatedData = {
        name: document.getElementById("product-name").value.trim(),
        description: document.getElementById("product-description").value.trim(),
        price: parseFloat(document.getElementById("product-price").value) || 0,
        promo_price: parseFloat(document.getElementById("promo-price").value) || null,
        category: document.getElementById("product-category").value
    };

    fetch(`https://api.dp-design.art/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Продуктът е обновен успешно!", data);
        alert("✅ Продуктът е обновен успешно!");
        window.location.href = "admin.html"; 
    })
    .catch(error => console.error("❌ Грешка при обновяване:", error));
});

