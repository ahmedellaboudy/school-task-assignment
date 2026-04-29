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

function getTasks() {
  let tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
  const tableBody = document.getElementById("tasksTableBody");
  
  if (!tableBody) return; 

  tableBody.innerHTML = ""; 
  let tasks = getTasks();

  if (tasks.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" class="centered" style="padding: 20px; color: #64748b;">No tasks available. Add a new task to see it here.</td></tr>`;
    return;
  }

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="taskID centered">${task.id}</td>
      <td class="taskTitleText">${task.title}</td>
      <td class="taskDesc">${task.desc}</td>
      <td class="teacherName">${task.teacher}</td>
      <td class="dueDate">${task.date}</td>
      <td class="centered">
        <span class="priorityBadge ${getPriorityClass(task.priority)}">${task.priority}</span>
      </td>
      <td class="centered">
        <span class="statusBadge ${getStatusClass(task.status)}">${task.status}</span>
      </td>
      <td class="centered actionGroup">
        <a href="edit-task.html?id=${task.id}" class="actionBtn editBtn">
          <i class="fa-solid fa-pen"></i> Edit
        </a>
        <button type="button" class="actionBtn deleteBtn" onclick="confirmDelete('${task.id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  }
}

function confirmDelete(taskId) {
  const isConfirmed = confirm(`Are you sure you want to delete the task with ID: ${taskId}? This action cannot be undone.`);
  
  if (isConfirmed) {
    console.log(`Deleting task ${taskId}...`);
    
    let tasks = getTasks();
 
    let updatedTasks = tasks.filter(task => task.id !== taskId);
    
    saveTasks(updatedTasks); 
    displayTasks(); 
    
  } else {
    console.log(`Delete action for task ${taskId} cancelled.`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('Admin Dashboard Loaded Successfully.');
  displayTasks(); 
});

const userData = localStorage.getItem('currentUser');

if (userData) {
    const user = JSON.parse(userData);
    document.getElementById('user-name').textContent = user.username;
}