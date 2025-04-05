document.addEventListener("DOMContentLoaded", function () {
  const messageContainer = document.getElementById("message-details");

  const messageId = localStorage.getItem("selectedMessageId");
  if (!messageId) {
    messageContainer.innerHTML = "<p>⚠️ Няма избрано съобщение.</p>";
    return;
  }

  console.log("📨 Зареждане на съобщение с ID:", messageId);

  // Мокнати съобщения (в реална среда ще се взимат чрез API)
  const mockMessages = [
    {
      id: 1,
      name: "Иван Тестов",
      email: "ivan@abv.bg",
      phone: "0888123456",
      type: "inquiry",
      created_at: "2025-04-04T10:20:00Z",
      is_read: false,
      message: "Здравейте! Интересувам се от 3D продуктите ви.",
      category: "personalized",
      shipping_address: "гр. София, ул. Примерна 1",
      payment_method: "наложен платеж",
      attachments: ["test-image-1.jpg", "test-image-2.jpg"]
    },
    {
      id: 2,
      name: "Мария Петрова",
      email: "maria@gmail.com",
      type: "contact",
      created_at: "2025-04-03T15:45:00Z",
      is_read: true,
      message: "Поздравления за дизайна! Бих искала консултация.",
      attachments: []
    }
  ];

  const msg = mockMessages.find((m) => m.id === parseInt(messageId));
  if (!msg) {
    messageContainer.innerHTML = "<p>❌ Съобщението не е намерено.</p>";
    return;
  }

  // Генерираме съдържанието
  messageContainer.innerHTML = `
    <h2>📨 Детайли за съобщението</h2>
    <p><strong>Име:</strong> ${msg.name}</p>
    <p><strong>Имейл:</strong> ${msg.email}</p>
    <p><strong>Тип:</strong> ${msg.type}</p>
    <p><strong>Дата:</strong> ${new Date(msg.created_at).toLocaleString("bg-BG")}</p>
    <p><strong>Съобщение:</strong><br>${msg.message}</p>

    <div class="attachments">
      <strong>Прикачени файлове:</strong>
      <div class="thumbnail-container">
        ${
          msg.attachments && msg.attachments.length > 0
            ? msg.attachments
                .map(
                  (img) => `
              <img src="uploads/${img}" alt="Attachment" class="thumbnail" onclick="openImage(this.src)">
            `
                )
                .join("")
            : "<p>— Няма прикачени файлове.</p>"
        }
      </div>
    </div>

    <br>
    <button onclick="loadMessages()">⬅️ Назад към съобщенията</button>
    <button id="convert-btn">📦 Превърни в поръчка</button>
  `;

  // ✅ Закачаме събитието към бутона „Превърни в поръчка“
  const convertBtn = document.getElementById("convert-btn");
  if (convertBtn) {
    convertBtn.addEventListener("click", () => {
      convertToOrder(msg);
    });
  }
});

// ✅ Отваряне на снимка в нов таб
function openImage(src) {
  window.open(src, "_blank");
}

// ✅ Превръщане на съобщение в поръчка
async function convertToOrder(message) {
  const confirmed = confirm("✅ Сигурни ли сте, че искате да създадете поръчка от това съобщение?");
  if (!confirmed) return;

  const payload = {
    customer_name: message.name || "—",
    customer_email: message.email || "—",
    phone: message.phone || null,
    shipping_address: message.shipping_address || null,
    payment_method: message.payment_method || null,
    is_paid: false,
    status: "очаква",
    category: message.category || null,
    source: "from-message"
  };

  try {
    const res = await fetch("https://api.dp-design.art/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Грешка при създаване на поръчката");

    const result = await res.json();
    alert("✅ Поръчката е създадена успешно!");
    console.log("📦 Създадена поръчка:", result);

    // 👉 Деактивиране на бутона + обновяване на броячите
    document.getElementById("convert-btn").disabled = true;
    if (typeof updateMenuCounters === "function") updateMenuCounters();

  } catch (error) {
    console.error("❌ Грешка при създаване на поръчка:", error);
    alert("❌ Неуспешно създаване на поръчка.");
  }
}
