function loadMessages() {
    console.log("📨 Стартиране на зареждане на съобщения...");

    const tableBody = document.getElementById("messages-table-body");
    const noMessages = document.getElementById("no-messages");

    // MOCK или реална заявка (тук ползваме реална, можеш да подмениш с mockMessages ако си offline)
    fetch("https://api.dp-design.art/api/messages")
        .then(response => response.json())
        .then(messages => {
            if (!messages || messages.length === 0) {
                noMessages.textContent = "❌ Няма съобщения.";
                return;
            }

            tableBody.innerHTML = "";

            messages.forEach(msg => {
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
                        <button class="convert-btn" data-id="${msg.id}">📦 Превърни в поръчка</button>
                    </td>
                `;

                // 👁️ Виж
                row.querySelector(".view-btn").addEventListener("click", async () => {
                    if (!msg.is_read) {
                        await markAsRead(msg.id);
                        row.classList.remove("unread");
                        row.querySelector("td:nth-child(5)").textContent = "Прочетено";
                    }

                    // 🔁 Зареждаме view-message.html вътре в admin-content
                    const content = document.getElementById("admin-content");
                    fetch("admin-sections/view-message.html")
                        .then(res => res.text())
                        .then(html => {
                            content.innerHTML = html;

                            // Добавяме параметъра ?id=...
                            history.pushState({}, "", `#view-message-${msg.id}`);
                            const script = document.createElement("script");
                            script.src = "scripts/view-message.js";
                            script.onload = () => {
                                if (typeof loadViewMessage === "function") {
                                    // ръчно добавяме ID към URL параметите
                                    const fakeQuery = `?id=${msg.id}`;
                                    history.replaceState({}, "", fakeQuery);
                                    loadViewMessage();
                                }
                            };
                            document.body.appendChild(script);
                        });
                });

                // 📦 Превърни в поръчка
                row.querySelector(".convert-btn").addEventListener("click", () => {
                    if (confirm("❓ Сигурни ли сте, че искате да превърнете това съобщение в поръчка?")) {
                        convertToOrder(msg);
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

// ✅ Маркиране като прочетено
async function markAsRead(id) {
    try {
        await fetch(`https://api.dp-design.art/api/messages/${id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });
        console.log(`📬 Маркирано като прочетено: ID ${id}`);
    } catch (err) {
        console.error("❌ Неуспешно маркиране като прочетено:", err);
    }
}

// ✅ Превръщане в поръчка
async function convertToOrder(msg) {
    try {
        const response = await fetch("https://api.dp-design.art/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_name: msg.name,
                customer_email: msg.email,
                phone: msg.phone,
                shipping_address: msg.shipping_address || "—",
                payment_method: msg.payment_method || "—",
                is_paid: msg.is_paid || false,
                status: msg.status || "Очаква потвърждение",
                category: msg.category || "—"
            }),
        });

        if (response.ok) {
            alert("✅ Съобщението е превърнато в поръчка!");
        } else {
            alert("❌ Възникна грешка при създаване на поръчка.");
        }
    } catch (err) {
        console.error("❌ Превръщане в поръчка:", err);
    }
}
