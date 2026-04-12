document.addEventListener('DOMContentLoaded', function () {
    displayTeacherTasks('all');

    const priorityFilter = document.getElementById('priority-filter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', function(e) {
            displayTeacherTasks(e.target.value);
        });
    }
});

function displayTeacherTasks(filter = 'all') {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    let myTasks = allTasks.filter(task => task.assignedToId === currentUser.id);

    if (filter !== 'all') {
        myTasks = myTasks.filter(task => task.priority.toLowerCase() === filter.toLowerCase());
    }

    const tableBody = document.getElementById("teacherTasksBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (myTasks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="centered">No tasks found.</td></tr>`;
        return;
    }

    myTasks.forEach(task => {
        let tr = document.createElement("tr");
        
        const priorityClass = getPriorityClass(task.priority);
        const statusClass = getStatusClass(task.status);

        tr.innerHTML = `
            <td class="centered">${task.id}</td>
            <td>${task.title}</td>
            <td>${task.desc}</td>
            <td>${task.createdBy}</td>
            <td class="centered">
                <span class="priorityBadge ${priorityClass}">${task.priority}</span>
            </td>
            <td class="centered">
                <span class="statusBadge ${statusClass}">${task.status}</span>
            </td>
            <td class="centered">
                <a href="task-details.html?id=${task.id}" class="actionBtn">View Details</a>
            </td>
        `;
        tableBody.appendChild(tr);
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

function getTasks() {
    let tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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