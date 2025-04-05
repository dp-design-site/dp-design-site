document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const icon = document.getElementById("search-icon");

  // 🔍 Покажи/скрий полето при клик на лупата (в мобилен изглед)
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

  // 🔎 При Enter изпращаме към search-results.html?q=...
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
      }
    });
  }
});
