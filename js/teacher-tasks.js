const API_URL = "http://127.0.0.1:8000/api";

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`);
  return await res.json();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}/`, {
    method: "DELETE",
  });
}

async function updateTaskToCompleted(id) {
  await fetch(`${API_URL}/tasks/${id}/complete/`, {
    method: "POST",
  });
}function getPriorityClass(priority) {
  if (!priority) return "";
  const p = priority.toLowerCase();
  if (p === "high") return "highPriority";
  if (p === "medium") return "mediumPriority";
  if (p === "low") return "lowPriority";
  return "";
}

function getStatusClass(status) {
  if (!status) return "statusPending";
  const s = status.toLowerCase();
  if (s === "pending") return "statusPending";
  if (s === "in progress") return "statusInProgress";
  if (s === "completed") return "statusCompleted";
  return "statusPending";
}

async function displayTeacherTasks(filter = "all") {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const tableBody = document.getElementById("teacherTasksBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const allTasks = await getTasks();
let myTasks = allTasks.filter(
  (task) =>
    task.assignedToId === currentUser.id &&
    task.status?.toLowerCase() !== "completed"
);
  if (filter !== "all") {
    myTasks = myTasks.filter(
      (task) => task.priority?.toLowerCase() === filter.toLowerCase()
    );
  }

  if (myTasks.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="centered">No tasks found</td>
      </tr>`;
    return;
  }

  myTasks.forEach((task) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.desc}</td>
      <td>${task.createdBy || "Admin"}</td>
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
        <a href="task-details.html?id=${task.id}">
          View Details
        </a>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

async function markAsComplete(taskId) {
  if (confirm("Mark task as completed?")) {
    await updateTaskToCompleted(taskId);

    const filter = document.getElementById("priority-filter")?.value || "all";
    displayTeacherTasks(filter);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayTeacherTasks("all");

  const priorityFilter = document.getElementById("priority-filter");
  if (priorityFilter) {
    priorityFilter.addEventListener("change", function (e) {
      displayTeacherTasks(e.target.value);
    });
  }
});