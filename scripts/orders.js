console.log("📦 Зарежда се orders.js...");

function loadOrders() {
    console.log("🟢 Стартиране на loadOrders()");

    const ordersTableBody = document.getElementById("orders-table-body");
    const noOrders = document.getElementById("no-orders");

    if (!ordersTableBody || !noOrders) {
        console.warn("❌ Контейнерите за поръчки не са намерени.");
        return;
    }

    fetch("https://api.dp-design.art/api/orders")
        .then(response => {
            if (!response.ok) throw new Error("Неуспешна заявка към сървъра.");
            return response.json();
        })
        .then(orders => {
            console.log("📥 Получени поръчки:", orders);

            ordersTableBody.innerHTML = "";

            if (!orders || orders.length === 0) {
                noOrders.textContent = "❌ Няма направени поръчки.";
                return;
            }

            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.customer_name}</td>
                    <td>${order.customer_email}</td>
                    <td>${order.phone}</td>
                    <td>${order.shipping_address}</td>
                    <td>${order.payment_method}</td>
                    <td>${order.status}</td>
                    <td>${order.category}</td>
                    <td>${new Date(order.created_at).toLocaleString("bg-BG")}</td>
                    <td>
                        <button class="view-btn" data-id="${order.id}">👁️</button>
                    </td>
                `;
                ordersTableBody.appendChild(row);
            });

            console.log("✅ Поръчките са заредени успешно!");
        })
        .catch(error => {
            console.error("❌ Грешка при зареждане на поръчките:", error);
            noOrders.textContent = "⚠️ Грешка при зареждане.";
        });
}

// ✅ Уверяваме се, че DOM е зареден преди да стартираме
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadOrders);
} else {
    loadOrders();
}
