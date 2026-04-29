const API_URL = "http://127.0.0.1:8000/api";

const taskForm = document.querySelector(".taskForm");
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");

// GET TASKS
async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`);
  return await res.json();
}

// CREATE TASK
async function createTask(task) {
  return await fetch(`${API_URL}/tasks/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });
}
// UPDATE TASK (التعديل)
async function updateTask(id, task) {
  return await fetch(`${API_URL}/tasks/${id}/update/`, { // تأكدي من وجود هذا المسار في Django
    method: "PUT", // أو POST حسب تعريفك في الـ Views
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });
}

// LOAD DATA FOR EDIT
document.addEventListener("DOMContentLoaded", async () => {
  if (editId) {
    const tasks = await getTasks();
    const task = tasks.find(t => t.id == editId);

    if (task) {
      document.getElementById("taskId").value = task.id;
      document.getElementById("createdBy").value = task.createdBy;
      document.getElementById("priority").value = task.priority;
      document.getElementById("title").value = task.title;
      document.getElementById("subject").value = task.subject || "";
      document.getElementById("deadline").value = task.date;
      document.getElementById("teacher").value = task.assignedToId;
      document.getElementById("desc").value = task.desc;
    }
  }
});

taskForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskData = {
    title: document.getElementById("title").value,
    desc: document.getElementById("desc").value,
    priority: document.getElementById("priority").value,
    assignedToId: Number(document.getElementById("teacher").value),
    createdBy: document.getElementById("createdBy").value,
    date: document.getElementById("deadline").value,
    status: "pending"
  };

  try {
    let res;
    if (editId) {
      res = await fetch(`${API_URL}/tasks/${editId}/update/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      });
    } else {
      res = await fetch(`${API_URL}/tasks/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      });
    }

    if (res.ok) {
      window.location.href = "admin-tasks.html";
    } else {
      alert("Error saving task!");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
});