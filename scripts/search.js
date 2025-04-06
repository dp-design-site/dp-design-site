document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const icon = document.getElementById("search-icon");

  console.log("🔍 Скриптът за търсене е зареден!");

  if (!form || !input) {
    console.warn("⚠️ Търсачката не е намерена в DOM!");
    return;
  }

  // Показване/скриване на търсачка в мобилен
  if (icon && input) {
    icon.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        input.classList.toggle("visible");
        if (input.classList.contains("visible")) {
          input.focus();
        }
      }
    });
  }

  // Прехвърляне към search-results.html
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    console.log("📨 Изпращане на заявка:", query);
    if (query) {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
  });
});
