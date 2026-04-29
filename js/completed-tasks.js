document.addEventListener("DOMContentLoaded", function () {
  displayCompletedTasks();

  const priorityFilter = document.getElementById("priority-filter");
  if (priorityFilter) {
    priorityFilter.addEventListener("change", function (e) {
      displayCompletedTasks(e.target.value);
    });
  }
});

function getPriorityClass(priority) {
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

function getTasks() {
  let tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

function displayCompletedTasks(filter = "all") {
  const tableBody = document.getElementById("completedTasksBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  let allTasks = getTasks();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let completedTasks = allTasks.filter((task) => {
    const isCompleted =
      task.status && task.status.toLowerCase() === "completed";
    const isAssignedToMe = task.assignedToId === currentUser.id;

    return isCompleted && isAssignedToMe;
  });

  if (filter !== "all") {
    completedTasks = completedTasks.filter(
      (task) =>
        task.priority && task.priority.toLowerCase() === filter.toLowerCase(),
    );
  }

  if (completedTasks.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="centered" style="padding: 30px; color: #64748b; font-size: 16px;">No completed tasks found. Keep up the good work!</td></tr>`;
    return;
  }

  completedTasks.forEach((task) => {
    let tr = document.createElement("tr");
    tr.className = "completedRow";

    tr.innerHTML = `
            <td class="taskID centered">${task.id}</td>
            <td class="taskTitleText" style="font-weight: 600;">${task.title}</td>
            <td class="taskDesc" style="color: #94a3b8;">${task.desc}</td>
            <td class="teacherName">${task.createdBy || "Admin"}</td>
            <td class="centered">
                <span class="priorityBadge ${getPriorityClass(task.priority)}">${task.priority}</span>
            </td>
            <td class="centered">
                <span class="statusBadge ${getStatusClass(task.status)}">${task.status}</span>
            </td>
            <td class="centered actionGroup">
                <a href="task-details.html?id=${task.id}" class="actionBtn editBtn" style="color: #1e293b; background: transparent; border: none;">
                    <i class="fa-solid fa-eye"></i> View Details
                </a>
            </td>
        `;
    tableBody.appendChild(tr);
  });
}
