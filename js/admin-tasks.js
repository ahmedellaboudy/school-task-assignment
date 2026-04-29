const API_URL = "http://127.0.0.1:8000/api";

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`);
  return await res.json();
}

// ✅ تصليح الـ URL
async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}/delete/`, {
    method: "DELETE",
  });
}

// ✅ شغال بعد ما أضفنا /complete/ في الباك إند
async function updateTaskToCompleted(id) {
  await fetch(`${API_URL}/tasks/${id}/complete/`, {
    method: "POST",
  });
}

function getPriorityClass(priority) {
  if (!priority) return '';
  const p = priority.toLowerCase();
  if (p === 'high') return 'highPriority';
  if (p === 'medium') return 'mediumPriority';
  if (p === 'low') return 'lowPriority';
  return '';
}

function getStatusClass(status) {
  if (!status) return 'statusPending';
  const s = status.toLowerCase();
  if (s === 'pending') return 'statusPending';
  if (s === 'in progress') return 'statusInProgress';
  if (s === 'completed') return 'statusCompleted';
  return 'statusPending';
}

async function displayTasks() {
  const tableBody = document.getElementById("tasksTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const tasks = await getTasks();

  if (tasks.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="centered">No tasks available</td>
      </tr>`;
    return;
  }

  tasks.forEach((task) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.desc}</td>
      <td>${task.createdBy || "Admin"}</td>
      <td>${task.date || ""}</td>
      <td>
        <span class="priorityBadge ${getPriorityClass(task.priority)}">
          ${task.priority}
        </span>
      </td>
      <td>
        <span class="statusBadge ${getStatusClass(task.status)}">
          ${task.status}
        </span>
      </td>
      <td>
        <a href="edit-task.html?id=${task.id}">Edit</a>
        <button onclick="confirmDelete(${task.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

async function confirmDelete(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    await deleteTask(taskId);
    displayTasks();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayTasks();
});