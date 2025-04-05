/*document.addEventListener("DOMContentLoaded", function () {
  console.log("🔍 Търсачката е активна!");

  const searchInput = document.getElementById("searchInput");

  // Позволява търсене с Enter
  window.handleSearch = function (event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  };
});*/

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // ❌ Спира изпращане на формата
    const query = input.value.trim();
    if (query.length > 0) {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const button = form?.querySelector(".search-btn");

  if (button && window.innerWidth <= 768) {
    button.addEventListener("click", (e) => {
      // Ако input е скрит – покажи го
      if (!form.classList.contains("active")) {
        e.preventDefault();
        form.classList.add("active");
        input.style.display = "inline-block";
        input.focus();
      }
    });
  }
});

