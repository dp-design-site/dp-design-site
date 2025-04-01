document.addEventListener("DOMContentLoaded", async function () {
    const ordersTableBody = document.getElementById("orders-table-body");
    const noOrders = document.getElementById("no-products"); // използваме го и за поръчки

    try {
        const response = await fetch("https://api.dp-design.art/api/orders");
        const orders = await response.json();

        ordersTableBody.innerHTML = "";

        if (orders.length === 0) {
            noOrders.textContent = "❌ Няма направени поръчки.";
            return;
        }

        orders.forEach(order => {
            const row = document.createElement("tr");
            row.classList.add("product-row");

            row.innerHTML = `
                <td>${order.customer_name}</td>
                <td>${order.customer_email}</td>
                <td>${order.phone}</td>
                <td>${order.shipping_address}</td>
                <td>${order.payment_method}</td>
                <td>${order.status}</td>
                <td>${order.category}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td class="actions">
                    <button class="view-btn" data-id="${order.id}">👁️</button>
                    <button class="edit-btn" data-id="${order.id}">✏️</button>
                </td>
            `;

            ordersTableBody.appendChild(row);
        });

        console.log("✅ Заредени са поръчките!");
    } catch (error) {
        console.error("❌ Грешка при зареждане на поръчките:", error);
        noOrders.textContent = "⚠️ Грешка при зареждане на поръчките.";
    }
});
