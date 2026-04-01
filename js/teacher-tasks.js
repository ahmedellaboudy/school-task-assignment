document.addEventListener('DOMContentLoaded', function () {

    displayTeacherTasks();


    const priorityFilter = document.getElementById('priority-filter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', function(e) {
            displayTeacherTasks(e.target.value);
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


function displayTeacherTasks(filter = 'all') {
    const tableBody = document.getElementById("teacherTasksBody");
    if (!tableBody) return;

    tableBody.innerHTML = ""; 
    let tasks = getTasks();

    
    if (filter !== 'all') {
        tasks = tasks.filter(task => task.priority && task.priority.toLowerCase() === filter.toLowerCase());
    }

    if (tasks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="centered" style="padding: 20px; color: #64748b;">No tasks found.</td></tr>`;
        return;
    }

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="taskID centered">${task.id}</td>
            <td class="taskTitleText">${task.title}</td>
            <td class="taskDesc">${task.desc}</td>
            <td class="teacherName">${task.createdBy || 'Admin'}</td>
            <td class="centered">
                <span class="priorityBadge ${getPriorityClass(task.priority)}">${task.priority}</span>
            </td>
            <td class="centered">
                <span class="statusBadge ${getStatusClass(task.status)}">${task.status}</span>
            </td>
            <td class="centered actionGroup">
                <a href="task-details.html?id=${task.id}" class="actionBtn editBtn" style="color: #64748b;">
                    <i class="fa-solid fa-eye"></i> View
                </a>
                
                ${task.status !== 'Completed' ? `
                <button type="button" class="actionBtn" style="color: #22c55e; border: 1px solid #22c55e; padding: 4px 10px; border-radius: 4px; background: none; cursor: pointer;" onclick="markAsComplete('${task.id}')">
                    <i class="fa-solid fa-check"></i> Complete
                </button>
                ` : ''}
            </td>
        `;
        tableBody.appendChild(tr);
    }
}


function markAsComplete(taskId) {
    let tasks = getTasks();
    let taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        if (confirm("Are you sure you want to mark this task as Completed?")) {
            tasks[taskIndex].status = "Completed"; 
            saveTasks(tasks); 
            
        
            const priorityFilter = document.getElementById('priority-filter');
            const currentFilter = priorityFilter ? priorityFilter.value : 'all';
            
            displayTeacherTasks(currentFilter); 
        }
    }
}