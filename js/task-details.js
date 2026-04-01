document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");

    if (!taskId) {
        alert("Task ID not found!");
        window.location.href = "teacher-dashboard.html";
        return;
    }

    let tasks = localStorage.getItem("tasks");
    tasks = tasks ? JSON.parse(tasks) : [];

    const currentTask = tasks.find(t => t.id === taskId);

    if (!currentTask) {
        alert("Task not found in database!");
        window.location.href = "teacher-dashboard.html";
        return;
    }

    document.getElementById("detailTitle").innerText = currentTask.title;
    document.getElementById("detailId").innerText = currentTask.id;
    document.getElementById("detailSubject").innerText = currentTask.subject || 'Not Specified';
    document.getElementById("detailAdmin").innerText = currentTask.createdBy || 'Admin';
    document.getElementById("detailDate").innerText = currentTask.date || 'No due date';
    document.getElementById("detailDesc").innerText = currentTask.desc;

    
    const priorityDiv = document.getElementById("detailPriority");
    let priorityClass = 'statusPending'; 
    if(currentTask.priority) {
        const p = currentTask.priority.toLowerCase();
        if (p === 'high') priorityClass = 'highPriority';
        if (p === 'medium') priorityClass = 'mediumPriority';
        if (p === 'low') priorityClass = 'lowPriority';
    }
    priorityDiv.innerHTML = `<span class="priorityBadge ${priorityClass}">${currentTask.priority || 'Normal'}</span>`;

 
    const completeBtn = document.getElementById("completeBtn");
    
  
    if (currentTask.status === "Completed") {
        completeBtn.innerHTML = `<i class="fa-solid fa-check-double"></i> Task Completed`;
        completeBtn.disabled = true;
        completeBtn.style.backgroundColor = "#22c55e"; 
        completeBtn.style.color = "white";
    } else {
        completeBtn.addEventListener('click', function() {
            if (confirm("Are you sure you want to mark this task as complete?")) {
                
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                tasks[taskIndex].status = "Completed";
                
                localStorage.setItem("tasks", JSON.stringify(tasks));
                
               
                completeBtn.innerHTML = `<i class="fa-solid fa-check-double"></i> Task Completed`;
                completeBtn.disabled = true;
                completeBtn.style.backgroundColor = "#22c55e";
                completeBtn.style.color = "white";
                
            
                setTimeout(() => {
                    window.location.href = "completed-tasks.html";
                }, 1000); 
            }
        });
    }
});
