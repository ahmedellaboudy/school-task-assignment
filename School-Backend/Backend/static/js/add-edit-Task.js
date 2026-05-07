document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.querySelector(".taskForm");

  if (taskForm) {
    taskForm.addEventListener("submit", function (e) {
      const teacherSelect = document.getElementById("teacher");
      if (teacherSelect && teacherSelect.value === "") {
        e.preventDefault();
        alert("Please select a teacher from the list.");
        return;
      }

      const deadlineInput = document.getElementById("deadline").value;
      if (deadlineInput) {
        const today = new Date().toISOString().split("T")[0];
        if (deadlineInput < today) {
          e.preventDefault();
          alert("Due date cannot be in the past!");
          return;
        }
      }

     
    });
  }
});