function loadMessages() {
  console.log("📨 Стартиране на loadMessages()");

  const tableBody = document.getElementById("messages-table-body");
  const noMessages = document.getElementById("no-messages");
  const typeFilter = document.getElementById("filter-type");

  // 👉 МОКНАТИ СЪОБЩЕНИЯ
  const mockMessages = [
    {
      id: 1,
      name: "Иван Тестов",
      email: "ivan@abv.bg",
      type: "inquiry",
      created_at: "2025-04-04T10:20:00Z",
      is_read: false,
      message: "Здравейте! Интересувам се от 3D продуктите ви.",
    },
    {
      id: 2,
      name: "Мария Петрова",
      email: "maria@gmail.com",
      type: "contact",
      created_at: "2025-04-03T15:45:00Z",
      is_read: true,
      message: "Поздравления за дизайна! Бих искала консултация.",
    },
  ];

  renderMessages(mockMessages);

  // 🎛️ Филтриране по тип
  typeFilter.addEventListener("change", () => {
    const selectedType = typeFilter.value;
    if (selectedType === "all") {
      renderMessages(mockMessages);
    } else {
      const filtered = mockMessages.filter((msg) => msg.type === selectedType);
      renderMessages(filtered);
    }
  });

  // 👉 Рендиране на таблицата
  function renderMessages(messages) {
    tableBody.innerHTML = "";

    if (!messages || messages.length === 0) {
      noMessages.textContent = "❌ Няма съобщения.";
      return;
    }

    noMessages.textContent = "";

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
          <button class="view-btn" data-id="${msg.id}">⋯ Виж</button>
          ${
            msg.type === "inquiry"
              ? `<button class="convert-btn" data-id="${msg.id}">➡️поръчка</button>`
              : ""
          }
        </td>
      `;

      // 👉 Превръщане в поръчка
      row.querySelector(".convert-btn")?.addEventListener("click", () => {
        if (confirm("Сигурни ли сте, че искате да създадете поръчка от това запитване?")) {
          alert("✅ Създадена е нова поръчка!");
        }
      });

      // 👉 Виж
      row.querySelector(".view-btn").addEventListener("click", () => {
        const container = document.getElementById("admin-content");
        if (!container) return location.href = `view-message.html?id=${msg.id}`;

        fetch("admin-sections/view-message.html")
          .then((res) => res.text())
          .then((html) => {
            container.innerHTML = html;
            const script = document.createElement("script");
            script.src = "scripts/view-message.js";
            script.defer = true;
            container.appendChild(script);

            localStorage.setItem("selectedMessageId", msg.id);
          })
          .catch((err) => {
            console.error("❌ Грешка при зареждане на view-message.html:", err);
          });
      });

      tableBody.appendChild(row);
    });
  }
}
