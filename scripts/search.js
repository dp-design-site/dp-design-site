document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const icon = document.getElementById("search-icon");

  if (!form || !input) {
    console.warn("❌ Търсачката не е намерена!");
    return;
  }

  // ✅ Изпращане на формата при Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // ❗ Спираме стандартното поведение (презареждане)
    const query = input.value.trim();
    if (query.length === 0) return;

    // 🔁 Пренасочваме към search-results.html?q=...
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
  });

  // ✅ В мобилен режим – показване/скриване на полето при клик на лупата
  if (icon) {
    icon.addEventListener("click", () => {
      input.classList.toggle("visible");

      // Ако се показва – фокусираме го
      if (input.classList.contains("visible")) {
        input.focus();
      }
    });
  }

  console.log("🔍 Търсачката е активирана!");
});
