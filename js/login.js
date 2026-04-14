const form = document.querySelector(".form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    clearErrors();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    
    if (email === "") {
        emailError.innerText = "Email is required";
        return;
    }

    
    if (!email.includes("@")) {
        emailError.innerText = "Email must contain @";
        return;
    }

   
    if (password === "") {
        passwordError.innerText = "Password is required";
        return;
    }

    
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    const foundUser = users.find(function (user) {
        return user.email === email && user.password === password;
    });

    if (!foundUser) {
        passwordError.innerText = "Invalid email or password";
        return;
    }

    
    const currentUser = {
    id: foundUser.id,
    username: foundUser.username,
    role: foundUser.role,
    isAdmin: foundUser.role === "admin"
};

localStorage.setItem("currentUser", JSON.stringify(currentUser));



    
    if (foundUser.role === "admin") {
        window.location.href = "admin/admin-dashboard.html";
    } else {
        window.location.href = "teacher/teacher-dashboard.html";
    }
});



function clearErrors() {
    document.querySelectorAll(".error-message").forEach(error =>
        error.innerText = ""
    );
}