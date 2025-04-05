document.addEventListener("DOMContentLoaded", function () {
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
});
