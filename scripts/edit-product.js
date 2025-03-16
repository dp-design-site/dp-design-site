document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Зареждане на продукта за редакция...");

    // 1️⃣ Извличаме ID-то на продукта от URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("❌ Липсва ID на продукта!");
        window.location.href = "admin.html"; // Пренасочване обратно
        return;
    }

    // 2️⃣ Зареждаме информацията за продукта
    fetch(`https://api.dp-design.art/products/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Грешен отговор от API: ${response.status}`);
            return response.json();
        })
        .then(product => {
            console.log("📊 Получени данни:", product);

            // 3️⃣ Попълваме формата с информацията от API-то
            document.getElementById("product-name").value = product.name;
            document.getElementById("product-description").value = product.description;
            document.getElementById("product-price").value = product.price;
            document.getElementById("promo-price").value = product.promo_price || "";
            document.getElementById("product-category").value = product.category || "";

            // 4️⃣ Зареждаме изображението (ако има)
            const previewImage = document.getElementById("product-preview");
            if (product.images && product.images.length > 0) {
                previewImage.src = `https://api.dp-design.art/uploads/${product.images[0]}`;
            } else {
                previewImage.src = "images/placeholder.png";
            }
        })
        .catch(error => console.error("❌ Грешка при зареждане на продукта:", error));
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

