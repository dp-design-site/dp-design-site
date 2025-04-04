function loadMessages() {
    console.log("📨 Зареждане на съобщения...");

    const tableBody = document.getElementById("messages-table-body");
    const noMessages = document.getElementById("no-messages");

    fetch("https://api.dp-design.art/api/messages")
        .then(response => {
            if (!response.ok) throw new Error("Грешка при извличане на съобщения");
            return response.json();
        })
        .then(messages => {
            if (!messages || messages.length === 0) {
                noMessages.textContent = "❌ Няма съобщения.";
                return;
            }

            tableBody.innerHTML = "";

            messages.forEach((msg) => {
                const row = document.createElement("tr");

                if (!msg.is_read) row.classList.add("unread");

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

async function markAsRead(id) {
    try {
        await fetch(`https://api.dp-design.art/api/messages/${id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });
        console.log(`✅ Съобщение ${id} е маркирано като прочетено`);
    } catch (err) {
        console.error("❌ Грешка при PATCH:", err);
    }
}
