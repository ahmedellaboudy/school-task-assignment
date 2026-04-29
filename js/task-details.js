const API_URL = "http://127.0.0.1:8000/api";

async function getTaskById(id) {
  const res = await fetch(`${API_URL}/tasks/${id}/`);
  return await res.json();
}

async function completeTask(id) {
  await fetch(`${API_URL}/tasks/${id}/complete/`, {
    method: "POST",
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");

  if (!taskId) {
    alert("Task ID not found");
    return;
  }

  const currentTask = await getTaskById(taskId);

  if (!currentTask) {
    alert("Task not found");
    return;
  }

  document.getElementById("detailTitle").innerText = currentTask.title;
  document.getElementById("detailId").innerText = currentTask.id;
  document.getElementById("detailDesc").innerText = currentTask.desc;
  document.getElementById("detailAdmin").innerText = currentTask.createdBy || "Admin";
  document.getElementById("detailDate").innerText = currentTask.date || "No date";

  const completeBtn = document.getElementById("completeBtn");

  if (currentTask.status?.toLowerCase() === "completed") {
    completeBtn.innerHTML = "Completed ✔";
    completeBtn.disabled = true;
  } else {
    completeBtn.addEventListener("click", async function () {
      if (confirm("Mark task as completed?")) {
        await completeTask(taskId);

        completeBtn.innerHTML = "Completed ✔";
        completeBtn.disabled = true;

        setTimeout(() => {
          window.location.href = "completed-tasks.html";
        }, 800);
      }
    });
  }
});