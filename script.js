// ======================== ADMIN CREDENTIALS ========================
const ADMIN_EMAIL = "duladagn25@gmail.com";
const ADMIN_PASSWORD = "admin123"; // You can change this password

// ======================== ETHIOPIAN REGIONS & CITIES DATA ========================
const ethiopianRegions = {
    "Addis Ababa": ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    "Afar": ["Semera", "Asayita", "Awash", "Dubti", "Mille", "Chifra"],
    "Amhara": ["Bahir Dar", "Gondar", "Dessie", "Debre Markos", "Debre Tabor", "Lalibela", "Woldia", "Kombolcha", "Bati", "Sekota"],
    "Benishangul-Gumuz": ["Asosa", "Metekel", "Assosa", "Kurmuk", "Dibate"],
    "Dire Dawa": ["Dire Dawa City", "Gende Kore", "Melka Jebdu", "Haramaya Area"],
    "Gambela": ["Gambela", "Itang", "Akobo", "Gog", "Jor"],
    "Harari": ["Harar", "Jugol", "Aboker", "Dire Teyara"],
    "Oromia": ["Adama", "Jimma", "Bishoftu", "Ambo", "Shashamane", "Nekemte", "Bale Robe", "Assela", "Metehara", "Burayu", "Dembi Dolo", "Gimbi"],
    "Sidama": ["Hawassa", "Yirgalem", "Aleta Wondo", "Wendo Genet", "Bona", "Daye"],
    "Somali": ["Jijiga", "Dollo", "Gode", "Kebri Dahar", "Warder", "Degahbur"],
    "South West Ethiopia": ["Bonga", "Mizan Aman", "Tepi", "Bench Maji", "Kaffa"],
    "Tigray": ["Mekelle", "Adigrat", "Axum", "Shire", "Adwa", "Humera", "Wukro", "Maychew"],
    "Central Ethiopia": ["Hosaena", "Worabe", "Butajira", "Gubre", "Sodo"],
    "South Ethiopia": ["Arba Minch", "Jinka", "Konso", "Dilla", "Wolaita Sodo", "Boditi"]
};

// ======================== GLOBAL VARIABLES ========================
let students = [];
let adminEmail = "duladagn25@gmail.com";
let adminPhone = "0715806962";
let uploadedFiles = [];
let uploadedVideos = [];
let isLoggedIn = false;

// Load data from localStorage
function loadData() {
    const savedStudents = localStorage.getItem('students');
    const savedFiles = localStorage.getItem('uploadedFiles');
    const savedVideos = localStorage.getItem('uploadedVideos');
    
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    if (savedFiles) {
        uploadedFiles = JSON.parse(savedFiles);
    }
    if (savedVideos) {
        uploadedVideos = JSON.parse(savedVideos);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
}

let currentPage = "dashboard";

// ======================== LOGIN FUNCTIONALITY ========================

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const loginError = document.getElementById('loginError');
            
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                isLoggedIn = true;
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('dashboardContainer').style.display = 'block';
                loadData();
                updateAdminEmailDisplay();
                initNavigation();
                renderCurrentPage();
                showNotification('Login successful! Welcome Admin', 'success');
            } else {
                loginError.style.display = 'block';
                loginError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Invalid email or password!';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }
        });
    }
}

function logout() {
    isLoggedIn = false;
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
    showNotification('Logged out successfully', 'success');
}

// ======================== HELPER FUNCTIONS ========================

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Get cities based on region
function getCitiesForRegion(region) {
    return ethiopianRegions[region] || ["Main City", "Town Center"];
}

// Populate city dropdown based on selected region
function populateCities(region, citySelectElem) {
    if (!citySelectElem) return;
    const cities = getCitiesForRegion(region);
    citySelectElem.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelectElem.appendChild(option);
    });
}

