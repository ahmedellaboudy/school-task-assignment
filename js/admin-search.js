document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchKeyword');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

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

function performSearch() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase().trim();
    const tableBody = document.getElementById('searchResultsBody');
    
    if (!tableBody) return;

    let tasks = getTasks();
    tableBody.innerHTML = ""; 

    if (keyword === "") {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="centered" style="padding: 30px; color: #f59e0b;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                    Please enter a keyword to search.
                </td>
            </tr>`;
        return;
    }

    const results = tasks.filter(task => 
        (task.title && task.title.toLowerCase().includes(keyword)) || 
        (task.id && task.id.toLowerCase().includes(keyword)) ||
        (task.teacher && task.teacher.toLowerCase().includes(keyword))
    );

    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="centered" style="padding: 30px; color: #ef4444;">
                    <i class="fa-solid fa-circle-xmark" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                    No tasks found matching "<strong>${keyword}</strong>".
                </td>
            </tr>`;
        return;
    }

    results.forEach(task => {
        let tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td class="taskID centered">${task.id}</td>
            <td class="taskTitleText">${task.title}</td>
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
                <button type="button" class="actionBtn deleteBtn" onclick="confirmDeleteFromSearch('${task.id}')">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}


function confirmDeleteFromSearch(taskId) {
    const isConfirmed = confirm(`Are you sure you want to delete task ${taskId}?`);
    
    if (isConfirmed) {
        let tasks = getTasks();
        let updatedTasks = tasks.filter(task => task.id !== taskId);
        saveTasks(updatedTasks);
        
        performSearch();
    }
}