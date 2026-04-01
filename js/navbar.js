document.addEventListener('DOMContentLoaded', function () {
    const testUser = {
        username: "Abdelaziz", 
        isAdmin: false, 
        role: "teacher"  
    };

    
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(testUser));
    }
    renderNavbar();
});

function renderNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;

    const currentUserInfo = localStorage.getItem('currentUser');
    const user = currentUserInfo ? JSON.parse(currentUserInfo) : null;

    let navLinksHTML = '';
    let dropdownHTML = '';

    if (!user) {
        dropdownHTML = `
            <a href="../login.html"><i class="fa-solid fa-right-to-bracket"></i> Sign In</a>
            <a href="../signup.html"><i class="fa-solid fa-user-plus"></i> Sign Up</a>
        `;
    } 
    else if (user.isAdmin === true || user.role === 'admin') {
        navLinksHTML = `
            <li><a href="../admin/admin-tasks.html">Admin Tasks</a></li>
            <li><a href="../admin/add-task.html">Add Task</a></li>
            <li><a href="../admin/admin-search.html">Search</a></li>
        `;
        dropdownHTML = `
            <a href="#" id="logoutAction"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>
        `;
    } 
    else {
        navLinksHTML = `
            <li><a href="../teacher/teacher-tasks.html">My Tasks</a></li>
            <li><a href="../teacher/completed-tasks.html">Completed</a></li>
        `;
        dropdownHTML = `
            <a href="#" id="logoutAction"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>
        `;
    }

    const finalNavHTML = `
        <header class="mainHeader">
            <nav class="ignoreNav">
                <a href="../index.html" class="brandLogo" style="text-decoration: none;">
                    <i class="fa-solid fa-graduation-cap"></i> SchoolTask
                </a>
                
                <div class="navRightSide">
                    <ul class="navLinks">
                        ${navLinksHTML}
                    </ul>

                    <div class="dropdownContainer">
                        <button class="userDropdownBtn" id="userMenuBtn">
                            <i class="fa-solid fa-user"></i> 
                            ${user ? user.username || 'User' : 'Account'} 
                            <i class="fa-solid fa-chevron-down" style="font-size: 12px;"></i>
                        </button>
                        <div class="dropdownMenu" id="userDropdownMenu">
                            ${dropdownHTML}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    `;

    navbarPlaceholder.innerHTML = finalNavHTML;

    setupNavbarInteractions();
}

function setupNavbarInteractions() {
    const menuBtn = document.getElementById('userMenuBtn');
    const dropdownMenu = document.getElementById('userDropdownMenu');

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); 
            dropdownMenu.classList.toggle('show');
        });

     
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    
    const logoutAction = document.getElementById('logoutAction');
    if (logoutAction) {
        logoutAction.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser'); 
            window.location.href = '../login.html'; 
        });
    }
}