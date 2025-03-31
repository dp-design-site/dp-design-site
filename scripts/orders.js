// scripts/orders.js

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("orders-table");
  if (table) {
    loadOrders();
  }
});

function loadOrders() {
  const loader = document.getElementById("loading-message");
  if (loader) loader.textContent = "🔄 Зареждане на поръчки...";

  fetch("https://api.dp-design.art/api/orders")
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector("#orders-table tbody");
      tbody.innerHTML = "";

      if (loader) loader.style.display = "none";

      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10">❌ Няма поръчки</td></tr>`;
        return;
      }

      data.forEach(order => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.customer_name}</td>
          <td>${order.customer_email}</td>
          <td>${order.phone}</td>
          <td>${order.shipping_address}</td>
          <td>${order.payment_method}</td>
          <td>${order.status}</td>
          <td>${order.category}</td>
          <td>${new Date(order.created_at).toLocaleString()}</td>
          <td>
            <button onclick="viewOrder(${order.id})">👁️</button>
            <button onclick="changeStatus(${order.id})">🔄</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("❌ Грешка при зареждане:", err);
      if (loader) loader.textContent = "⚠️ Грешка при зареждане на поръчките";
    });
}

function viewOrder(id) {
  window.location.href = `order.html?id=${id}`;
}

function changeStatus(id) {
  const newStatus = prompt("📝 Въведете нов статус за поръчка #" + id);
  if (newStatus) {
    fetch(`https://api.dp-design.art/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("✅ Статусът е променен!");
        loadOrders();
      } else {
        alert("⚠️ Неуспешна промяна на статус.");
      }
    });
  }
}
