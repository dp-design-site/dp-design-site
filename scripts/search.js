document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const button = form?.querySelector(".search-btn");

  if (!form || !input) {
    console.warn("❗️ Form или input не са намерени.");
    return;
  }

  // 👉 Поведение при submit (натискане на Enter)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query.length > 0) {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
  });

  // 👉 Поведение при натискане на иконата (в мобилен режим)
  if (button && window.innerWidth <= 768) {
    button.addEventListener("click", (e) => {
      // Ако не е активна, само я отваряме
      if (!form.classList.contains("active")) {
        e.preventDefault();
        form.classList.add("active");
        input.style.display = "inline-block";
        input.focus();
      }
    });
  }
});
