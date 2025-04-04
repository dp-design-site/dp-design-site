function loadMessages() {
    console.log("📨 Стартиране на loadMessages()");

    const tableBody = document.getElementById("messages-table-body");
    const noMessages = document.getElementById("no-messages");

    if (!tableBody || !noMessages) {
        console.warn("⚠️ Не е намерен контейнер за съобщения.");
        return;
    }

    fetch("https://api.dp-design.art/api/messages")
        .then(response => response.json())
        .then(messages => {
            if (!messages || messages.length === 0) {
                noMessages.textContent = "❌ Няма съобщения.";
                return;
            }

            tableBody.innerHTML = "";

            messages.forEach((msg) => {
                const row = document.createElement("tr");
                if (!msg.is_read) {
                    row.classList.add("unread");
                }

                row.innerHTML = `
                    <td>${msg.name || "—"}</td>
                    <td>${msg.email || "—"}</td>
                    <td>${msg.type}</td>
                    <td>${new Date(msg.created_at).toLocaleString("bg-BG")}</td>
                    <td>${msg.is_read ? "Прочетено" : "Непрочетено"}</td>
                    <td class="actions">
                        <button class="view-btn" data-id="${msg.id}">👁️ Виж</button>
                    </td>
                `;

                row.querySelector(".view-btn").addEventListener("click", async () => {
                    alert(`📬 Съобщение от ${msg.name}\n\n${msg.message || "—"}`);

                    if (!msg.is_read) {
                        await markAsRead(msg.id);
                        row.classList.remove("unread");
                        row.querySelector("td:nth-child(5)").textContent = "Прочетено";
                    }
                });

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("❌ Грешка при зареждане на съобщения:", error);
            noMessages.textContent = "⚠️ Проблем при зареждане.";
        });
}

// 🔧 Маркира съобщението като прочетено
async function markAsRead(messageId) {
    try {
        await fetch(`https://api.dp-design.art/api/messages/${messageId}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });
        console.log(`✅ Съобщение ${messageId} маркирано като прочетено`);
    } catch (error) {
        console.error("❌ Грешка при маркиране:", error);
    }
}
