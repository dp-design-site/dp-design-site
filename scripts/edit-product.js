document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Зареждане на редактора на продукта...");

    const uploadBtn = document.getElementById("upload-btn");
    const imageUpload = document.getElementById("image-upload");

    if (!uploadBtn || !imageUpload) {
        console.error("❌ Бутонът за качване или input полето липсват!");
        return;
    }

    // ✅ Отваряме файловия прозорец при клик, но не качваме веднага
    uploadBtn.addEventListener("click", function () {
        console.log("📸 Отваряне на файловия диалог...");
        imageUpload.value = ""; // Изчистваме предишния избор
        imageUpload.click();
    });

    // ✅ Качване се стартира САМО след като файловете са избрани
    imageUpload.addEventListener("change", function () {
        if (imageUpload.files.length === 0) {
            console.warn("⚠ Няма избрани файлове, качването няма да стартира.");
            return;
        }
        const productId = getProductId();
        if (!productId) {
            alert("❌ Проблем с ID на продукта!");
            return;
        }
        console.log("📂 Избрани файлове за качване:", imageUpload.files);
        uploadNewImages(productId);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("❌ Липсва ID на продукта!");
        return;
    }

    window.getProductId = function () {
        return productId;
    };

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
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("image-container");
                imgContainer.style.position = "relative";

                const img = document.createElement("img");
                img.src = `https://api.dp-design.art/uploads/${image}`;
                img.dataset.filename = image;
                img.classList.add("thumbnail");

                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "🗑";
                deleteBtn.classList.add("delete-btn");
                deleteBtn.onclick = () => deleteImage(productId, image, imgContainer);

                const setMainBtn = document.createElement("button");
                setMainBtn.innerText = "★";
                setMainBtn.classList.add("set-main-btn");
                setMainBtn.onclick = () => setMainImage(productId, image);

                imgContainer.onmouseover = () => {
                    deleteBtn.style.display = "block";
                    setMainBtn.style.display = "block";
                };
                imgContainer.onmouseleave = () => {
                    deleteBtn.style.display = "none";
                    setMainBtn.style.display = "none";
                };

                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(setMainBtn);
                thumbnailContainer.appendChild(imgContainer);
            });
        }

        new Sortable(thumbnailContainer, {
            animation: 150,
            onEnd: function () {
                console.log("✅ Подредени снимки!");
            }
        });

    } catch (error) {
        console.error("❌ Грешка при зареждане на продукта:", error);
        alert("❌ Грешка при зареждане на продукта.");
    }
});

// ✅ Функция за качване на снимки (фиксирана)
async function uploadNewImages(productId) {
    const imageUpload = document.getElementById("image-upload");

    if (!imageUpload || imageUpload.files.length === 0) {
        console.error("❌ Няма избрани файлове за качване!");
        alert("❌ Моля, изберете изображения за качване!");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < imageUpload.files.length; i++) {
        formData.append("images", imageUpload.files[i]);
    }

    try {
        const response = await fetch(`https://api.dp-design.art/products/${productId}/upload-images`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Грешка при качване");

        alert("✅ Снимките са качени успешно!");
        location.reload();
    } catch (error) {
        console.error("❌ Грешка при качване на изображения:", error);
        alert("❌ Възникна грешка при качването.");
    }
}


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

// ✅ Свързваме бутона "Качи нови снимки" с функцията
document.getElementById("upload-btn").addEventListener("click", function () {
    const productId = getProductId();
    uploadNewImages(productId);
});

async function setMainImage(productId, imageName) {
    try {
        const response = await fetch(`https://api.dp-design.art/products/${productId}/set-main-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageName })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Грешка при задаване на главна снимка");

        alert("✅ Главната снимка е обновена!");
        location.reload();
    } catch (error) {
        console.error("❌ Грешка:", error);
        alert("❌ Възникна грешка при задаване на главна снимка.");
    }
}
product.images.forEach(image => {
    const imgContainer = document.createElement("div");
    imgContainer.style.position = "relative";
    imgContainer.style.display = "inline-block";

    const img = document.createElement("img");
    img.src = `/uploads/${image}`;
    img.classList.add("thumbnail");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "5px";
    deleteBtn.style.right = "5px";
    deleteBtn.style.background = "red";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = () => deleteImage(productId, image, imgContainer);

    const setMainBtn = document.createElement("button");
    setMainBtn.innerText = "★";
    setMainBtn.style.position = "absolute";
    setMainBtn.style.bottom = "5px";
    setMainBtn.style.right = "5px";
    setMainBtn.style.background = "gold";
    setMainBtn.style.border = "none";
    setMainBtn.style.cursor = "pointer";
    setMainBtn.onclick = () => setMainImage(productId, image);

    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteBtn);
    imgContainer.appendChild(setMainBtn);
    thumbnailContainer.appendChild(imgContainer);
});

const sortable = new Sortable(document.getElementById("thumbnail-container"), {
    animation: 150,
    onEnd: async function () {
        const newOrder = Array.from(document.querySelectorAll(".thumbnail")).map(img => img.dataset.filename);
        await fetch(`https://api.dp-design.art/products/${productId}/update-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: newOrder })
        });
    }
});
