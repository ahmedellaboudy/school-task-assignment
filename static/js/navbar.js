document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/me/')
    .then(response => response.json())
    .then(user => {
      renderNavbar(user);
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
      renderNavbar({ is_authenticated: false });
    });
});

function renderNavbar(user) {
  var navLinksHTML = "";
  var dropdownHTML = "";
  var homeLink = "/"; 
  var currentPath = window.location.pathname;

  if (!user.is_authenticated) {
    dropdownHTML = `
      <a href="/login/"><i class="fa-solid fa-right-to-bracket"></i> Sign In</a>
      <a href="/signup/"><i class="fa-solid fa-user-plus"></i> Sign Up</a>
    `;
  } else if (user.role === "admin") {
    homeLink = "/admin-panel/dashboard/";
    navLinksHTML = `
      <li><a href="/admin-panel/tasks/" class="${currentPath === '/admin-panel/tasks/' ? 'activeLink' : ''}">My Tasks</a></li>
      <li><a href="/admin-panel/tasks/add/" class="${currentPath === '/admin-panel/tasks/add/' ? 'activeLink' : ''}">Add Task</a></li>
      <li><a href="/admin-panel/search/" class="${currentPath === '/admin-panel/search/' ? 'activeLink' : ''}">Search</a></li>
    `;
    dropdownHTML = `<a href="#" id="logoutAction"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>`;
  }  else if (user.role === "teacher") {
    homeLink = "/teacher/dashboard/"; 
    navLinksHTML = `
      <li><a href="/teacher/tasks/" class="${currentPath === '/teacher/tasks/' ? 'activeLink' : ''}">My Tasks</a></li>
      <li><a href="/teacher/tasks/completed/" class="${currentPath === '/teacher/tasks/completed/' ? 'activeLink' : ''}">Completed</a></li>
    `;
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
              ${user.is_authenticated ? user.username : "Account"}
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

  var menuBtn = document.getElementById("userMenuBtn");
  var dropMenu = document.getElementById("userDropdownMenu");

  if (menuBtn && dropMenu) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropMenu.classList.toggle("show");
    });

    document.addEventListener("click", function () {
      dropMenu.classList.remove("show");
    });
  }

  var logoutBtn = document.getElementById("logoutAction");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      fetch('/api/logout/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        }
      }).then(() => {
        window.location.href = "/";
      });
    });
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}