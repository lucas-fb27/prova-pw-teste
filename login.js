document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Resetar mensagens
    document.getElementById("loginError").style.display = "none";
    document.getElementById("successMessage").style.display = "none";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Recuperar usuários do LocalStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        document.getElementById("successMessage").style.display = "block";
        document.getElementById("loginForm").reset();
    } else {
        document.getElementById("loginError").style.display = "block";
    }
});