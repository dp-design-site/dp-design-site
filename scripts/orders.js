document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("orders-table-body");
    const noOrdersMsg = document.getElementById("no-orders");

    if (!tableBody || !noOrdersMsg) {
        console.warn("⚠️ Таблицата за поръчки не е намерена.");
        return;
    }

    fetch("https://api.dp-design.art/api/orders")
        .then(response => {
            if (!response.ok) throw new Error("Неуспешен отговор от сървъра");
            return response.json();
        })
        .then(orders => {
            tableBody.innerHTML = "";

            if (!orders || orders.length === 0) {
                noOrdersMsg.textContent = "❌ Няма налични поръчки.";
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
                    <td class="actions">
                        <button class="view-btn" data-id="${order.id}">👁️</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            console.log("✅ Поръчките са заредени!");
        })
        .catch(error => {
            console.error("❌ Грешка при зареждане на поръчките:", error);
            noOrdersMsg.textContent = "⚠️ Грешка при зареждане на поръчките.";
        });
});
