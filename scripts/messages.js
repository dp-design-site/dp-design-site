document.addEventListener("DOMContentLoaded", async function () {
    console.log("📨 Стартиране с mock съобщения");

    const tableBody = document.getElementById("messages-table-body");
    const noMessages = document.getElementById("no-messages");

    // 👉 МОКНАТИ СЪОБЩЕНИЯ
    const mockMessages = [
        {
            id: 1,
            name: "Иван Тестов",
            email: "ivan@abv.bg",
            type: "inquiry",
            created_at: "2025-04-04T10:20:00Z",
            is_read: false,
            message: "Здравейте! Интересувам се от 3D продуктите ви."
        },
        {
            id: 2,
            name: "Мария Петрова",
            email: "maria@gmail.com",
            type: "contact",
            created_at: "2025-04-03T15:45:00Z",
            is_read: true,
            message: "Поздравления за дизайна! Бих искала консултация."
        }
    ];

    try {
        const messages = mockMessages;

        if (!messages || messages.length === 0) {
            noMessages.textContent = "❌ Няма съобщения.";
            return;
        }

        tableBody.innerHTML = ""; // Изчистваме таблицата

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

            // 👉 Бутон "Виж"
            row.querySelector(".view-btn").addEventListener("click", () => {
                alert(`📬 Съобщение от ${msg.name}\n\n${msg.message || "—"}`);
                if (!msg.is_read) {
                    msg.is_read = true;
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
