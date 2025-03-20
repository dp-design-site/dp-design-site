document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Зареждане на продукта за редакция...");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("❌ Липсва ID на продукта!");
        window.location.href = "admin.html"; 
        return;
    }

    try {
        const response = await fetch(`https://api.dp-design.art/products/${productId}`);
        const product = await response.json();

        if (!response.ok) throw new Error("Грешка при зареждане на продукта");

        console.log("📊 Получени данни:", product);

        document.getElementById("product-name").value = product.name || "";
        document.getElementById("product-description").value = product.description || "";
        document.getElementById("product-price").value = product.price || "";
        document.getElementById("promo-price").value = product.promo_price || "";
        document.getElementById("product-category").value = product.category || "";

        const previewImage = document.getElementById("product-preview");
        const thumbnailContainer = document.getElementById("thumbnail-container");
        thumbnailContainer.innerHTML = "";

        if (product.images && product.images.length > 0) {
            previewImage.src = `https://api.dp-design.art/uploads/${product.images[0]}`;
            product.images.forEach(image => {
                const img = document.createElement("img");
                img.src = `https://api.dp-design.art/uploads/${image}`;
                img.style.width = "80px";
                img.style.height = "80px";
                img.style.cursor = "pointer";

                img.addEventListener("click", function () {
                    if (confirm("Сигурни ли сте, че искате да изтриете тази снимка?")) {
                        deleteImage(productId, image, img);
                    }
                });

                thumbnailContainer.appendChild(img);
            });
        }
    } catch (error) {
        console.error("❌ Грешка при зареждане на продукта:", error);
        alert("❌ Грешка при зареждане на продукта.");
    }
});

document.getElementById("save-btn").addEventListener("click", async function () {
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

    try {
        const response = await fetch(`https://api.dp-design.art/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Грешка при обновяване на продукта");

        console.log("✅ Продуктът е обновен успешно!", result);
        alert("✅ Продуктът е обновен успешно!");
        window.location.href = "admin.html";
    } catch (error) {
        console.error("❌ Грешка при обновяване:", error);
        alert("❌ Неуспешно обновяване на продукта.");
    }
});

// ✅ Функция за изтриване на снимка
async function deleteImage(productId, imageName, imgElement) {
    try {
        const response = await fetch(`https://api.dp-design.art/products/${productId}/delete-image`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageName })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Грешка при изтриване на снимката");

        imgElement.remove();
        alert("✅ Снимката е изтрита успешно!");
    } catch (error) {
        console.error("❌ Грешка при изтриване на снимката:", error);
        alert("❌ Неуспешно изтриване на снимката.");
    }
}
