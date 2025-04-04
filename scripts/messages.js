const tableBody = document.getElementById("messages-table-body");
const noMessages = document.getElementById("no-messages");
const filterSelect = document.getElementById("filter-type");

let allMessages = [];

// 👉 Зареждане от mock съобщения (временно)
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

allMessages = mockMessages;
renderMessages(allMessages);

// 👉 Филтриране по тип
if (filterSelect) {
    filterSelect.addEventListener("change", () => {
        const selected = filterSelect.value;
        const filtered = selected === "all" ? allMessages : allMessages.filter(msg => msg.type === selected);
        renderMessages(filtered);
    });
}

// ✅ Функция за рендериране
function renderMessages(messages) {
    tableBody.innerHTML = "";

    if (!messages || messages.length === 0) {
        noMessages.textContent = "❌ Няма съобщения.";
        return;
    }

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
                ${msg.type !== "order" ? `<button class="convert-btn" data-id="${msg.id}">🛒 Превърни в поръчка</button>` : ""}
            </td>
        `;

        // 👁️ Виж
        row.querySelector(".view-btn").addEventListener("click", () => {
            window.location.href = `view-message.html?id=${msg.id}`;
        });

        // 🛒 Превърни в поръчка
        const convertBtn = row.querySelector(".convert-btn");
        if (convertBtn) {
            convertBtn.addEventListener("click", async () => {
                const confirmConvert = confirm("Сигурни ли сте, че искате да превърнете това съобщение в поръчка?");
                if (!confirmConvert) return;

                try {
                    const response = await fetch("https://api.dp-design.art/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            customer_name: msg.name,
                            customer_email: msg.email,
                            phone: msg.phone || "",
                            shipping_address: msg.shipping_address || "",
                            payment_method: msg.payment_method || "неуточнено",
                            is_paid: false,
                            status: "очаква",
                            category: msg.category || "неуточнена"
                        })
                    });

                    if (response.ok) {
                        alert("✅ Съобщението е превърнато в поръчка!");
                    } else {
                        throw new Error("❌ Грешка при създаване на поръчка.");
                    }
                } catch (err) {
                    console.error(err);
                    alert("❌ Грешка при създаване на поръчка.");
                }
            });
        }

        tableBody.appendChild(row);
    });
}
