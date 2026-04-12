const currentPath = window.location.pathname.toLowerCase();

const isPublicPage =
  currentPath.includes("login") ||
  currentPath.includes("signup") ||
  currentPath.includes("index") ||
  currentPath === "/";

const rawUser = localStorage.getItem("currentUser");
const isLoggedIn = rawUser !== null && rawUser !== "null" && rawUser !== "";

if (isPublicPage && isLoggedIn) {
  const user = JSON.parse(rawUser);
  if (user.role === "admin") {
    window.location.replace("admin/admin-dashboard.html");
  } else {
    window.location.replace("teacher/teacher-dashboard.html");
  }
}

if (!isPublicPage && !isLoggedIn) {
  window.location.href = "../index.html";
}