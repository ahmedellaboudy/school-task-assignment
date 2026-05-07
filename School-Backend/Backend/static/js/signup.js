const form = document.getElementById("signupForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  clearErrors();
  successMessage.innerText = "";

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = document.querySelector('input[name="role"]:checked');

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const roleError = document.getElementById("roleError");

  let valid = true;

  if (username === "") {
    usernameError.innerText = "Username is required";
    valid = false;
  }

  if (email === "") {
    emailError.innerText = "Email is required";
    valid = false;
  } else if (!email.includes("@")) {
    emailError.innerText = "Email must contain @";
    valid = false;
  }

  if (password === "") {
    passwordError.innerText = "Password is required";
    valid = false;
  } else if (password.length < 6) {
    passwordError.innerText = "Password must be at least 6 characters";
    valid = false;
  }

  if (confirmPassword === "") {
    confirmPasswordError.innerText = "Please confirm password";
    valid = false;
  } else if (password !== confirmPassword) {
    confirmPasswordError.innerText = "Passwords do not match";
    valid = false;
  }

  if (!role) {
    roleError.innerText = "Please select a role";
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await fetch("/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        role: role.value
      })
    });

    const data = await response.json();

    if (!data.success) {
      if (data.field === "username") {
        usernameError.innerText = data.message;
      } else if (data.field === "email") {
        emailError.innerText = data.message;
      } else if (data.field === "password") {
        passwordError.innerText = data.message;
      } else if (data.field === "confirm_password") {
        confirmPasswordError.innerText = data.message;
      } else if (data.field === "role") {
        roleError.innerText = data.message;
      } else {
        successMessage.style.color = "red";
        successMessage.innerText = data.message || "Something went wrong";
      }

      return;
    }

    successMessage.style.color = "green";
    successMessage.innerText = data.message || "Account created successfully";

    form.reset();

    setTimeout(function () {
      window.location.href = data.redirect || "/login/";
    }, 1500);

  } catch (error) {
    successMessage.style.color = "red";
    successMessage.innerText = "Server error. Please try again.";
  }
});

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(function (error) {
    error.innerText = "";
  });
}