// API Base URL - Update this to your backend URL
const API_BASE = 'backend/api.php';

// Grade constants
const GRADE_MIN = 1.0;
const GRADE_MAX = 5.0;
const GRADE_TYPES = ['Exam', 'Homework', 'Project', 'Quiz', 'Lab', 'Essay', 'Presentation'];

// Global state
let currentSection = 'departments';
let departments = [];
let instructors = [];
let students = [];
let courses = [];
let enrollments = [];
let grades = [];
let departmentHeads = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadAllData();
});

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });
}

// Switch between sections
function switchSection(section) {
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        }
    });

    // Update active content section
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    currentSection = section;
    loadSectionData(section);
}

// Load all data
async function loadAllData() {
    await Promise.all([
        loadDepartments(),
        loadInstructors(),
        loadStudents(),
        loadCourses(),
        loadEnrollments(),
        loadGrades(),
        loadDepartmentHeads()
    ]);
    renderCurrentSection();
}

// Load section data
async function loadSectionData(section) {
    switch(section) {
        case 'departments':
            await loadDepartments();
            renderDepartments();
            break;
        case 'instructors':
            await loadInstructors();
            renderInstructors();
            break;
        case 'students':
            await loadStudents();
            renderStudents();
            break;
        case 'courses':
            await loadCourses();
            renderCourses();
            break;
        case 'enrollments':
            await loadEnrollments();
            renderEnrollments();
            break;
        case 'grades':
            await loadGrades();
            renderGrades();
            break;
        case 'department-heads':
            await loadDepartmentHeads();
            renderDepartmentHeads();
            break;
    }
}

// Render current section
function renderCurrentSection() {
    loadSectionData(currentSection);
}

// API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}?request=${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showAlert('Error: ' + error.message, 'error');
        throw error;
    }
}

// Load functions
async function loadDepartments() {
    departments = await apiCall('departments');
}

async function loadInstructors() {
    instructors = await apiCall('instructors');
}

async function loadStudents() {
    students = await apiCall('students');
}

async function loadCourses() {
    courses = await apiCall('courses');
}

async function loadEnrollments() {
    enrollments = await apiCall('enrollments');
}

async function loadGrades() {
    grades = await apiCall('grades');
}

async function loadDepartmentHeads() {
    departmentHeads = await apiCall('department-heads');
}

