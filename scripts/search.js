document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const icon = document.getElementById("search-icon");

  if (!form || !input || !icon) return;

  // 👉 Подаване на заявка при Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query.length > 0) {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
  });

  // 👉 Показване/скриване на полето при клик в мобилен режим
  icon.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      input.classList.toggle("visible");
      if (input.classList.contains("visible")) {
        input.focus();
      }
    }
  });
});
