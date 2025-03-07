document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("https://api.dp-design.art/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("userRole", data.user.role); // Запазваме ролята
                    localStorage.setItem("token", data.token); // Запазваме токена за автентикация
                    window.location.href = "index.html"; // Пренасочване към началната страница
                } else {
                    alert("Грешен имейл или парола!");
                }
            } catch (error) {
                console.error("Грешка при вход:", error);
                alert("Проблем със сървъра. Опитайте отново.");
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            logout();
        });
    }

    function logout() {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        window.location.href = "index.html"; // Презареждаме след излизане
    }
});