// Render functions
function renderDepartments() {
    const container = document.getElementById('departments-list');
    
    if (departments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏢</div>
                <div class="empty-state-text">No departments found. Add your first department!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = departments.map(dept => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${dept.department_name}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editDepartment(${dept.department_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteDepartment(${dept.department_id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Building</div>
                    <div class="field-value">${dept.building || 'N/A'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Budget</div>
                    <div class="field-value">$${dept.budget ? parseFloat(dept.budget).toLocaleString() : '0'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderInstructors() {
    const container = document.getElementById('instructors-list');
    
    if (instructors.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👨‍🏫</div>
                <div class="empty-state-text">No instructors found. Add your first instructor!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = instructors.map(instructor => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${instructor.first_name} ${instructor.last_name}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editInstructor(${instructor.instructor_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteInstructor(${instructor.instructor_id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Email</div>
                    <div class="field-value">${instructor.email}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">${instructor.phone || 'N/A'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Department</div>
                    <div class="field-value">${instructor.department_name || 'N/A'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Salary</div>
                    <div class="field-value">$${instructor.salary ? parseFloat(instructor.salary).toLocaleString() : 'N/A'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStudents() {
    const container = document.getElementById('students-list');
    
    if (students.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎓</div>
                <div class="empty-state-text">No students found. Add your first student!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = students.map(student => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${student.first_name} ${student.last_name}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editStudent(${student.student_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteStudent(${student.student_id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Email</div>
                    <div class="field-value">${student.email}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">${student.phone || 'N/A'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Major</div>
                    <div class="field-value">${student.major_name || 'Undeclared'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">GPA (Calculated)</div>
                    <div class="field-value">${student.gpa ? parseFloat(student.gpa).toFixed(2) : 'No grades yet'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Enrollment Year</div>
                    <div class="field-value">${student.enrollment_year || 'N/A'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCourses() {
    const container = document.getElementById('courses-list');
    
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <div class="empty-state-text">No courses found. Add your first course!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = courses.map(course => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${course.course_code} - ${course.course_name}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editCourse(${course.course_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteCourse(${course.course_id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Department</div>
                    <div class="field-value">${course.department_name || 'N/A'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Instructor</div>
                    <div class="field-value">${course.instructor_name || 'Not assigned'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Credits</div>
                    <div class="field-value">${course.credits}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Semester</div>
                    <div class="field-value">${course.semester || 'N/A'} ${course.year || ''}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Room</div>
                    <div class="field-value">${course.room_number || 'N/A'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Schedule</div>
                    <div class="field-value">${course.schedule || 'N/A'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderEnrollments() {
    const container = document.getElementById('enrollments-list');
    
    if (enrollments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">No enrollments found. Add your first enrollment!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = enrollments.map(enrollment => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${enrollment.student_name} - ${enrollment.course_code}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editEnrollment(${enrollment.enrollment_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteEnrollment(${enrollment.enrollment_id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Course</div>
                    <div class="field-value">${enrollment.course_name}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Enrollment Date</div>
                    <div class="field-value">${enrollment.enrollment_date}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Grade</div>
                    <div class="field-value">${enrollment.grade || 'Not graded'}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Status</div>
                    <div class="field-value">${enrollment.status}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderGrades() {
    const container = document.getElementById('grades-list');
    
    if (grades.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <div class="empty-state-text">No grades found. Add your first grade!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = grades.map(grade => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${grade.student_name} - ${grade.course_code}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editGrade(${grade.grade_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteGrade(${grade.grade_id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Course</div>
                    <div class="field-value">${grade.course_name}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Grade Value</div>
                    <div class="field-value">${grade.grade_value}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Grade Type</div>
                    <div class="field-value">${grade.grade_type}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Date</div>
                    <div class="field-value">${grade.grade_date}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Description</div>
                    <div class="field-value">${grade.description || 'N/A'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDepartmentHeads() {
    const container = document.getElementById('department-heads-list');
    
    if (departmentHeads.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👔</div>
                <div class="empty-state-text">No department heads assigned. Assign your first department head!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = departmentHeads.map(head => `
        <div class="data-card">
            <div class="card-header">
                <div class="card-title">${head.department_name}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editDepartmentHead(${head.department_id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteDepartmentHead(${head.department_id})">Remove</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="field-label">Department Head</div>
                    <div class="field-value">${head.head_name}</div>
                </div>
                <div class="card-field">
                    <div class="field-label">Start Date</div>
                    <div class="field-value">${head.start_date}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal functions
function showModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Alert function
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.content-section.active');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// Department functions
function showAddDepartmentForm() {
    const form = `
        <h2>Add Department</h2>
        <form onsubmit="submitDepartment(event)">
            <div class="form-group">
                <label>Department Name*</label>
                <input type="text" name="department_name" required>
            </div>
            <div class="form-group">
                <label>Building</label>
                <input type="text" name="building">
            </div>
            <div class="form-group">
                <label>Budget</label>
                <input type="number" step="0.01" name="budget">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Department</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitDepartment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('departments', 'POST', data);
        closeModal();
        await loadDepartments();
        renderDepartments();
        showAlert('Department added successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editDepartment(id) {
    const dept = departments.find(d => d.department_id == id);
    if (!dept) return;
    
    const form = `
        <h2>Edit Department</h2>
        <form onsubmit="updateDepartment(event, ${id})">
            <div class="form-group">
                <label>Department Name*</label>
                <input type="text" name="department_name" value="${dept.department_name}" required>
            </div>
            <div class="form-group">
                <label>Building</label>
                <input type="text" name="building" value="${dept.building || ''}">
            </div>
            <div class="form-group">
                <label>Budget</label>
                <input type="number" step="0.01" name="budget" value="${dept.budget || ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Department</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateDepartment(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`departments/${id}`, 'PUT', data);
        closeModal();
        await loadDepartments();
        renderDepartments();
        showAlert('Department updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
        await apiCall(`departments/${id}`, 'DELETE');
        await loadDepartments();
        renderDepartments();
        showAlert('Department deleted successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Similar functions for other entities would go here
// For brevity, I'll add simplified versions

function showAddInstructorForm() {
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}">${d.department_name}</option>`
    ).join('');
    
    const form = `
        <h2>Add Instructor</h2>
        <form onsubmit="submitInstructor(event)">
            <div class="form-group">
                <label>First Name*</label>
                <input type="text" name="first_name" required>
            </div>
            <div class="form-group">
                <label>Last Name*</label>
                <input type="text" name="last_name" required>
            </div>
            <div class="form-group">
                <label>Email*</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone">
            </div>
            <div class="form-group">
                <label>Department*</label>
                <select name="department_id" required>
                    <option value="">Select Department</option>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Salary</label>
                <input type="number" step="0.01" name="salary">
            </div>
            <div class="form-group">
                <label>Hire Date</label>
                <input type="date" name="hire_date">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Instructor</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitInstructor(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('instructors', 'POST', data);
        closeModal();
        await loadInstructors();
        renderInstructors();
        showAlert('Instructor added successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editInstructor(id) {
    const instructor = instructors.find(i => i.instructor_id == id);
    if (!instructor) return;
    
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}" ${d.department_id == instructor.department_id ? 'selected' : ''}>${d.department_name}</option>`
    ).join('');
    
    const form = `
        <h2>Edit Instructor</h2>
        <form onsubmit="updateInstructor(event, ${id})">
            <div class="form-group">
                <label>First Name*</label>
                <input type="text" name="first_name" value="${instructor.first_name}" required>
            </div>
            <div class="form-group">
                <label>Last Name*</label>
                <input type="text" name="last_name" value="${instructor.last_name}" required>
            </div>
            <div class="form-group">
                <label>Email*</label>
                <input type="email" name="email" value="${instructor.email}" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value="${instructor.phone || ''}">
            </div>
            <div class="form-group">
                <label>Department*</label>
                <select name="department_id" required>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Salary</label>
                <input type="number" step="0.01" name="salary" value="${instructor.salary || ''}">
            </div>
            <div class="form-group">
                <label>Hire Date</label>
                <input type="date" name="hire_date" value="${instructor.hire_date || ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Instructor</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateInstructor(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`instructors/${id}`, 'PUT', data);
        closeModal();
        await loadInstructors();
        renderInstructors();
        showAlert('Instructor updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteInstructor(id) {
    if (!confirm('Are you sure you want to delete this instructor?')) return;
    
    try {
        await apiCall(`instructors/${id}`, 'DELETE');
        await loadInstructors();
        renderInstructors();
        showAlert('Instructor deleted successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Student functions
function showAddStudentForm() {
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}">${d.department_name}</option>`
    ).join('');
    
    const form = `
        <h2>Add Student</h2>
        <form onsubmit="submitStudent(event)">
            <div class="form-group">
                <label>First Name*</label>
                <input type="text" name="first_name" required>
            </div>
            <div class="form-group">
                <label>Last Name*</label>
                <input type="text" name="last_name" required>
            </div>
            <div class="form-group">
                <label>Email*</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone">
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth">
            </div>
            <div class="form-group">
                <label>Enrollment Year</label>
                <input type="number" name="enrollment_year" min="2000" max="2030">
            </div>
            <div class="form-group">
                <label>Major Department</label>
                <select name="major_department_id">
                    <option value="">Select Department</option>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Student</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitStudent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('students', 'POST', data);
        closeModal();
        await loadStudents();
        renderStudents();
        showAlert('Student added successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editStudent(id) {
    const student = students.find(s => s.student_id == id);
    if (!student) return;
    
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}" ${d.department_id == student.major_department_id ? 'selected' : ''}>${d.department_name}</option>`
    ).join('');
    
    const form = `
        <h2>Edit Student</h2>
        <form onsubmit="updateStudent(event, ${id})">
            <div class="form-group">
                <label>First Name*</label>
                <input type="text" name="first_name" value="${student.first_name}" required>
            </div>
            <div class="form-group">
                <label>Last Name*</label>
                <input type="text" name="last_name" value="${student.last_name}" required>
            </div>
            <div class="form-group">
                <label>Email*</label>
                <input type="email" name="email" value="${student.email}" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value="${student.phone || ''}">
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" value="${student.date_of_birth || ''}">
            </div>
            <div class="form-group">
                <label>Enrollment Year</label>
                <input type="number" name="enrollment_year" value="${student.enrollment_year || ''}" min="2000" max="2030">
            </div>
            <div class="form-group">
                <label>Major Department</label>
                <select name="major_department_id">
                    <option value="">Select Department</option>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Student</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateStudent(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`students/${id}`, 'PUT', data);
        closeModal();
        await loadStudents();
        renderStudents();
        showAlert('Student updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        await apiCall(`students/${id}`, 'DELETE');
        await loadStudents();
        renderStudents();
        showAlert('Student deleted successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Course functions
function showAddCourseForm() {
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}">${d.department_name}</option>`
    ).join('');
    
    const instructorOptions = instructors.map(i => 
        `<option value="${i.instructor_id}">${i.first_name} ${i.last_name}</option>`
    ).join('');
    
    const form = `
        <h2>Add Course</h2>
        <form onsubmit="submitCourse(event)">
            <div class="form-group">
                <label>Course Code*</label>
                <input type="text" name="course_code" required>
            </div>
            <div class="form-group">
                <label>Course Name*</label>
                <input type="text" name="course_name" required>
            </div>
            <div class="form-group">
                <label>Department*</label>
                <select name="department_id" required>
                    <option value="">Select Department</option>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Instructor</label>
                <select name="instructor_id">
                    <option value="">Select Instructor</option>
                    ${instructorOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Credits*</label>
                <input type="number" name="credits" value="3" min="1" max="6" required>
            </div>
            <div class="form-group">
                <label>Semester</label>
                <select name="semester">
                    <option value="">Select Semester</option>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                </select>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="number" name="year" min="2020" max="2030">
            </div>
            <div class="form-group">
                <label>Room Number</label>
                <input type="text" name="room_number">
            </div>
            <div class="form-group">
                <label>Schedule</label>
                <input type="text" name="schedule" placeholder="e.g., Mon/Wed 9:00-10:30">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Course</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitCourse(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('courses', 'POST', data);
        closeModal();
        await loadCourses();
        renderCourses();
        showAlert('Course added successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editCourse(id) {
    const course = courses.find(c => c.course_id == id);
    if (!course) return;
    
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}" ${d.department_id == course.department_id ? 'selected' : ''}>${d.department_name}</option>`
    ).join('');
    
    const instructorOptions = instructors.map(i => 
        `<option value="${i.instructor_id}" ${i.instructor_id == course.instructor_id ? 'selected' : ''}>${i.first_name} ${i.last_name}</option>`
    ).join('');
    
    const form = `
        <h2>Edit Course</h2>
        <form onsubmit="updateCourse(event, ${id})">
            <div class="form-group">
                <label>Course Code*</label>
                <input type="text" name="course_code" value="${course.course_code}" required>
            </div>
            <div class="form-group">
                <label>Course Name*</label>
                <input type="text" name="course_name" value="${course.course_name}" required>
            </div>
            <div class="form-group">
                <label>Department*</label>
                <select name="department_id" required>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Instructor</label>
                <select name="instructor_id">
                    <option value="">Select Instructor</option>
                    ${instructorOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Credits*</label>
                <input type="number" name="credits" value="${course.credits}" min="1" max="6" required>
            </div>
            <div class="form-group">
                <label>Semester</label>
                <select name="semester">
                    <option value="">Select Semester</option>
                    <option value="Fall" ${course.semester === 'Fall' ? 'selected' : ''}>Fall</option>
                    <option value="Spring" ${course.semester === 'Spring' ? 'selected' : ''}>Spring</option>
                    <option value="Summer" ${course.semester === 'Summer' ? 'selected' : ''}>Summer</option>
                </select>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="number" name="year" value="${course.year || ''}" min="2020" max="2030">
            </div>
            <div class="form-group">
                <label>Room Number</label>
                <input type="text" name="room_number" value="${course.room_number || ''}">
            </div>
            <div class="form-group">
                <label>Schedule</label>
                <input type="text" name="schedule" value="${course.schedule || ''}" placeholder="e.g., Mon/Wed 9:00-10:30">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Course</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateCourse(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`courses/${id}`, 'PUT', data);
        closeModal();
        await loadCourses();
        renderCourses();
        showAlert('Course updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
        await apiCall(`courses/${id}`, 'DELETE');
        await loadCourses();
        renderCourses();
        showAlert('Course deleted successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Enrollment functions
function showAddEnrollmentForm() {
    const studentOptions = students.map(s => 
        `<option value="${s.student_id}">${s.first_name} ${s.last_name}</option>`
    ).join('');
    
    const courseOptions = courses.map(c => 
        `<option value="${c.course_id}">${c.course_code} - ${c.course_name}</option>`
    ).join('');
    
    const form = `
        <h2>Add Enrollment</h2>
        <form onsubmit="submitEnrollment(event)">
            <div class="form-group">
                <label>Student*</label>
                <select name="student_id" required>
                    <option value="">Select Student</option>
                    ${studentOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Course*</label>
                <select name="course_id" required>
                    <option value="">Select Course</option>
                    ${courseOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Enrollment Date*</label>
                <input type="date" name="enrollment_date" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>Grade</label>
                <input type="text" name="grade" maxlength="2" placeholder="e.g., A, B+">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status">
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Enrollment</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitEnrollment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('enrollments', 'POST', data);
        closeModal();
        await loadEnrollments();
        renderEnrollments();
        showAlert('Enrollment added successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editEnrollment(id) {
    const enrollment = enrollments.find(e => e.enrollment_id == id);
    if (!enrollment) return;
    
    const studentOptions = students.map(s => 
        `<option value="${s.student_id}" ${s.student_id == enrollment.student_id ? 'selected' : ''}>${s.first_name} ${s.last_name}</option>`
    ).join('');
    
    const courseOptions = courses.map(c => 
        `<option value="${c.course_id}" ${c.course_id == enrollment.course_id ? 'selected' : ''}>${c.course_code} - ${c.course_name}</option>`
    ).join('');
    
    const form = `
        <h2>Edit Enrollment</h2>
        <form onsubmit="updateEnrollment(event, ${id})">
            <div class="form-group">
                <label>Student*</label>
                <select name="student_id" required>
                    ${studentOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Course*</label>
                <select name="course_id" required>
                    ${courseOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Enrollment Date*</label>
                <input type="date" name="enrollment_date" value="${enrollment.enrollment_date}" required>
            </div>
            <div class="form-group">
                <label>Grade</label>
                <input type="text" name="grade" value="${enrollment.grade || ''}" maxlength="2">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status">
                    <option value="Active" ${enrollment.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Completed" ${enrollment.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Dropped" ${enrollment.status === 'Dropped' ? 'selected' : ''}>Dropped</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Enrollment</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateEnrollment(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`enrollments/${id}`, 'PUT', data);
        closeModal();
        await loadEnrollments();
        renderEnrollments();
        showAlert('Enrollment updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteEnrollment(id) {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    
    try {
        await apiCall(`enrollments/${id}`, 'DELETE');
        await loadEnrollments();
        renderEnrollments();
        showAlert('Enrollment deleted successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Department Head functions
function showAddDepartmentHeadForm() {
    const deptOptions = departments.map(d => 
        `<option value="${d.department_id}">${d.department_name}</option>`
    ).join('');
    
    const instructorOptions = instructors.map(i => 
        `<option value="${i.instructor_id}">${i.first_name} ${i.last_name}</option>`
    ).join('');
    
    const form = `
        <h2>Assign Department Head</h2>
        <form onsubmit="submitDepartmentHead(event)">
            <div class="form-group">
                <label>Department*</label>
                <select name="department_id" required>
                    <option value="">Select Department</option>
                    ${deptOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Instructor*</label>
                <select name="instructor_id" required>
                    <option value="">Select Instructor</option>
                    ${instructorOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Start Date*</label>
                <input type="date" name="start_date" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Assign Head</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitDepartmentHead(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('department-heads', 'POST', data);
        closeModal();
        await loadDepartmentHeads();
        renderDepartmentHeads();
        showAlert('Department head assigned successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editDepartmentHead(id) {
    const head = departmentHeads.find(h => h.department_id == id);
    if (!head) return;
    
    const instructorOptions = instructors.map(i => 
        `<option value="${i.instructor_id}" ${i.instructor_id == head.instructor_id ? 'selected' : ''}>${i.first_name} ${i.last_name}</option>`
    ).join('');
    
    const form = `
        <h2>Edit Department Head</h2>
        <form onsubmit="updateDepartmentHead(event, ${id})">
            <div class="form-group">
                <label>Department</label>
                <input type="text" value="${head.department_name}" readonly>
            </div>
            <div class="form-group">
                <label>Instructor*</label>
                <select name="instructor_id" required>
                    ${instructorOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Start Date*</label>
                <input type="date" name="start_date" value="${head.start_date}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Head</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateDepartmentHead(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`department-heads/${id}`, 'PUT', data);
        closeModal();
        await loadDepartmentHeads();
        renderDepartmentHeads();
        showAlert('Department head updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteDepartmentHead(id) {
    if (!confirm('Are you sure you want to remove this department head?')) return;
    
    try {
        await apiCall(`department-heads/${id}`, 'DELETE');
        await loadDepartmentHeads();
        renderDepartmentHeads();
        showAlert('Department head removed successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Grade functions
function showAddGradeForm() {
    const enrollmentOptions = enrollments.map(e => 
        `<option value="${e.enrollment_id}">${e.student_name} - ${e.course_code} (${e.course_name})</option>`
    ).join('');
    
    const gradeTypeOptions = GRADE_TYPES.map(type => 
        `<option value="${type}">${type}</option>`
    ).join('');
    
    const form = `
        <h2>Add Grade</h2>
        <form onsubmit="submitGrade(event)">
            <div class="form-group">
                <label>Enrollment*</label>
                <select name="enrollment_id" required>
                    <option value="">Select Enrollment</option>
                    ${enrollmentOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Grade Value* (${GRADE_MIN} - ${GRADE_MAX})</label>
                <input type="number" step="0.01" min="${GRADE_MIN}" max="${GRADE_MAX}" name="grade_value" required>
            </div>
            <div class="form-group">
                <label>Grade Type</label>
                <select name="grade_type">
                    ${gradeTypeOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Date*</label>
                <input type="date" name="grade_date" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="description" placeholder="e.g., Midterm exam">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Grade</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function submitGrade(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall('grades', 'POST', data);
        closeModal();
        await loadGrades();
        renderGrades();
        showAlert('Grade added successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function editGrade(id) {
    const grade = grades.find(g => g.grade_id == id);
    if (!grade) return;
    
    const enrollmentOptions = enrollments.map(e => 
        `<option value="${e.enrollment_id}" ${e.enrollment_id == grade.enrollment_id ? 'selected' : ''}>${e.student_name} - ${e.course_code} (${e.course_name})</option>`
    ).join('');
    
    const gradeTypeOptions = GRADE_TYPES.map(type => 
        `<option value="${type}" ${type === grade.grade_type ? 'selected' : ''}>${type}</option>`
    ).join('');
    
    const form = `
        <h2>Edit Grade</h2>
        <form onsubmit="updateGrade(event, ${id})">
            <div class="form-group">
                <label>Enrollment*</label>
                <select name="enrollment_id" required>
                    ${enrollmentOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Grade Value* (${GRADE_MIN} - ${GRADE_MAX})</label>
                <input type="number" step="0.01" min="${GRADE_MIN}" max="${GRADE_MAX}" name="grade_value" value="${grade.grade_value}" required>
            </div>
            <div class="form-group">
                <label>Grade Type</label>
                <select name="grade_type">
                    ${gradeTypeOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Date*</label>
                <input type="date" name="grade_date" value="${grade.grade_date}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="description" value="${grade.description || ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Grade</button>
            </div>
        </form>
    `;
    showModal(form);
}

async function updateGrade(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiCall(`grades/${id}`, 'PUT', data);
        closeModal();
        await loadGrades();
        renderGrades();
        showAlert('Grade updated successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}

async function deleteGrade(id) {
    if (!confirm('Are you sure you want to delete this grade?')) return;
    
    try {
        await apiCall(`grades/${id}`, 'DELETE');
        await loadGrades();
        renderGrades();
        showAlert('Grade deleted successfully!', 'success');
    } catch (error) {
        // Error already shown by apiCall
    }
}
