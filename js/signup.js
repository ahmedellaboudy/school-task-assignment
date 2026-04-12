const form = document.querySelector(".form");
const successMessage = document.getElementById("successMessage");

const idSetter = () => {
  const usersString = localStorage.getItem("users");

  if (usersString) {
    const users = JSON.parse(usersString);

    if (users.length > 0) {
      return users.at(-1).id + 1;
    }
  }

  return 0;
};

form.addEventListener("submit", function (e) {
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

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.find(function (user) {
    return user.email === email;
  });

  if (emailExists) {
    emailError.innerText = "Email already registered";
    return;
  }

  const newUser = {
    id : idSetter(),
    username: username,
    email: email,
    password: password,
    role: role.value,
    isAdmin: role.value === "admin",
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  successMessage.style.color = "green";
  successMessage.innerText = "Account created successfully ✅";

  form.reset();

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
});

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(function (error) {
    error.innerText = "";
  });
}
