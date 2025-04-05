document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const icon = document.getElementById("search-icon");

  if (!form || !input || !icon) return;

  // 👉 Подаване на заявка при Enter
  document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("search-input").value.trim();
  if (query) {
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
