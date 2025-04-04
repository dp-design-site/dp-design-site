// ✅ scripts/view-message.js

function loadViewMessage() {
    console.log("📬 Зареждаме детайли за съобщение...");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("view-message-container").innerHTML = "<p>❌ Липсва ID на съобщението.</p>";
        return;
    }

    fetch(`https://api.dp-design.art/api/messages/${id}`)
        .then(res => res.json())
        .then(msg => {
            const container = document.getElementById("view-message-container");
            container.innerHTML = `
                <h2>📨 Съобщение от ${msg.name}</h2>
                <p><strong>Имейл:</strong> ${msg.email}</p>
                <p><strong>Телефон:</strong> ${msg.phone || "—"}</p>
                <p><strong>Тип:</strong> ${msg.type}</p>
                <p><strong>Статус:</strong> ${msg.status}</p>
                <p><strong>Категория:</strong> ${msg.category || "—"}</p>
                <p><strong>Дата:</strong> ${new Date(msg.created_at).toLocaleString("bg-BG")}</p>
                <p><strong>Съобщение:</strong></p>
                <div class="message-box">${msg.message || "<i>—</i>"}</div>

                ${msg.images?.length > 0 ? `<h4>📷 Прикачени снимки:</h4>
                <div class="image-thumbnails">
                    ${msg.images.map(img => `
                        <img src="/uploads/${img}" class="thumbnail" onclick="openImage('/uploads/${img}')">
                    `).join("")}
                </div>` : ""}

                <div class="actions">
                    <button onclick="loadContent('messages')">⬅️ Назад</button>
                </div>
            `;
        })
        .catch(err => {
            console.error("❌ Грешка при зареждане на съобщението:", err);
            document.getElementById("view-message-container").innerHTML = "⚠️ Грешка при зареждане.";
        });
}

// ✅ Функция за отваряне на снимка в нов прозорец
function openImage(src) {
    window.open(src, "_blank");
}