// Show notification message
function showNotification(msg, type = "success") {
    const notif = document.createElement('div');
    notif.className = `notification ${type === 'error' ? 'error' : ''}`;
    notif.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Update admin email display in top bar
function updateAdminEmailDisplay() {
    const span = document.getElementById("adminEmailDisplay");
    if (span) span.innerText = adminEmail;
}

// ======================== PAGE RENDERERS ========================

// Dashboard Page
function renderDashboard() {
    const total = students.length;
    const regionsCount = Object.keys(ethiopianRegions).length;
    const totalCities = Object.values(ethiopianRegions).flat().length;
    const recent = [...students].reverse().slice(0, 5);
    const totalFiles = uploadedFiles.length;
    const totalVideos = uploadedVideos.length;
    
    return `
        <div class="card">
            <h2><i class="fas fa-chalkboard-user"></i> እንኳን ደህና መጡ! Welcome Admin</h2>
            <p style="margin: 10px 0 20px;">You have full control over student registrations, Ethiopian regions/cities, and admin credentials.</p>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-user-graduate"></i>
                    <h3>${total}</h3>
                    <p>Total Students</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>${regionsCount}</h3>
                    <p>Ethiopian Regions</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-city"></i>
                    <h3>${totalCities}</h3>
                    <p>Cities Available</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-file-upload"></i>
                    <h3>${totalFiles}</h3>
                    <p>Uploaded Files</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-video"></i>
                    <h3>${totalVideos}</h3>
                    <p>Video Lessons</p>
                </div>
            </div>
            <h3>📌 የቅርብ ጊዜ ተማሪዎች | Recent Students</h3>
            ${total === 0 ? 
                '<p class="admin-email-box">No students registered yet. Use "Register Student" to add Ethiopian students.</p>' : 
                `<div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>City</th>
                                <th>Course</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recent.map(s => `
                                <tr>
                                    <td data-label="Full Name">${escapeHtml(s.fullName)}</td>
                                    <td data-label="Email">${escapeHtml(s.email)}</td>
                                    <td data-label="Phone">${escapeHtml(s.phone || 'N/A')}</td>
                                    <td data-label="Region">${escapeHtml(s.region)}</td>
                                    <td data-label="City">${escapeHtml(s.city)}</td>
                                    <td data-label="Course">${escapeHtml(s.course || 'Frontend Dev')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`
            }
            <div class="admin-email-box">
                <i class="fas fa-envelope"></i> <strong>Admin Email:</strong> ${adminEmail}<br>
                <i class="fas fa-phone"></i> <strong>Admin Phone:</strong> ${adminPhone}<br>
                <i class="fas fa-globe"></i> Ethiopia Education Hub
            </div>
        </div>
    `;
}

// Registration Page with Phone Number
function renderRegisterPage() {
    const regionOptions = Object.keys(ethiopianRegions).map(reg => `<option value="${reg}">${reg}</option>`).join('');
    return `
        <div class="card">
            <h2><i class="fas fa-address-card"></i> ተማሪ ምዝገባ | Student Registration (Ethiopia)</h2>
            <form id="studentRegForm">
                <div class="form-grid">
                    <div class="input-group">
                        <label>Full Name *</label>
                        <input type="text" id="fullName" placeholder="Biruk Alemu" required>
                    </div>
                    <div class="input-group">
                        <label>Email *</label>
                        <input type="email" id="email" placeholder="student@example.com" required>
                    </div>
                    <div class="input-group">
                        <label>Phone Number *</label>
                        <input type="tel" id="phone" placeholder="09xxxxxxxx" required>
                    </div>
                    <div class="input-group">
                        <label>Region (ክልል) *</label>
                        <select id="regionSelect" required>${regionOptions}</select>
                    </div>
                    <div class="input-group">
                        <label>City / Town *</label>
                        <select id="citySelect" required></select>
                    </div>
                    <div class="input-group">
                        <label>Course / Program</label>
                        <input type="text" id="course" placeholder="Frontend Development, Full Stack, UI/UX">
                    </div>
                </div>
                <button type="submit"><i class="fas fa-save"></i> Register Student</button>
            </form>
            <div id="regMessage"></div>
        </div>
    `;
}

// Student List Page with Phone Number
function renderStudentsList() {
    if (students.length === 0) {
        return `
            <div class="card">
                <h2><i class="fas fa-users-slash"></i> No Students</h2>
                <p>No registered students yet. Add using registration panel.</p>
            </div>
        `;
    }
    return `
        <div class="card">
            <h2><i class="fas fa-list"></i> ተማሪዎች ዝርዝር | All Students (${students.length})</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Region</th>
                            <th>City</th>
                            <th>Course</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map((s, idx) => `
                            <tr>
                                <td data-label="ID">${idx+1}</td>
                                <td data-label="Full Name">${escapeHtml(s.fullName)}</td>
                                <td data-label="Email">${escapeHtml(s.email)}</td>
                                <td data-label="Phone">${escapeHtml(s.phone || 'N/A')}</td>
                                <td data-label="Region">${escapeHtml(s.region)}</td>
                                <td data-label="City">${escapeHtml(s.city)}</td>
                                <td data-label="Course">${escapeHtml(s.course || 'Frontend Dev')}</td>
                                <td data-label="Action">
                                    <button class="delete-btn" data-idx="${idx}">
                                        <i class="fas fa-trash-alt"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="admin-email-box" style="margin-top: 15px;">
                <i class="fas fa-trash"></i> Click delete to remove any student (Admin only).
            </p>
        </div>
    `;
}

// Upload File Page (Documents & Images)
function renderUploadPage() {
    return `
        <div class="card">
            <h2><i class="fas fa-upload"></i> Upload Documents & Images</h2>
            <p>Upload study materials, assignments, notes, or any files for your students.</p>
            
            <div class="file-upload-area" id="fileUploadArea">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click or drag files here to upload (PDF, DOC, JPG, PNG, etc.)</p>
                <input type="file" id="fileInput" multiple style="display: none;">
            </div>
            
            <div id="uploadMessage"></div>
            
            <div class="uploaded-files" id="uploadedFilesList">
                <h3>📁 Uploaded Files (${uploadedFiles.length})</h3>
                ${uploadedFiles.length === 0 ? '<p>No files uploaded yet.</p>' : 
                    uploadedFiles.map((file, idx) => `
                        <div class="file-item">
                            <div>
                                <i class="fas ${file.type
