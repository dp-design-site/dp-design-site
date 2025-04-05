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
      type: "inquiry",
      created_at: "2025-04-04T10:20:00Z",
      is_read: false,
      message: "Здравейте! Интересувам се от 3D продуктите ви.",
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

    <br><button onclick="loadMessages()">⬅️ Назад към съобщенията</button>
  `;
});

// Отваряне на снимка в нов таб (можеш да направиш модал по-късно)
function openImage(src) {
  window.open(src, "_blank");
}

// 👉 Превръщане в поръчка
const convertBtn = document.getElementById("convert-to-order-btn");
if (convertBtn) {
    convertBtn.addEventListener("click", async () => {
        if (!confirm("Сигурни ли сте, че искате да превърнете това съобщение в поръчка?")) return;

        try {
            const response = await fetch(`https://api.dp-design.art/api/messages/${messageId}/convert-to-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Съобщението беше успешно превърнато в поръчка!");

                // 👉 Обнови броячите
                updateMenuCounters();
            } else {
                alert("❌ Грешка: " + (result.error || "Неуспешна заявка"));
            }
        } catch (error) {
            console.error("❌ Грешка при превръщане в поръчка:", error);
            alert("⚠️ Възникна грешка при свързване със сървъра.");
        }
    });
}

