document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("messages-table-body");
    const noMessages = document.getElementById("no-messages");

    try {
        const response = await fetch("https://api.dp-design.art/api/messages");
        const messages = await response.json();

        if (!messages || messages.length === 0) {
            noMessages.textContent = "❌ Няма съобщения.";
            return;
        }

        tableBody.innerHTML = ""; // Изчистваме таблицата

        messages.forEach((msg) => {
            const row = document.createElement("tr");

            // Добавяме клас, ако съобщението е непрочетено
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

            // 👉 Бутон "Виж"
            row.querySelector(".view-btn").addEventListener("click", async () => {
                alert(`📬 Съобщение от ${msg.customer_name}\n\n${msg.message || "—"}`);

                // 👉 Ако е непрочетено – маркирай като прочетено
                if (!msg.is_read) {
                    await markAsRead(msg.id);
                    row.classList.remove("unread");
                    row.querySelector("td:nth-child(5)").textContent = "Прочетено";
                }
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ Грешка при зареждане на съобщения:", error);
        noMessages.textContent = "⚠️ Проблем при зареждане.";
    }
});

// ✅ PATCH заявка – маркира съобщение като прочетено
async function markAsRead(messageId) {
    try {
        await fetch(`https://api.dp-design.art/api/messages/${messageId}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });
        console.log(`📬 Съобщение ${messageId} е маркирано като прочетено.`);
    } catch (error) {
        console.error("❌ Грешка при маркиране като прочетено:", error);
    }
}
