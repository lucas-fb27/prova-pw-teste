document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let isValid = true;

    // Resetar mensagens de erro
    document.querySelectorAll(".error").forEach((error) => (error.style.display = "none"));
    document.getElementById("successMessage").style.display = "none";

    // Validação do nome
    const name = document.getElementById("name").value;
    if (name.length <= 3) {
        document.getElementById("nameError").style.display = "block";
        isValid = false;
    }

    // Validação do email
    const email = document.getElementById("email").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").style.display = "block";
        isValid = false;
    }

    // Validação da senha
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (!password) {
        document.getElementById("passwordError").style.display = "block";
        isValid = false;
    }
    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").style.display = "block";
        isValid = false;
    }

    // Validação da data de nascimento
    const birthdate = new Date(document.getElementById("birthdate").value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    if (age < 18 || isNaN(birthdate)) {
        document.getElementById("birthdateError").style.display = "block";
        isValid = false;
    }

    // Validação do CEP e endereço
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    const number = document.getElementById("number").value;
    if (!cep || cep.length !== 8) {
        document.getElementById("cepError").style.display = "block";
        isValid = false;
    }
    if (!number) {
        document.getElementById("numberError").style.display = "block";
        isValid = false;
    }

    if (isValid) {
        const user = {
            name,
            email,
            password,
            birthdate: document.getElementById("birthdate").value,
            cep,
            street: document.getElementById("street").value,
            neighborhood: document.getElementById("neighborhood").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            number,
            complement: document.getElementById("complement").value
        };

        // Salvar no LocalStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));

        // Exibir mensagem de sucesso e redirecionar
        document.getElementById("successMessage").style.display = "block";
        document.getElementById("registerForm").reset();
        document.getElementById("street").value = "";
        document.getElementById("neighborhood").value = "";
        document.getElementById("city").value = "";
        document.getElementById("state").value = "";
        
        // Redirecionar para login após 1 segundo
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }
});

// Integração com ViaCEP
document.getElementById("cep").addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, "");
    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                document.getElementById("street").value = data.logradouro || "";
                document.getElementById("neighborhood").value = data.bairro || "";
                document.getElementById("city").value = data.localidade || "";
                document.getElementById("state").value = data.uf || "";
                document.getElementById("cepError").style.display = "none";
            } else {
                document.getElementById("cepError").style.display = "block";
            }
        } catch (error) {
            console.error("Erro ao consultar ViaCEP:", error);
            document.getElementById("cepError").style.display = "block";
        }
    } else {
        document.getElementById("cepError").style.display = "block";
    }
});

// Máscara para o CEP
document.getElementById("cep").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
        value = value.substring(0, 5) + "-" + value.substring(5, 8);
    }
    e.target.value = value;
});