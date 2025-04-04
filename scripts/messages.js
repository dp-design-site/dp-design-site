function loadMessages() {
    console.log("📨 Стартиране с mock съобщения");

    const tableBody = document.getElementById("messages-table-body");
    const noMessages = document.getElementById("no-messages");
    const filterSelect = document.getElementById("filter-type");

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
        },
        {
            id: 3,
            name: "Георги",
            email: "geo@mail.bg",
            type: "order",
            created_at: "2025-04-02T09:00:00Z",
            is_read: false,
            message: "Поръчвам стойка за EV зарядно."
        }
    ];

    function renderMessages(filteredMessages) {
        tableBody.innerHTML = "";
        if (!filteredMessages || filteredMessages.length === 0) {
            noMessages.textContent = "❌ Няма съобщения.";
            return;
        } else {
            noMessages.textContent = "";
        }

        filteredMessages.forEach((msg) => {
            const row = document.createElement("tr");
            if (!msg.is_read) row.classList.add("unread");

            row.innerHTML = `
                <td>${msg.name}</td>
                <td>${msg.email}</td>
                <td>${msg.type}</td>
                <td>${new Date(msg.created_at).toLocaleString("bg-BG")}</td>
                <td>${msg.is_read ? "Прочетено" : "Непрочетено"}</td>
                <td class="actions">
                    <button class="view-btn">👁️ Виж</button>
                    ${msg.type !== "order" ? `<button class="convert-btn">🛒 Превърни</button>` : ""}
                </td>
            `;

            // 👉 Виж
            row.querySelector(".view-btn").addEventListener("click", () => {
                alert(`📬 Съобщение от ${msg.name}\n\n${msg.message}`);
                if (!msg.is_read) {
                    msg.is_read = true;
                    row.classList.remove("unread");
                    row.querySelector("td:nth-child(5)").textContent = "Прочетено";
                }
            });

            // 👉 Превърни в поръчка
            const convertBtn = row.querySelector(".convert-btn");
            if (convertBtn) {
                convertBtn.addEventListener("click", () => {
                    msg.type = "order";
                    alert(`✅ Съобщението от ${msg.name} е маркирано като поръчка.`);
                    loadMessages(); // презареждане
                });
            }

            tableBody.appendChild(row);
        });
    }

    // 👉 Обработваме филтъра
    filterSelect.addEventListener("change", () => {
        const selected = filterSelect.value;
        if (selected === "all") {
            renderMessages(mockMessages);
        } else {
            const filtered = mockMessages.filter(msg => msg.type === selected);
            renderMessages(filtered);
        }
    });

    renderMessages(mockMessages); // начален рендер
}
