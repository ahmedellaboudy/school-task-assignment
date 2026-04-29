const API_URL = "http://127.0.0.1:8000/api";

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`);
  return await res.json();
}

document.addEventListener('DOMContentLoaded', function () {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchKeyword');

  searchBtn?.addEventListener('click', performSearch);

  searchInput?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') performSearch();
  });
});

function getPriorityClass(priority) {
  if (!priority) return '';
  if (priority.toLowerCase() === 'high') return 'highPriority';
  if (priority.toLowerCase() === 'medium') return 'mediumPriority';
  if (priority.toLowerCase() === 'low') return 'lowPriority';
  return '';
}

function getStatusClass(status) {
  if (!status) return 'statusPending';
  if (status.toLowerCase() === 'pending') return 'statusPending';
  if (status.toLowerCase() === 'in progress') return 'statusInProgress';
  if (status.toLowerCase() === 'completed') return 'statusCompleted';
  return 'statusPending';
}

async function performSearch() {
  const keyword = document.getElementById('searchKeyword').value.toLowerCase().trim();
  const tableBody = document.getElementById('searchResultsBody');

  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!keyword) {
    tableBody.innerHTML = `<tr><td colspan="7">No keyword</td></tr>`;
    return;
  }

  const tasks = await getTasks();

  // ✅ تصليح — بندور على createdBy بدل teacher
  const results = tasks.filter(task =>
    task.title?.toLowerCase().includes(keyword) ||
    task.id?.toString().includes(keyword) ||
    task.createdBy?.toLowerCase().includes(keyword)
  );

  if (results.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7">No results</td></tr>`;
    return;
  }

  results.forEach(task => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.createdBy || "Admin"}</td>
      <td>${task.date || ""}</td>
      <td>
        <span class="${getPriorityClass(task.priority)}">
          ${task.priority}
        </span>
      </td>
      <td>
        <span class="${getStatusClass(task.status)}">
          ${task.status}
        </span>
      </td>
      <td>
        <a href="edit-task.html?id=${task.id}">Edit</a>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}