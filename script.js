document.addEventListener('DOMContentLoaded', function() {

    // ========== HELPER FUNCTIONS ==========
    function getRecords() {
        return JSON.parse(localStorage.getItem('lms_records') || '[]');
    }
    function saveRecords(records) {
        localStorage.setItem('lms_records', JSON.stringify(records));
    }
    function getAdmins() {
        return JSON.parse(localStorage.getItem('lms_admins') || '[]');
    }
    function saveAdmins(admins) {
        localStorage.setItem('lms_admins', JSON.stringify(admins));
    }
    function getStudents() {
        return JSON.parse(localStorage.getItem('lms_students') || '[]');
    }
    function saveStudents(students) {
        localStorage.setItem('lms_students', JSON.stringify(students));
    }
    function getGrades() {
        return JSON.parse(localStorage.getItem('lms_grades') || '[]');
    }
    function saveGrades(grades) {
        localStorage.setItem('lms_grades', JSON.stringify(grades));
    }

    // Initialize default admin
    if (getAdmins().length === 0) {
        saveAdmins([{ name: "Administrator", email: "admin@lms.edu.ph", password: "admin123" }]);
    }

    // Initialize sample grades
    if (getGrades().length === 0) {
        saveGrades([
            { studentEmail: "student@example.com", subject: "Intro to Computing", prelim: 85, midterm: 88, final: 90, units: 3 },
            { studentEmail: "student@example.com", subject: "Programming 1", prelim: 82, midterm: 85, final: 87, units: 3 },
            { studentEmail: "student@example.com", subject: "Computer Fundamentals", prelim: 90, midterm: 92, final: 94, units: 3 },
            { studentEmail: "student@example.com", subject: "Math in IT", prelim: 78, midterm: 80, final: 82, units: 3 },
            { studentEmail: "student@example.com", subject: "Web Development", prelim: 88, midterm: 90, final: 92, units: 3 }
        ]);
    }

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('enrollmentDate');
    if (dateInput && !dateInput.value) dateInput.value = today;

    // ========== COURSE DATA ==========
    const courses = {
        "BSIT": {
            "1st Year": ["Intro to Computing", "Programming 1", "Computer Fundamentals", "Math in IT", "NSTP", "Physical Education", "Web Development Basics"],
            "2nd Year": ["Data Structures", "OOP", "Database Systems", "Networking", "System Analysis", "HCI", "Mobile Dev"],
            "3rd Year": ["Software Engineering", "Advanced DB", "Web Systems", "IT Security", "Capstone 1", "Cloud Computing", "Research Methods"],
            "4th Year": ["Capstone 2", "Internship", "IT Seminar", "Project Management", "AI Basics", "Elective 1", "Career Prep"]
        },
        "BSBA": {
            "1st Year": ["Principles of Management", "Business Math", "Economics", "Accounting Basics", "NSTP", "English", "PE"],
            "2nd Year": ["Marketing Management", "Financial Management", "HR Management", "Operations Management", "Business Law", "Business Ethics", "Statistics"],
            "3rd Year": ["Strategic Management", "International Business", "Entrepreneurship", "Business Research", "Supply Chain", "Taxation", "Elective"],
            "4th Year": ["Business Policy", "Internship", "Feasibility Study", "Business Analytics", "Capstone", "Seminar", "Career Prep"]
        },
        "BEED": {
            "1st Year": ["Child Development", "Educational Psychology", "Foundations of Education", "Teaching Math", "Teaching English", "NSTP", "PE"],
            "2nd Year": ["Curriculum Dev", "Assessment in Learning", "Teaching Science", "Teaching Filipino", "Classroom Management", "Educational Technology", "Special Education"],
            "3rd Year": ["Teaching Internship 1", "Action Research", "Multicultural Education", "Mother Tongue", "Literacy Training", "Arts in Education", "Elective"],
            "4th Year": ["Teaching Internship 2", "Professional Ethics", "School Administration", "Capstone Project", "Seminar", "Career Prep"]
        },
        "BSPSY": {
            "1st Year": ["General Psychology", "Theories of Personality", "Developmental Psychology", "Social Psychology", "NSTP", "English", "PE"],
            "2nd Year": ["Abnormal Psychology", "Cognitive Psychology", "Biological Psychology", "Psychological Assessment", "Statistics", "Research Methods", "Industrial Psych"],
            "3rd Year": ["Clinical Psychology", "Counseling Psychology", "Educational Psychology", "Organizational Psych", "Experimental Psych", "Ethics in Psychology", "Elective"],
            "4th Year": ["Psychological Testing", "Internship", "Thesis Writing", "Forensic Psychology", "Seminar", "Career Prep"]
        },
        "BSA": {
            "1st Year": ["Accounting 1", "Business Math", "Economics", "Management", "NSTP", "English", "PE"],
            "2nd Year": ["Accounting 2", "Cost Accounting", "Financial Accounting", "Business Law", "Taxation", "Statistics", "Auditing"],
            "3rd Year": ["Advanced Accounting", "Management Accounting", "Accounting Information System", "Govt Accounting", "Accounting Research", "Elective", "Ethics"],
            "4th Year": ["Auditing Problems", "Internship", "Accountancy Capstone", "Financial Management", "Seminar", "Career Prep"]
        },
        "BSHM": {
            "1st Year": ["Food Safety", "Culinary Basics", "Tourism Intro", "Hospitality Management", "NSTP", "English", "PE"],
            "2nd Year": ["Food and Beverage", "Housekeeping", "Front Office", "Kitchen Operations", "Menu Planning", "Cost Control", "Wine Studies"],
            "3rd Year": ["Event Management", "Cruise Management", "Hotel Operations", "Restaurant Management", "Gastronomy", "Elective", "Foreign Language"],
            "4th Year": ["Internship 1", "Internship 2", "Capstone Project", "Entrepreneurship", "Seminar", "Career Prep"]
        }
    };

    function getSchedule(index) {
        const times = [
            "8:00 AM - 9:30 AM", "9:30 AM - 11:00 AM", "11:00 AM - 12:30 PM",
            "1:00 PM - 2:30 PM", "2:30 PM - 4:00 PM", "4:00 PM - 5:30 PM",
            "5:30 PM - 7:00 PM"
        ];
        return times[index % times.length];
    }

    // ========== LOGIN PAGE ==========
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('loginRole').value;
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;

            if (role === 'admin') {
                const admin = getAdmins().find(a => a.email === email);
                if (admin && admin.password === password) {
                    localStorage.setItem('lms_admin_logged_in', 'true');
                    localStorage.setItem('lms_logged_in_user', JSON.stringify({ email, role: 'admin', name: admin.name }));
                    alert('✅ Admin login successful!');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('❌ Invalid admin credentials. Use admin@lms.edu.ph / admin123');
                }
            } else {
                const student = getStudents().find(s => s.email === email);
                if (student && student.password === password) {
                    localStorage.setItem('lms_logged_in_user', JSON.stringify({ email, role: 'student', name: student.name }));
                    alert('✅ Student login successful!');
                    window.location.href = 'student-dashboard.html';
                } else {
                    alert('❌ Invalid student credentials. Please register first.');
                }
            }
        });
    }

    // ========== STUDENT REGISTRATION ==========
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirm').value;

            if (password !== confirm) {
                alert('❌ Passwords do not match.');
                return;
            }
            if (password.length < 4) {
                alert('❌ Password must be at least 4 characters.');
                return;
            }
            if (getStudents().find(s => s.email === email)) {
                alert('❌ Email already registered.');
                return;
            }

            const students = getStudents();
            students.push({ name, email, password });
            saveStudents(students);
            alert('✅ Account created! Please login.');
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('signinForm').style.display = 'block';
            registerForm.reset();
        });
    }

    // ========== ADMIN REGISTRATION ==========
    const adminRegForm = document.getElementById('adminRegisterFormElement');
    if (adminRegForm) {
        adminRegForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const secret = document.getElementById('adminRegSecret').value.trim();
            const name = document.getElementById('adminRegName').value.trim();
            const email = document.getElementById('adminRegEmail').value.trim().toLowerCase();
            const password = document.getElementById('adminRegPassword').value;

            if (secret !== 'PLSP2026') {
                alert('❌ Invalid secret code.');
                return;
            }
            if (getAdmins().find(a => a.email === email)) {
                alert('❌ Admin email already exists.');
                return;
            }

            const admins = getAdmins();
            admins.push({ name, email, password });
            saveAdmins(admins);
            alert('✅ Admin account created!');
            document.getElementById('adminRegisterForm').style.display = 'none';
            document.getElementById('signinForm').style.display = 'block';
            adminRegForm.reset();
        });
    }

    // ========== FORM TOGGLES ==========
    const showRegister = document.getElementById('showRegister');
    const showSignin = document.getElementById('showSignin');
    const showAdminRegister = document.getElementById('showAdminRegister');
    const showSigninFromAdmin = document.getElementById('showSigninFromAdmin');

    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const register = document.getElementById('registerForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (signin) signin.style.display = 'none';
            if (register) register.style.display = 'block';
            if (adminReg) adminReg.style.display = 'none';
        });
    }
    if (showSignin) {
        showSignin.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const register = document.getElementById('registerForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (register) register.style.display = 'none';
            if (adminReg) adminReg.style.display = 'none';
            if (signin) signin.style.display = 'block';
        });
    }
    if (showAdminRegister) {
        showAdminRegister.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const register = document.getElementById('registerForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (signin) signin.style.display = 'none';
            if (register) register.style.display = 'none';
            if (adminReg) adminReg.style.display = 'block';
        });
    }
    if (showSigninFromAdmin) {
        showSigninFromAdmin.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (adminReg) adminReg.style.display = 'none';
            if (signin) signin.style.display = 'block';
        });
    }

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const modalEl = document.getElementById('contactModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
            contactForm.reset();
        });
    }

    // ========== DATA ENTRY FORM ==========
    const dataEntryForm = document.querySelector('.needs-validation');
    if (dataEntryForm && !dataEntryForm.closest('#updateForm')) {
        dataEntryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!dataEntryForm.checkValidity()) {
                dataEntryForm.classList.add('was-validated');
                return;
            }
            const records = getRecords();
            records.push({
                name: document.getElementById('studentName').value,
                email: document.getElementById('studentEmail').value,
                course: document.getElementById('studentCourse').value,
                date: document.getElementById('enrollmentDate').value,
                status: document.getElementById('studentStatus').value
            });
            saveRecords(records);
            alert('✅ Enrollment successful!');
            dataEntryForm.reset();
            dataEntryForm.classList.remove('was-validated');
            const dateField = document.getElementById('enrollmentDate');
            if (dateField) dateField.value = today;
        });
    }

    // ========== ADMIN DASHBOARD (FIXED - NO ENROLL NOW BUTTON) ==========
    function loadAdminDashboard() {
        const container = document.getElementById('dashboardContainer');
        if (!container) return;

        const isAdmin = localStorage.getItem('lms_admin_logged_in') === 'true';
        
        if (!isAdmin) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-shield-lock display-1 text-danger"></i>
                    <h3 class="mt-3">Access Denied</h3>
                    <p>This page is for administrators only.</p>
                    <a href="login.html" class="btn btn-primary">Login as Admin</a>
                </div>
            `;
            return;
        }

        const records = getRecords();
        const uniqueCourses = [...new Set(records.map(r => r.course).filter(Boolean))];
        
        container.innerHTML = `
            <h2 class="mb-4">📊 Admin Dashboard</h2>
            
            <!-- STATISTICS CARDS -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-primary text-white text-center p-3 stats-card">
                        <h5>${uniqueCourses.length}</h5>
                        <small>Programs</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-info text-white text-center p-3 stats-card">
                        <h5>${records.length}</h5>
                        <small>Total Registrants</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-success text-white text-center p-3 stats-card">
                        <h5>${records.filter(r => r.status === 'Active').length}</h5>
                        <small>Enrolled</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-warning text-white text-center p-3 stats-card">
                        <h5>${records.filter(r => r.status === 'Pending').length}</h5>
                        <small>Pending</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-danger text-white text-center p-3 stats-card">
                        <h5>${records.filter(r => r.status === 'Dropped').length}</h5>
                        <small>Dropped</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-secondary text-white text-center p-3 stats-card">
                        <h5>Admin</h5>
                        <small>Active Session</small>
                    </div>
                </div>
            </div>
            
            <!-- RECENT ENROLLMENTS -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>📋 Recent Enrollments</h4>
                <a href="table-list.html" class="btn btn-sm btn-outline-primary">View All Records →</a>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr><th>Name</th><th>Course</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                        ${records.slice(0, 5).map(r => `
                            <tr>
                                <td>${r.name}</td>
                                <td>${r.course}</td>
                                <td><span class="badge bg-${r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}">${r.status}</span></td>
                                <td>${r.date || 'N/A'}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="text-center">No records yet. <a href="data-entry.html">Add first enrollment</a></td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ========== ADMIN RECORDS TABLE ==========
    function loadAdminRecords() {
        const container = document.getElementById('recordsContainer');
        if (!container) return;

        const isAdmin = localStorage.getItem('lms_admin_logged_in') === 'true';
        
        if (!isAdmin) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-shield-lock display-1 text-danger"></i>
                    <h3>Access Denied</h3>
                    <p>This page is for administrators only.</p>
                    <a href="login.html" class="btn btn-primary">Login as Admin</a>
                </div>
            `;
            return;
        }

        const records = getRecords();
        
        container.innerHTML = `
            <h2 class="mb-3">📄 Student Records</h2>
            <div class="input-group mb-4">
                <input type="text" id="searchInput" class="form-control" placeholder="Search by name, email, or course...">
                <button class="btn btn-outline-primary" id="searchBtn">🔍 Search</button>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-primary">
                        <tr><th>#</th><th>Name</th><th>Email</th><th>Course</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody id="recordsTableBody">
                        ${records.map((r, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${r.name}</td>
                                <td>${r.email}</td>
                                <td>${r.course}</td>
                                <td>${r.date || 'N/A'}</td>
                                <td><span class="badge bg-${r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}">${r.status}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary edit-btn" data-index="${i}">✏️ Edit</button>
                                    <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${i}">🗑️ Delete</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="7" class="text-center">No records yet. <a href="data-entry.html">Add enrollment</a></td></tr>'}
                    </tbody>
                </table>
            </div>
        `;

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this record permanently?')) {
                    const records = getRecords();
                    records.splice(this.dataset.index, 1);
                    saveRecords(records);
                    loadAdminRecords();
                    loadAdminDashboard();
                    alert('✅ Record deleted.');
                }
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const records = getRecords();
                const rec = records[this.dataset.index];
                document.getElementById('updateIndex').value = this.dataset.index;
                document.getElementById('updateName').value = rec.name;
                document.getElementById('updateEmail').value = rec.email;
                document.getElementById('updateCourse').value = rec.course;
                document.getElementById('updateDate').value = rec.date;
                document.getElementById('updateStatus').value = rec.status;
                new bootstrap.Modal(document.getElementById('updateModal')).show();
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        if (searchInput) {
            const filterTable = () => {
                const keyword = searchInput.value.toLowerCase();
                document.querySelectorAll('#recordsTableBody tr').forEach(row => {
                    row.style.display = row.innerText.toLowerCase().includes(keyword) ? '' : 'none';
                });
            };
            searchInput.addEventListener('keyup', filterTable);
            if (searchBtn) searchBtn.addEventListener('click', filterTable);
        }
    }

    // Update form submit
    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const i = document.getElementById('updateIndex').value;
            const records = getRecords();
            records[i] = {
                name: document.getElementById('updateName').value,
                email: document.getElementById('updateEmail').value,
                course: document.getElementById('updateCourse').value,
                date: document.getElementById('updateDate').value,
                status: document.getElementById('updateStatus').value
            };
            saveRecords(records);
            bootstrap.Modal.getInstance(document.getElementById('updateModal')).hide();
            loadAdminRecords();
            loadAdminDashboard();
            alert('✅ Record updated!');
        });
    }

    // ========== STUDENT DASHBOARD ==========
    function loadStudentDashboard() {
        const container = document.getElementById('dashboardContent');
        if (!container) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        if (user.role !== 'student') {
            window.location.href = 'dashboard.html';
            return;
        }

        // Get student's course from enrollments
        const enrollments = getRecords();
        const myEnrollment = enrollments.find(e => e.email === user.email);
        let studentCourse = "BSIT";
        let studentYear = localStorage.getItem('student_selected_year') || "1st Year";
        
        if (myEnrollment) {
            const courseMap = {
                "Bachelor of Science in Information Technology": "BSIT",
                "Bachelor of Science in Business Administration": "BSBA",
                "Bachelor of Elementary Education": "BEED",
                "Bachelor of Science in Psychology": "BSPSY",
                "Bachelor of Science in Accountancy": "BSA",
                "Bachelor of Science in Hospitality Management": "BSHM"
            };
            studentCourse = courseMap[myEnrollment.course] || "BSIT";
        }

        const subjects = courses[studentCourse]?.[studentYear] || courses["BSIT"]["1st Year"];
        
        let subjectsHtml = '';
        subjects.forEach((subj, i) => {
            subjectsHtml += `
            <div class="col-lg-4 col-md-6">
                <div class="card p-3 h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="badge bg-primary">Subject ${i+1}</span>
                        <i class="bi bi-bookmark-check fs-5 text-primary"></i>
                    </div>
                    <h5 class="mt-2">${subj}</h5>
                    <p class="text-muted small mb-1">
                        <i class="bi bi-clock"></i> ${getSchedule(i)}
                    </p>
                    <p class="text-muted small">
                        <i class="bi bi-building"></i> Room ${101 + i}
                    </p>
                    <div class="mt-2">
                        <span class="badge bg-secondary">${studentCourse}</span>
                        <span class="badge bg-info ms-1">${studentYear}</span>
                    </div>
                </div>
            </div>
            `;
        });

        container.innerHTML = `
            <div class="header bg-primary text-white p-4 rounded-3 mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h3><i class="bi bi-person-circle"></i> Welcome ${user.name}</h3>
                        <p class="mb-1 mt-2"><i class="bi bi-mortarboard"></i> <b>Course:</b> ${studentCourse}</p>
                        <p class="mb-0"><i class="bi bi-calendar"></i> <b>Year Level:</b> ${studentYear}</p>
                    </div>
                    <div><i class="bi bi-robot display-4"></i></div>
                </div>
            </div>
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card p-3 text-center">
                        <i class="bi bi-journal-bookmark-fill display-6 text-primary"></i>
                        <h5 class="mt-2">Total Subjects</h5>
                        <h2 class="text-primary">${subjects.length}</h2>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 text-center">
                        <i class="bi bi-clock-history display-6 text-success"></i>
                        <h5 class="mt-2">Schedule Time</h5>
                        <p class="mb-0 fw-bold">8:00 AM - 7:00 PM</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 text-center">
                        <i class="bi bi-check-circle-fill display-6 text-success"></i>
                        <h5 class="mt-2">Status</h5>
                        <span class="badge bg-success fs-6">Active Student</span>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4><i class="bi bi-book"></i> Your Subjects</h4>
                <div class="dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" id="yearDropdownBtn">
                        ${studentYear}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item year-option" data-year="1st Year">1st Year</a></li>
                        <li><a class="dropdown-item year-option" data-year="2nd Year">2nd Year</a></li>
                        <li><a class="dropdown-item year-option" data-year="3rd Year">3rd Year</a></li>
                        <li><a class="dropdown-item year-option" data-year="4th Year">4th Year</a></li>
                    </ul>
                </div>
            </div>
            <div class="row g-3" id="subjectContainer">${subjectsHtml}</div>
        `;

        // Year dropdown handler
        document.querySelectorAll('.year-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const newYear = this.dataset.year;
                localStorage.setItem('student_selected_year', newYear);
                loadStudentDashboard();
            });
        });
    }

    // ========== MY ENROLLMENTS PAGE ==========
    function loadMyEnrollments() {
        const tbody = document.getElementById('enrollmentsTable');
        if (!tbody) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        const records = getRecords();
        const myRecords = records.filter(r => r.email === user.email);
        
        if (myRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No enrollments found. <a href="data-entry.html">Enroll now</a></td></tr>';
            return;
        }

        tbody.innerHTML = myRecords.map((r, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${r.course}</td>
                <td>${r.date || 'N/A'}</td>
                <td><span class="badge bg-${r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}">${r.status}</span></td>
                <td><button class="btn btn-sm btn-danger cancel-enrollment" data-email="${r.email}" data-course="${r.course}">Cancel</button></td>
            </tr>
        `).join('');

        // Cancel enrollment
        document.querySelectorAll('.cancel-enrollment').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Cancel this enrollment?')) {
                    const records = getRecords();
                    const updatedRecords = records.filter(r => !(r.email === this.dataset.email && r.course === this.dataset.course));
                    saveRecords(updatedRecords);
                    loadMyEnrollments();
                    alert('✅ Enrollment cancelled.');
                }
            });
        });
    }

    // ========== PROFILE PAGE ==========
    function loadProfile() {
        const nameField = document.getElementById('profileName');
        const emailField = document.getElementById('profileEmail');
        
        if (!nameField) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        const students = getStudents();
        const student = students.find(s => s.email === user.email);
        
        if (student) {
            nameField.value = student.name;
            emailField.value = student.email;
        }

        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const newName = document.getElementById('profileName').value.trim();
                const newPassword = document.getElementById('profileNewPassword').value;
                const confirmPassword = document.getElementById('profileConfirmPassword').value;

                if (newPassword && newPassword !== confirmPassword) {
                    alert('❌ Passwords do not match.');
                    return;
                }

                const students = getStudents();
                const studentIndex = students.findIndex(s => s.email === user.email);
                if (studentIndex !== -1) {
                    students[studentIndex].name = newName;
                    if (newPassword) {
                        students[studentIndex].password = newPassword;
                    }
                    saveStudents(students);
                    
                    user.name = newName;
                    localStorage.setItem('lms_logged_in_user', JSON.stringify(user));
                    
                    alert('✅ Profile updated successfully!');
                    window.location.reload();
                }
            });
        }
    }

    // ========== GRADES PAGE ==========
    function loadGrades() {
        const gradesTable = document.getElementById('gradesTable');
        const gwaSpan = document.getElementById('gwa');
        const totalUnitsSpan = document.getElementById('totalUnits');
        const passedSpan = document.getElementById('passedCount');
        const failedSpan = document.getElementById('failedCount');
        
        if (!gradesTable) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        const allGrades = getGrades();
        const myGrades = allGrades.filter(g => g.studentEmail === user.email || g.studentEmail === "student@example.com");
        
        if (myGrades.length === 0) {
            gradesTable.innerHTML = '<tr><td colspan="7" class="text-center">No grades available yet. </td></tr>';
            return;
        }

        let totalAvg = 0;
        let totalUnits = 0;
        let passed = 0;
        let failed = 0;

        gradesTable.innerHTML = myGrades.map(g => {
            const avg = (g.prelim + g.midterm + g.final) / 3;
            totalAvg += avg;
            totalUnits += g.units || 3;
            if (avg >= 75) {
                passed++;
            } else {
                failed++;
            }
            
            let gradeLetter = '';
            let gradeClass = '';
            if (avg >= 90) { gradeLetter = 'A'; gradeClass = 'bg-success text-white'; }
            else if (avg >= 80) { gradeLetter = 'B'; gradeClass = 'bg-info text-white'; }
            else if (avg >= 75) { gradeLetter = 'C'; gradeClass = 'bg-warning'; }
            else { gradeLetter = 'D'; gradeClass = 'bg-danger text-white'; }
            
            return `
                <tr>
                    <td>${g.subject}</td>
                    <td>${g.prelim}</td>
                    <td>${g.midterm}</td>
                    <td>${g.final}</td>
                    <td><strong>${avg.toFixed(2)}</strong></td>
                    <td class="text-center"><span class="badge ${gradeClass}">${gradeLetter}</span></td>
                    <td>${avg >= 75 ? '✅ Passed' : '❌ Failed'}</td>
                </tr>
            `;
        }).join('');

        const gwa = totalAvg / myGrades.length;
        if (gwaSpan) gwaSpan.textContent = gwa.toFixed(2);
        if (totalUnitsSpan) totalUnitsSpan.textContent = totalUnits;
        if (passedSpan) passedSpan.textContent = passed;
        if (failedSpan) failedSpan.textContent = failed;
    }

    // ========== COURSES PAGE ==========
    function loadCourses() {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        const courseList = [
            { code: "BSIT", name: "BS Information Technology", duration: "4 years", description: "Learn programming, networking, and database management.", slots: 45 },
            { code: "BSBA", name: "BS Business Administration", duration: "4 years", description: "Develop management, marketing, and financial skills.", slots: 50 },
            { code: "BEED", name: "Bachelor of Elementary Education", duration: "4 years", description: "Become a professional elementary teacher.", slots: 40 },
            { code: "BSPSY", name: "BS Psychology", duration: "4 years", description: "Study human behavior and mental processes.", slots: 45 },
            { code: "BSA", name: "BS Accountancy", duration: "4 years", description: "Master accounting, auditing, and taxation.", slots: 40 },
            { code: "BSHM", name: "BS Hospitality Management", duration: "4 years", description: "Learn hotel and restaurant management.", slots: 50 }
        ];

        container.innerHTML = courseList.map(c => `
            <div class="col-md-6 col-lg-4">
                <div class="card course-card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title text-primary">${c.name}</h5>
                            <span class="badge bg-primary">${c.code}</span>
                        </div>
                        <p class="card-text mt-2">${c.description}</p>
                        <p class="text-muted small"><i class="bi bi-clock"></i> ${c.duration}</p>
                        <p class="text-muted small"><i class="bi bi-people"></i> ${c.slots} slots available</p>
                        <a href="login.html" class="btn btn-outline-primary w-100">Enroll Now</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ========== LOGOUT ==========
    function handleLogout(e) {
        if (e) e.preventDefault();
        localStorage.removeItem('lms_admin_logged_in');
        localStorage.removeItem('lms_logged_in_user');
        localStorage.removeItem('student_selected_year');
        alert('✅ Logged out!');
        window.location.href = 'index.html';
    }

    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnRecords');
    logoutBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', handleLogout);
    });

    // ========== INITIALIZE ALL PAGES ==========
    loadAdminDashboard();
    loadAdminRecords();
    loadStudentDashboard();
    loadMyEnrollments();
    loadProfile();
    loadGrades();
    loadCourses();
});document.addEventListener('DOMContentLoaded', function() {

    // ========== HELPER FUNCTIONS ==========
    function getRecords() {
        return JSON.parse(localStorage.getItem('lms_records') || '[]');
    }
    function saveRecords(records) {
        localStorage.setItem('lms_records', JSON.stringify(records));
    }
    function getAdmins() {
        return JSON.parse(localStorage.getItem('lms_admins') || '[]');
    }
    function saveAdmins(admins) {
        localStorage.setItem('lms_admins', JSON.stringify(admins));
    }
    function getStudents() {
        return JSON.parse(localStorage.getItem('lms_students') || '[]');
    }
    function saveStudents(students) {
        localStorage.setItem('lms_students', JSON.stringify(students));
    }
    function getGrades() {
        return JSON.parse(localStorage.getItem('lms_grades') || '[]');
    }
    function saveGrades(grades) {
        localStorage.setItem('lms_grades', JSON.stringify(grades));
    }

    // Initialize default admin
    if (getAdmins().length === 0) {
        saveAdmins([{ name: "Administrator", email: "admin@lms.edu.ph", password: "admin123" }]);
    }

    // Initialize sample grades
    if (getGrades().length === 0) {
        saveGrades([
            { studentEmail: "student@example.com", subject: "Intro to Computing", prelim: 85, midterm: 88, final: 90, units: 3 },
            { studentEmail: "student@example.com", subject: "Programming 1", prelim: 82, midterm: 85, final: 87, units: 3 },
            { studentEmail: "student@example.com", subject: "Computer Fundamentals", prelim: 90, midterm: 92, final: 94, units: 3 },
            { studentEmail: "student@example.com", subject: "Math in IT", prelim: 78, midterm: 80, final: 82, units: 3 },
            { studentEmail: "student@example.com", subject: "Web Development", prelim: 88, midterm: 90, final: 92, units: 3 }
        ]);
    }

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('enrollmentDate');
    if (dateInput && !dateInput.value) dateInput.value = today;

    // ========== COURSE DATA ==========
    const courses = {
        "BSIT": {
            "1st Year": ["Intro to Computing", "Programming 1", "Computer Fundamentals", "Math in IT", "NSTP", "Physical Education", "Web Development Basics"],
            "2nd Year": ["Data Structures", "OOP", "Database Systems", "Networking", "System Analysis", "HCI", "Mobile Dev"],
            "3rd Year": ["Software Engineering", "Advanced DB", "Web Systems", "IT Security", "Capstone 1", "Cloud Computing", "Research Methods"],
            "4th Year": ["Capstone 2", "Internship", "IT Seminar", "Project Management", "AI Basics", "Elective 1", "Career Prep"]
        },
        "BSBA": {
            "1st Year": ["Principles of Management", "Business Math", "Economics", "Accounting Basics", "NSTP", "English", "PE"],
            "2nd Year": ["Marketing Management", "Financial Management", "HR Management", "Operations Management", "Business Law", "Business Ethics", "Statistics"],
            "3rd Year": ["Strategic Management", "International Business", "Entrepreneurship", "Business Research", "Supply Chain", "Taxation", "Elective"],
            "4th Year": ["Business Policy", "Internship", "Feasibility Study", "Business Analytics", "Capstone", "Seminar", "Career Prep"]
        },
        "BEED": {
            "1st Year": ["Child Development", "Educational Psychology", "Foundations of Education", "Teaching Math", "Teaching English", "NSTP", "PE"],
            "2nd Year": ["Curriculum Dev", "Assessment in Learning", "Teaching Science", "Teaching Filipino", "Classroom Management", "Educational Technology", "Special Education"],
            "3rd Year": ["Teaching Internship 1", "Action Research", "Multicultural Education", "Mother Tongue", "Literacy Training", "Arts in Education", "Elective"],
            "4th Year": ["Teaching Internship 2", "Professional Ethics", "School Administration", "Capstone Project", "Seminar", "Career Prep"]
        },
        "BSPSY": {
            "1st Year": ["General Psychology", "Theories of Personality", "Developmental Psychology", "Social Psychology", "NSTP", "English", "PE"],
            "2nd Year": ["Abnormal Psychology", "Cognitive Psychology", "Biological Psychology", "Psychological Assessment", "Statistics", "Research Methods", "Industrial Psych"],
            "3rd Year": ["Clinical Psychology", "Counseling Psychology", "Educational Psychology", "Organizational Psych", "Experimental Psych", "Ethics in Psychology", "Elective"],
            "4th Year": ["Psychological Testing", "Internship", "Thesis Writing", "Forensic Psychology", "Seminar", "Career Prep"]
        },
        "BSA": {
            "1st Year": ["Accounting 1", "Business Math", "Economics", "Management", "NSTP", "English", "PE"],
            "2nd Year": ["Accounting 2", "Cost Accounting", "Financial Accounting", "Business Law", "Taxation", "Statistics", "Auditing"],
            "3rd Year": ["Advanced Accounting", "Management Accounting", "Accounting Information System", "Govt Accounting", "Accounting Research", "Elective", "Ethics"],
            "4th Year": ["Auditing Problems", "Internship", "Accountancy Capstone", "Financial Management", "Seminar", "Career Prep"]
        },
        "BSHM": {
            "1st Year": ["Food Safety", "Culinary Basics", "Tourism Intro", "Hospitality Management", "NSTP", "English", "PE"],
            "2nd Year": ["Food and Beverage", "Housekeeping", "Front Office", "Kitchen Operations", "Menu Planning", "Cost Control", "Wine Studies"],
            "3rd Year": ["Event Management", "Cruise Management", "Hotel Operations", "Restaurant Management", "Gastronomy", "Elective", "Foreign Language"],
            "4th Year": ["Internship 1", "Internship 2", "Capstone Project", "Entrepreneurship", "Seminar", "Career Prep"]
        }
    };

    function getSchedule(index) {
        const times = [
            "8:00 AM - 9:30 AM", "9:30 AM - 11:00 AM", "11:00 AM - 12:30 PM",
            "1:00 PM - 2:30 PM", "2:30 PM - 4:00 PM", "4:00 PM - 5:30 PM",
            "5:30 PM - 7:00 PM"
        ];
        return times[index % times.length];
    }

    // ========== LOGIN PAGE ==========
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('loginRole').value;
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;

            if (role === 'admin') {
                const admin = getAdmins().find(a => a.email === email);
                if (admin && admin.password === password) {
                    localStorage.setItem('lms_admin_logged_in', 'true');
                    localStorage.setItem('lms_logged_in_user', JSON.stringify({ email, role: 'admin', name: admin.name }));
                    alert('✅ Admin login successful!');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('❌ Invalid admin credentials. Use admin@lms.edu.ph / admin123');
                }
            } else {
                const student = getStudents().find(s => s.email === email);
                if (student && student.password === password) {
                    localStorage.setItem('lms_logged_in_user', JSON.stringify({ email, role: 'student', name: student.name }));
                    alert('✅ Student login successful!');
                    window.location.href = 'student-dashboard.html';
                } else {
                    alert('❌ Invalid student credentials. Please register first.');
                }
            }
        });
    }

    // ========== STUDENT REGISTRATION ==========
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirm').value;

            if (password !== confirm) {
                alert('❌ Passwords do not match.');
                return;
            }
            if (password.length < 4) {
                alert('❌ Password must be at least 4 characters.');
                return;
            }
            if (getStudents().find(s => s.email === email)) {
                alert('❌ Email already registered.');
                return;
            }

            const students = getStudents();
            students.push({ name, email, password });
            saveStudents(students);
            alert('✅ Account created! Please login.');
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('signinForm').style.display = 'block';
            registerForm.reset();
        });
    }

    // ========== ADMIN REGISTRATION ==========
    const adminRegForm = document.getElementById('adminRegisterFormElement');
    if (adminRegForm) {
        adminRegForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const secret = document.getElementById('adminRegSecret').value.trim();
            const name = document.getElementById('adminRegName').value.trim();
            const email = document.getElementById('adminRegEmail').value.trim().toLowerCase();
            const password = document.getElementById('adminRegPassword').value;

            if (secret !== 'PLSP2026') {
                alert('❌ Invalid secret code.');
                return;
            }
            if (getAdmins().find(a => a.email === email)) {
                alert('❌ Admin email already exists.');
                return;
            }

            const admins = getAdmins();
            admins.push({ name, email, password });
            saveAdmins(admins);
            alert('✅ Admin account created!');
            document.getElementById('adminRegisterForm').style.display = 'none';
            document.getElementById('signinForm').style.display = 'block';
            adminRegForm.reset();
        });
    }

    // ========== FORM TOGGLES ==========
    const showRegister = document.getElementById('showRegister');
    const showSignin = document.getElementById('showSignin');
    const showAdminRegister = document.getElementById('showAdminRegister');
    const showSigninFromAdmin = document.getElementById('showSigninFromAdmin');

    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const register = document.getElementById('registerForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (signin) signin.style.display = 'none';
            if (register) register.style.display = 'block';
            if (adminReg) adminReg.style.display = 'none';
        });
    }
    if (showSignin) {
        showSignin.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const register = document.getElementById('registerForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (register) register.style.display = 'none';
            if (adminReg) adminReg.style.display = 'none';
            if (signin) signin.style.display = 'block';
        });
    }
    if (showAdminRegister) {
        showAdminRegister.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const register = document.getElementById('registerForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (signin) signin.style.display = 'none';
            if (register) register.style.display = 'none';
            if (adminReg) adminReg.style.display = 'block';
        });
    }
    if (showSigninFromAdmin) {
        showSigninFromAdmin.addEventListener('click', function(e) {
            e.preventDefault();
            const signin = document.getElementById('signinForm');
            const adminReg = document.getElementById('adminRegisterForm');
            if (adminReg) adminReg.style.display = 'none';
            if (signin) signin.style.display = 'block';
        });
    }

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const modalEl = document.getElementById('contactModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
            contactForm.reset();
        });
    }

    // ========== DATA ENTRY FORM ==========
    const dataEntryForm = document.querySelector('.needs-validation');
    if (dataEntryForm && !dataEntryForm.closest('#updateForm')) {
        dataEntryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!dataEntryForm.checkValidity()) {
                dataEntryForm.classList.add('was-validated');
                return;
            }
            const records = getRecords();
            records.push({
                name: document.getElementById('studentName').value,
                email: document.getElementById('studentEmail').value,
                course: document.getElementById('studentCourse').value,
                date: document.getElementById('enrollmentDate').value,
                status: document.getElementById('studentStatus').value
            });
            saveRecords(records);
            alert('✅ Enrollment successful!');
            dataEntryForm.reset();
            dataEntryForm.classList.remove('was-validated');
            const dateField = document.getElementById('enrollmentDate');
            if (dateField) dateField.value = today;
        });
    }

    // ========== ADMIN DASHBOARD (FIXED - NO ENROLL NOW BUTTON) ==========
    function loadAdminDashboard() {
        const container = document.getElementById('dashboardContainer');
        if (!container) return;

        const isAdmin = localStorage.getItem('lms_admin_logged_in') === 'true';
        
        if (!isAdmin) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-shield-lock display-1 text-danger"></i>
                    <h3 class="mt-3">Access Denied</h3>
                    <p>This page is for administrators only.</p>
                    <a href="login.html" class="btn btn-primary">Login as Admin</a>
                </div>
            `;
            return;
        }

        const records = getRecords();
        const uniqueCourses = [...new Set(records.map(r => r.course).filter(Boolean))];
        
        container.innerHTML = `
            <h2 class="mb-4">📊 Admin Dashboard</h2>
            
            <!-- STATISTICS CARDS -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-primary text-white text-center p-3 stats-card">
                        <h5>${uniqueCourses.length}</h5>
                        <small>Programs</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-info text-white text-center p-3 stats-card">
                        <h5>${records.length}</h5>
                        <small>Total Registrants</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-success text-white text-center p-3 stats-card">
                        <h5>${records.filter(r => r.status === 'Active').length}</h5>
                        <small>Enrolled</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-warning text-white text-center p-3 stats-card">
                        <h5>${records.filter(r => r.status === 'Pending').length}</h5>
                        <small>Pending</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-danger text-white text-center p-3 stats-card">
                        <h5>${records.filter(r => r.status === 'Dropped').length}</h5>
                        <small>Dropped</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="card bg-secondary text-white text-center p-3 stats-card">
                        <h5>Admin</h5>
                        <small>Active Session</small>
                    </div>
                </div>
            </div>
            
            <!-- RECENT ENROLLMENTS -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>📋 Recent Enrollments</h4>
                <a href="table-list.html" class="btn btn-sm btn-outline-primary">View All Records →</a>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr><th>Name</th><th>Course</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                        ${records.slice(0, 5).map(r => `
                            <tr>
                                <td>${r.name}</td>
                                <td>${r.course}</td>
                                <td><span class="badge bg-${r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}">${r.status}</span></td>
                                <td>${r.date || 'N/A'}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="text-center">No records yet. <a href="data-entry.html">Add first enrollment</a></td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ========== ADMIN RECORDS TABLE ==========
    function loadAdminRecords() {
        const container = document.getElementById('recordsContainer');
        if (!container) return;

        const isAdmin = localStorage.getItem('lms_admin_logged_in') === 'true';
        
        if (!isAdmin) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-shield-lock display-1 text-danger"></i>
                    <h3>Access Denied</h3>
                    <p>This page is for administrators only.</p>
                    <a href="login.html" class="btn btn-primary">Login as Admin</a>
                </div>
            `;
            return;
        }

        const records = getRecords();
        
        container.innerHTML = `
            <h2 class="mb-3">📄 Student Records</h2>
            <div class="input-group mb-4">
                <input type="text" id="searchInput" class="form-control" placeholder="Search by name, email, or course...">
                <button class="btn btn-outline-primary" id="searchBtn">🔍 Search</button>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-primary">
                        <tr><th>#</th><th>Name</th><th>Email</th><th>Course</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody id="recordsTableBody">
                        ${records.map((r, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${r.name}</td>
                                <td>${r.email}</td>
                                <td>${r.course}</td>
                                <td>${r.date || 'N/A'}</td>
                                <td><span class="badge bg-${r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}">${r.status}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary edit-btn" data-index="${i}">✏️ Edit</button>
                                    <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${i}">🗑️ Delete</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="7" class="text-center">No records yet. <a href="data-entry.html">Add enrollment</a></td></tr>'}
                    </tbody>
                </table>
            </div>
        `;

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this record permanently?')) {
                    const records = getRecords();
                    records.splice(this.dataset.index, 1);
                    saveRecords(records);
                    loadAdminRecords();
                    loadAdminDashboard();
                    alert('✅ Record deleted.');
                }
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const records = getRecords();
                const rec = records[this.dataset.index];
                document.getElementById('updateIndex').value = this.dataset.index;
                document.getElementById('updateName').value = rec.name;
                document.getElementById('updateEmail').value = rec.email;
                document.getElementById('updateCourse').value = rec.course;
                document.getElementById('updateDate').value = rec.date;
                document.getElementById('updateStatus').value = rec.status;
                new bootstrap.Modal(document.getElementById('updateModal')).show();
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        if (searchInput) {
            const filterTable = () => {
                const keyword = searchInput.value.toLowerCase();
                document.querySelectorAll('#recordsTableBody tr').forEach(row => {
                    row.style.display = row.innerText.toLowerCase().includes(keyword) ? '' : 'none';
                });
            };
            searchInput.addEventListener('keyup', filterTable);
            if (searchBtn) searchBtn.addEventListener('click', filterTable);
        }
    }

    // Update form submit
    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const i = document.getElementById('updateIndex').value;
            const records = getRecords();
            records[i] = {
                name: document.getElementById('updateName').value,
                email: document.getElementById('updateEmail').value,
                course: document.getElementById('updateCourse').value,
                date: document.getElementById('updateDate').value,
                status: document.getElementById('updateStatus').value
            };
            saveRecords(records);
            bootstrap.Modal.getInstance(document.getElementById('updateModal')).hide();
            loadAdminRecords();
            loadAdminDashboard();
            alert('✅ Record updated!');
        });
    }

    // ========== STUDENT DASHBOARD ==========
    function loadStudentDashboard() {
        const container = document.getElementById('dashboardContent');
        if (!container) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        if (user.role !== 'student') {
            window.location.href = 'dashboard.html';
            return;
        }

        // Get student's course from enrollments
        const enrollments = getRecords();
        const myEnrollment = enrollments.find(e => e.email === user.email);
        let studentCourse = "BSIT";
        let studentYear = localStorage.getItem('student_selected_year') || "1st Year";
        
        if (myEnrollment) {
            const courseMap = {
                "Bachelor of Science in Information Technology": "BSIT",
                "Bachelor of Science in Business Administration": "BSBA",
                "Bachelor of Elementary Education": "BEED",
                "Bachelor of Science in Psychology": "BSPSY",
                "Bachelor of Science in Accountancy": "BSA",
                "Bachelor of Science in Hospitality Management": "BSHM"
            };
            studentCourse = courseMap[myEnrollment.course] || "BSIT";
        }

        const subjects = courses[studentCourse]?.[studentYear] || courses["BSIT"]["1st Year"];
        
        let subjectsHtml = '';
        subjects.forEach((subj, i) => {
            subjectsHtml += `
            <div class="col-lg-4 col-md-6">
                <div class="card p-3 h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="badge bg-primary">Subject ${i+1}</span>
                        <i class="bi bi-bookmark-check fs-5 text-primary"></i>
                    </div>
                    <h5 class="mt-2">${subj}</h5>
                    <p class="text-muted small mb-1">
                        <i class="bi bi-clock"></i> ${getSchedule(i)}
                    </p>
                    <p class="text-muted small">
                        <i class="bi bi-building"></i> Room ${101 + i}
                    </p>
                    <div class="mt-2">
                        <span class="badge bg-secondary">${studentCourse}</span>
                        <span class="badge bg-info ms-1">${studentYear}</span>
                    </div>
                </div>
            </div>
            `;
        });

        container.innerHTML = `
            <div class="header bg-primary text-white p-4 rounded-3 mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h3><i class="bi bi-person-circle"></i> Welcome ${user.name}</h3>
                        <p class="mb-1 mt-2"><i class="bi bi-mortarboard"></i> <b>Course:</b> ${studentCourse}</p>
                        <p class="mb-0"><i class="bi bi-calendar"></i> <b>Year Level:</b> ${studentYear}</p>
                    </div>
                    <div><i class="bi bi-robot display-4"></i></div>
                </div>
            </div>
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card p-3 text-center">
                        <i class="bi bi-journal-bookmark-fill display-6 text-primary"></i>
                        <h5 class="mt-2">Total Subjects</h5>
                        <h2 class="text-primary">${subjects.length}</h2>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 text-center">
                        <i class="bi bi-clock-history display-6 text-success"></i>
                        <h5 class="mt-2">Schedule Time</h5>
                        <p class="mb-0 fw-bold">8:00 AM - 7:00 PM</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 text-center">
                        <i class="bi bi-check-circle-fill display-6 text-success"></i>
                        <h5 class="mt-2">Status</h5>
                        <span class="badge bg-success fs-6">Active Student</span>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4><i class="bi bi-book"></i> Your Subjects</h4>
                <div class="dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" id="yearDropdownBtn">
                        ${studentYear}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item year-option" data-year="1st Year">1st Year</a></li>
                        <li><a class="dropdown-item year-option" data-year="2nd Year">2nd Year</a></li>
                        <li><a class="dropdown-item year-option" data-year="3rd Year">3rd Year</a></li>
                        <li><a class="dropdown-item year-option" data-year="4th Year">4th Year</a></li>
                    </ul>
                </div>
            </div>
            <div class="row g-3" id="subjectContainer">${subjectsHtml}</div>
        `;

        // Year dropdown handler
        document.querySelectorAll('.year-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const newYear = this.dataset.year;
                localStorage.setItem('student_selected_year', newYear);
                loadStudentDashboard();
            });
        });
    }

    // ========== MY ENROLLMENTS PAGE ==========
    function loadMyEnrollments() {
        const tbody = document.getElementById('enrollmentsTable');
        if (!tbody) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        const records = getRecords();
        const myRecords = records.filter(r => r.email === user.email);
        
        if (myRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No enrollments found. <a href="data-entry.html">Enroll now</a></td></tr>';
            return;
        }

        tbody.innerHTML = myRecords.map((r, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${r.course}</td>
                <td>${r.date || 'N/A'}</td>
                <td><span class="badge bg-${r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}">${r.status}</span></td>
                <td><button class="btn btn-sm btn-danger cancel-enrollment" data-email="${r.email}" data-course="${r.course}">Cancel</button></td>
            </tr>
        `).join('');

        // Cancel enrollment
        document.querySelectorAll('.cancel-enrollment').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Cancel this enrollment?')) {
                    const records = getRecords();
                    const updatedRecords = records.filter(r => !(r.email === this.dataset.email && r.course === this.dataset.course));
                    saveRecords(updatedRecords);
                    loadMyEnrollments();
                    alert('✅ Enrollment cancelled.');
                }
            });
        });
    }

    // ========== PROFILE PAGE ==========
    function loadProfile() {
        const nameField = document.getElementById('profileName');
        const emailField = document.getElementById('profileEmail');
        
        if (!nameField) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        const students = getStudents();
        const student = students.find(s => s.email === user.email);
        
        if (student) {
            nameField.value = student.name;
            emailField.value = student.email;
        }

        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const newName = document.getElementById('profileName').value.trim();
                const newPassword = document.getElementById('profileNewPassword').value;
                const confirmPassword = document.getElementById('profileConfirmPassword').value;

                if (newPassword && newPassword !== confirmPassword) {
                    alert('❌ Passwords do not match.');
                    return;
                }

                const students = getStudents();
                const studentIndex = students.findIndex(s => s.email === user.email);
                if (studentIndex !== -1) {
                    students[studentIndex].name = newName;
                    if (newPassword) {
                        students[studentIndex].password = newPassword;
                    }
                    saveStudents(students);
                    
                    user.name = newName;
                    localStorage.setItem('lms_logged_in_user', JSON.stringify(user));
                    
                    alert('✅ Profile updated successfully!');
                    window.location.reload();
                }
            });
        }
    }

    // ========== GRADES PAGE ==========
    function loadGrades() {
        const gradesTable = document.getElementById('gradesTable');
        const gwaSpan = document.getElementById('gwa');
        const totalUnitsSpan = document.getElementById('totalUnits');
        const passedSpan = document.getElementById('passedCount');
        const failedSpan = document.getElementById('failedCount');
        
        if (!gradesTable) return;

        const loggedInUser = localStorage.getItem('lms_logged_in_user');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(loggedInUser);
        const allGrades = getGrades();
        const myGrades = allGrades.filter(g => g.studentEmail === user.email || g.studentEmail === "student@example.com");
        
        if (myGrades.length === 0) {
            gradesTable.innerHTML = '<tr><td colspan="7" class="text-center">No grades available yet. </td></tr>';
            return;
        }

        let totalAvg = 0;
        let totalUnits = 0;
        let passed = 0;
        let failed = 0;

        gradesTable.innerHTML = myGrades.map(g => {
            const avg = (g.prelim + g.midterm + g.final) / 3;
            totalAvg += avg;
            totalUnits += g.units || 3;
            if (avg >= 75) {
                passed++;
            } else {
                failed++;
            }
            
            let gradeLetter = '';
            let gradeClass = '';
            if (avg >= 90) { gradeLetter = 'A'; gradeClass = 'bg-success text-white'; }
            else if (avg >= 80) { gradeLetter = 'B'; gradeClass = 'bg-info text-white'; }
            else if (avg >= 75) { gradeLetter = 'C'; gradeClass = 'bg-warning'; }
            else { gradeLetter = 'D'; gradeClass = 'bg-danger text-white'; }
            
            return `
                <tr>
                    <td>${g.subject}</td>
                    <td>${g.prelim}</td>
                    <td>${g.midterm}</td>
                    <td>${g.final}</td>
                    <td><strong>${avg.toFixed(2)}</strong></td>
                    <td class="text-center"><span class="badge ${gradeClass}">${gradeLetter}</span></td>
                    <td>${avg >= 75 ? '✅ Passed' : '❌ Failed'}</td>
                </tr>
            `;
        }).join('');

        const gwa = totalAvg / myGrades.length;
        if (gwaSpan) gwaSpan.textContent = gwa.toFixed(2);
        if (totalUnitsSpan) totalUnitsSpan.textContent = totalUnits;
        if (passedSpan) passedSpan.textContent = passed;
        if (failedSpan) failedSpan.textContent = failed;
    }

    // ========== COURSES PAGE ==========
    function loadCourses() {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        const courseList = [
            { code: "BSIT", name: "BS Information Technology", duration: "4 years", description: "Learn programming, networking, and database management.", slots: 45 },
            { code: "BSBA", name: "BS Business Administration", duration: "4 years", description: "Develop management, marketing, and financial skills.", slots: 50 },
            { code: "BEED", name: "Bachelor of Elementary Education", duration: "4 years", description: "Become a professional elementary teacher.", slots: 40 },
            { code: "BSPSY", name: "BS Psychology", duration: "4 years", description: "Study human behavior and mental processes.", slots: 45 },
            { code: "BSA", name: "BS Accountancy", duration: "4 years", description: "Master accounting, auditing, and taxation.", slots: 40 },
            { code: "BSHM", name: "BS Hospitality Management", duration: "4 years", description: "Learn hotel and restaurant management.", slots: 50 }
        ];

        container.innerHTML = courseList.map(c => `
            <div class="col-md-6 col-lg-4">
                <div class="card course-card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title text-primary">${c.name}</h5>
                            <span class="badge bg-primary">${c.code}</span>
                        </div>
                        <p class="card-text mt-2">${c.description}</p>
                        <p class="text-muted small"><i class="bi bi-clock"></i> ${c.duration}</p>
                        <p class="text-muted small"><i class="bi bi-people"></i> ${c.slots} slots available</p>
                        <a href="login.html" class="btn btn-outline-primary w-100">Enroll Now</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ========== LOGOUT ==========
    function handleLogout(e) {
        if (e) e.preventDefault();
        localStorage.removeItem('lms_admin_logged_in');
        localStorage.removeItem('lms_logged_in_user');
        localStorage.removeItem('student_selected_year');
        alert('✅ Logged out!');
        window.location.href = 'index.html';
    }

    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnRecords');
    logoutBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', handleLogout);
    });

    // ========== INITIALIZE ALL PAGES ==========
    loadAdminDashboard();
    loadAdminRecords();
    loadStudentDashboard();
    loadMyEnrollments();
    loadProfile();
    loadGrades();
    loadCourses();
});