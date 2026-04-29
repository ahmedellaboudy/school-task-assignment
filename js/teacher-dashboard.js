const API_URL = "http://127.0.0.1:8000/api";

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`);
  return await res.json();
}

// ✅ تصليح الـ URL بناءً على isEdit و id
async function createOrUpdateTask(task, isEdit = false, id = null) {
  const url = isEdit
    ? `${API_URL}/tasks/${id}/update/`
    : `${API_URL}/tasks/create/`;
  const method = isEdit ? "PUT" : "POST";

  return await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
}

// ✅ تصليح الـ URL
async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}/delete/`, {
    method: "DELETE"
  });
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const welcomeMsg = document.getElementById("welcomeMsg");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (welcomeMsg) {
    welcomeMsg.innerHTML += ` ${currentUser?.username || "Teacher"}!`;
  }
});