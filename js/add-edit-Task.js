const tableBody = document.getElementById("tasksTableBody");
const taskForm = document.querySelector(".taskForm");
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");

function getTasks() {
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    return JSON.parse(tasks);
  } else {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

if (tableBody) {
  function displayTasks() {
    tableBody.innerHTML = "";
    let tasks = getTasks();

    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      let tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td>${task.desc}</td>
        <td>${task.teacher}</td>
        <td>${task.date}</td>
        <td><span>${task.priority}</span></td>
        <td><span>${task.status}</span></td>
        <td>
          <a href="edit-task.html?id=${task.id}" class="actionBtn editBtn">Edit</a>
          <button type="button" class="actionBtn deleteBtn" onclick="deleteTask(${i})">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    }
  }

  displayTasks();
}

if (taskForm) {
  if (editId) {
    let tasks = getTasks();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === editId) {
        document.getElementById("taskId").value = tasks[i].id;
        document.getElementById("createdBy").value = tasks[i].createdBy;
        document.getElementById("priority").value = tasks[i].priority;
        document.getElementById("title").value = tasks[i].title;
        document.getElementById("subject").value = tasks[i].subject;
        document.getElementById("deadline").value = tasks[i].date;
        document.getElementById("teacher").value = tasks[i].teacher;
        document.getElementById("desc").value = tasks[i].desc;
      }
    }
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let tasks = getTasks();

    const taskIdInput = document.getElementById("taskId").value.trim();
    const teacherNameInput = document.getElementById("teacher").value.trim();
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    const teacherObject = allUsers.find(
      (u) => u.username === teacherNameInput && u.role === "teacher",
    );

    if (!teacherObject) {
      alert(
        "Teacher name not found! Please make sure the name matches a registered teacher.",
      );
      return;
    }

    if (!editId) {
      const isDuplicate = tasks.some((task) => task.id === taskIdInput);
      if (isDuplicate) {
        alert("This ID already exists. Please use a unique ID.");
        return;
      }
    }

    let taskData = {
      id: taskIdInput,
      createdBy: document.getElementById("createdBy").value,
      title: document.getElementById("title").value,
      subject: document.getElementById("subject").value,
      desc: document.getElementById("desc").value,
      teacher: teacherNameInput,
      assignedToId: teacherObject.id,
      date: document.getElementById("deadline").value,
      priority: document.getElementById("priority").value,
      status: "Pending",
    };

    if (editId) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === editId) {
          taskData.status = tasks[i].status;
          tasks[i] = taskData;
        }
      }
    } else {
      tasks.push(taskData);
    }

    saveTasks(tasks);
    window.location.href = "admin-tasks.html";
  });
}
