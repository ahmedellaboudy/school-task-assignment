const logoutBtn = document.getElementById("logoutBtn");
const welcomeMsg = document.getElementById("welcomeMsg");

logoutBtn.addEventListener("click", () => {
  localStorage.setItem("currentUser", null);
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const welcomeMsg = document.getElementById("welcomeMsg");
  const rawUser = localStorage.getItem("currentUser");
  const currentUser = rawUser ? JSON.parse(rawUser) : null;
  const currentUserName = currentUser?.username;
  if (welcomeMsg) {
    welcomeMsg.innerHTML += ` ${currentUserName || "Teacher"}!`;
  }
});
