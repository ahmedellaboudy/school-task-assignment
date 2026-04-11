var path = window.location.pathname;
var inSubfolder = path.includes("/admin/") || path.includes("/teacher/");
var root = inSubfolder ? "../" : "";
var currentPage = path.split("/").pop() || "index.html";

var user = null;
var raw = localStorage.getItem("currentUser") || localStorage.getItem("user");
if (raw) {
  user = JSON.parse(raw);
}

var navLinksHTML = "";
var dropdownHTML = "";

if (!user) {
  dropdownHTML = `
    <a href="${root}login.html"><i class="fa-solid fa-right-to-bracket"></i> Sign In</a>
    <a href="${root}signup.html"><i class="fa-solid fa-user-plus"></i> Sign Up</a>
  `;
} else if (user.isAdmin === true || user.role === "admin") {
  homeLink = `${root}admin/admin-dashboard.html`;
  navLinksHTML = `
    <li><a href="${root}admin/admin-tasks.html">My Tasks</a></li>
    <li><a href="${root}admin/add-task.html">Add Task</a></li>
    <li><a href="${root}admin/admin-search.html">Search</a></li>
  `;
  dropdownHTML = `<a href="#" id="logoutAction"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>`;
} else if (user.isAdmin === false || user.role === "teacher") {
  homeLink = `${root}teacher/teacher-dashboard.html`;
  navLinksHTML = `
    <li><a href="${root}teacher/teacher-tasks.html">My Tasks</a></li>
    <li><a href="${root}teacher/completed-tasks.html">Completed</a></li>  `;
  dropdownHTML = `<a href="#" id="logoutAction"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>`;
}

var navbarHTML = `
  <header class="mainHeader">
    <nav class="ignoreNav">
    <a href="${homeLink}" class="brandLogo">
        <i class="fa-solid fa-graduation-cap"></i> SchoolTask
      </a>

      <div class="navRightSide">
        <ul class="navLinks">
          ${navLinksHTML}
        </ul>

        <div class="dropdownContainer">
          <button class="userDropdownBtn" id="userMenuBtn">
            <i class="fa-solid fa-user"></i>
            ${user ? user.username : "Account"}
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div class="dropdownMenu" id="userDropdownMenu">
            ${dropdownHTML}
          </div>
        </div>
      </div>
    </nav>
  </header>
`;

document.body.insertAdjacentHTML("afterbegin", navbarHTML);

document.querySelectorAll(".navLinks a").forEach(function (link) {
  var linkPage = link.getAttribute("href").split("/").pop();
  if (linkPage === currentPage) {
    link.classList.add("activeLink");
  }
});

var menuBtn = document.getElementById("userMenuBtn");
var dropMenu = document.getElementById("userDropdownMenu");

menuBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  dropMenu.classList.toggle("show");
});

document.addEventListener("click", function () {
  dropMenu.classList.remove("show");
});

var logoutBtn = document.getElementById("logoutAction");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    window.location.href = root + "login.html";
  });
}
