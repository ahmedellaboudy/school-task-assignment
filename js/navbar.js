var path = window.location.pathname;
var inSubfolder = path.includes('/admin/') || path.includes('/teacher/');
var root = inSubfolder ? '../' : '';

var user = JSON.parse(localStorage.getItem('user'));

var userDropdown = user
  ? `<li class="user-menu">
       <button class="user-btn" id="user-toggle">
         <i class="fa-solid fa-user"></i> ${user.username}
         <i class="fa-solid fa-chevron-down chevron"></i>
       </button>
       <ul class="user-dropdown">
         <li><a href="#" id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
       </ul>
     </li>`
  : `<li class="user-menu">
       <button class="user-btn" id="user-toggle">
         <i class="fa-solid fa-user"></i> User
         <i class="fa-solid fa-chevron-down chevron"></i>
       </button>
       <ul class="user-dropdown">
         <li><a href="${root}login.html"><i class="fa-solid fa-right-to-bracket"></i> Login</a></li>
       </ul>
     </li>`;

var adminLinks = user && user.role === 'admin'
  ? `<li><a href="${root}admin/admin-dashboard.html">Dashboard</a></li>
     <li><a href="${root}admin/admin-tasks.html">My Tasks</a></li>
     <li><a href="${root}admin/add-task.html">Add Task</a></li>`
  : '';

var teacherLinks = user && user.role === 'teacher'
  ? `<li><a href="${root}teacher/teacher-dashboard.html">Dashboard</a></li>
     <li><a href="${root}teacher/teacher-tasks.html">My Tasks</a></li>
     <li><a href="${root}teacher/completed-tasks.html">Completed</a></li>
     <li><a href="${root}teacher/search-tasks.html">Search</a></li>`
  : '';

var navbarHTML = `
  <header class="header">
    <nav class="nav">
      <div class="logo">
        <i class="fa-solid fa-graduation-cap logo-icon"></i>
        <h2 class="logo-text">SchoolTask</h2>
      </div>
      <ul class="nav-links">
        <li><a href="${root}index.html">Home</a></li>
        ${adminLinks}
        ${teacherLinks}
        ${userDropdown}
      </ul>
    </nav>
  </header>
`;

document.body.insertAdjacentHTML('afterbegin', navbarHTML);

var currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a').forEach(function(link) {
  if (link.getAttribute('href').includes(currentPage)) {
    link.classList.add('active');
  }
});

var toggleBtn = document.getElementById('user-toggle');
var dropdown = document.querySelector('.user-dropdown');

toggleBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdown.classList.toggle('open');
  toggleBtn.querySelector('.chevron').classList.toggle('rotated');
});

document.addEventListener('click', function() {
  dropdown.classList.remove('open');
  toggleBtn.querySelector('.chevron').classList.remove('rotated');
});

var logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = root + 'index.html';
  });
}