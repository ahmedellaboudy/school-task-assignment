const API_URL = "http://127.0.0.1:8000/api";

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`);
  return await res.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  await displayCompletedTasks();

  const priorityFilter = document.getElementById("priority-filter");
  if (priorityFilter) {
    priorityFilter.addEventListener("change", async function (e) {
      await displayCompletedTasks(e.target.value);
    });
  }
});

async function displayCompletedTasks(filter = "all") {
  const tableBody = document.getElementById("completedTasksBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const allTasks = await getTasks();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let completedTasks = allTasks.filter((task) => {
    const isCompleted = task.status?.toLowerCase() === "completed";
    const isAssignedToMe = task.assignedToId === currentUser.id;
    return isCompleted && isAssignedToMe;
  });

  if (filter !== "all") {
    completedTasks = completedTasks.filter(
      (task) => task.priority?.toLowerCase() === filter.toLowerCase()
    );
  }

  if (completedTasks.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:20px;">
          No completed tasks found
        </td>
      </tr>`;
    return;
  }

  completedTasks.forEach((task) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.desc}</td>
      <td>${task.createdBy || "Admin"}</td>
      <td>${task.priority}</td>
      <td>${task.status}</td>
      <td>
        <a href="task-details.html?id=${task.id}">
          View
        </a>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}