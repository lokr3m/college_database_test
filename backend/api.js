/**
 * API Handler for College Database
 * Handles all CRUD operations for different entities
 * Node.js/Express implementation
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dbConfig = require('./config.js');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
let pool;

async function initializePool() {
    pool = mysql.createPool(dbConfig);
    console.log('Database pool created');
}

// Initialize pool on startup
initializePool();

// Helper function to get connection
async function getConnection() {
    if (!pool) {
        await initializePool();
    }
    return pool;
}

// ============================================================================
// API ROUTES
// ============================================================================
// NOTE: The endpoint path '/backend/api.php' is intentionally used to maintain
// backward compatibility with the existing frontend (js/app.js) which expects
// this path. This allows the Node.js backend to be a drop-in replacement for
// the PHP backend without requiring frontend changes.
// ============================================================================

// GET - Retrieve records
app.get('/backend/api.php', async (req, res) => {
    const request = req.query.request;
    
    if (!request) {
        return res.status(404).json({ error: 'Invalid endpoint' });
    }
    
    const parts = request.split('/');
    const entity = parts[0];
    const id = parts[1] || null;
    
    try {
        const conn = await getConnection();
        
        switch (entity) {
            case 'departments':
                await handleGetDepartments(conn, id, res);
                break;
            case 'instructors':
                await handleGetInstructors(conn, id, res);
                break;
            case 'students':
                await handleGetStudents(conn, id, res);
                break;
            case 'courses':
                await handleGetCourses(conn, id, res);
                break;
            case 'enrollments':
                await handleGetEnrollments(conn, id, res);
                break;
            case 'grades':
                await handleGetGrades(conn, id, res);
                break;
            case 'department-heads':
                await handleGetDepartmentHeads(conn, id, res);
                break;
            default:
                res.status(404).json({ error: 'Invalid endpoint' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// POST - Create new records
app.post('/backend/api.php', async (req, res) => {
    const request = req.query.request;
    
    if (!request) {
        return res.status(404).json({ error: 'Invalid endpoint' });
    }
    
    const entity = request.split('/')[0];
    
    try {
        const conn = await getConnection();
        
        switch (entity) {
            case 'departments':
                await handleCreateDepartment(conn, req.body, res);
                break;
            case 'instructors':
                await handleCreateInstructor(conn, req.body, res);
                break;
            case 'students':
                await handleCreateStudent(conn, req.body, res);
                break;
            case 'courses':
                await handleCreateCourse(conn, req.body, res);
                break;
            case 'enrollments':
                await handleCreateEnrollment(conn, req.body, res);
                break;
            case 'grades':
                await handleCreateGrade(conn, req.body, res);
                break;
            case 'department-heads':
                await handleCreateDepartmentHead(conn, req.body, res);
                break;
            default:
                res.status(404).json({ error: 'Invalid endpoint' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// PUT - Update records
app.put('/backend/api.php', async (req, res) => {
    const request = req.query.request;
    
    if (!request) {
        return res.status(404).json({ error: 'Invalid endpoint' });
    }
    
    const parts = request.split('/');
    const entity = parts[0];
    const id = parts[1];
    
    if (!id) {
        return res.status(400).json({ error: 'ID is required for update' });
    }
    
    try {
        const conn = await getConnection();
        
        switch (entity) {
            case 'departments':
                await handleUpdateDepartment(conn, id, req.body, res);
                break;
            case 'instructors':
                await handleUpdateInstructor(conn, id, req.body, res);
                break;
            case 'students':
                await handleUpdateStudent(conn, id, req.body, res);
                break;
            case 'courses':
                await handleUpdateCourse(conn, id, req.body, res);
                break;
            case 'enrollments':
                await handleUpdateEnrollment(conn, id, req.body, res);
                break;
            case 'grades':
                await handleUpdateGrade(conn, id, req.body, res);
                break;
            case 'department-heads':
                await handleUpdateDepartmentHead(conn, id, req.body, res);
                break;
            default:
                res.status(404).json({ error: 'Invalid endpoint' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// DELETE - Remove records
app.delete('/backend/api.php', async (req, res) => {
    const request = req.query.request;
    
    if (!request) {
        return res.status(404).json({ error: 'Invalid endpoint' });
    }
    
    const parts = request.split('/');
    const entity = parts[0];
    const id = parts[1];
    
    if (!id) {
        return res.status(400).json({ error: 'ID is required for delete' });
    }
    
    try {
        const conn = await getConnection();
        
        switch (entity) {
            case 'departments':
                await handleDeleteDepartment(conn, id, res);
                break;
            case 'instructors':
                await handleDeleteInstructor(conn, id, res);
                break;
            case 'students':
                await handleDeleteStudent(conn, id, res);
                break;
            case 'courses':
                await handleDeleteCourse(conn, id, res);
                break;
            case 'enrollments':
                await handleDeleteEnrollment(conn, id, res);
                break;
            case 'grades':
                await handleDeleteGrade(conn, id, res);
                break;
            case 'department-heads':
                await handleDeleteDepartmentHead(conn, id, res);
                break;
            default:
                res.status(404).json({ error: 'Invalid endpoint' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Handle OPTIONS for CORS preflight
app.options('/backend/api.php', (req, res) => {
    res.status(200).end();
});

// ============================================================================
// DEPARTMENT HANDLERS
// ============================================================================

async function handleGetDepartments(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute('SELECT * FROM Departments WHERE department_id = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } else {
        const [rows] = await conn.execute('SELECT * FROM Departments ORDER BY department_name');
        res.json(rows);
    }
}

async function handleCreateDepartment(conn, data, res) {
    try {
        const [result] = await conn.execute(
            'INSERT INTO Departments (department_name, building, budget) VALUES (?, ?, ?)',
            [data.department_name, data.building || null, data.budget || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Department created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateDepartment(conn, id, data, res) {
    try {
        await conn.execute(
            'UPDATE Departments SET department_name = ?, building = ?, budget = ? WHERE department_id = ?',
            [data.department_name, data.building || null, data.budget || null, id]
        );
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteDepartment(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM Departments WHERE department_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// INSTRUCTOR HANDLERS
// ============================================================================

async function handleGetInstructors(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute(`
            SELECT i.*, d.department_name 
            FROM Instructors i 
            LEFT JOIN Departments d ON i.department_id = d.department_id 
            WHERE i.instructor_id = ?
        `, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Instructor not found' });
        }
    } else {
        const [rows] = await conn.execute(`
            SELECT i.*, d.department_name 
            FROM Instructors i 
            LEFT JOIN Departments d ON i.department_id = d.department_id 
            ORDER BY i.last_name, i.first_name
        `);
        res.json(rows);
    }
}

async function handleCreateInstructor(conn, data, res) {
    try {
        const [result] = await conn.execute(
            `INSERT INTO Instructors (first_name, last_name, email, phone, department_id, salary, hire_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.phone || null,
                data.department_id,
                data.salary || null,
                data.hire_date || null
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Instructor created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateInstructor(conn, id, data, res) {
    try {
        await conn.execute(
            `UPDATE Instructors 
             SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, salary = ?, hire_date = ? 
             WHERE instructor_id = ?`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.phone || null,
                data.department_id,
                data.salary || null,
                data.hire_date || null,
                id
            ]
        );
        res.json({ message: 'Instructor updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteInstructor(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM Instructors WHERE instructor_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Instructor not found' });
        }
        res.json({ message: 'Instructor deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// STUDENT HANDLERS
// ============================================================================

async function handleGetStudents(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute(`
            SELECT s.*, d.department_name as major_name,
                   (SELECT AVG(g.grade_value) 
                    FROM Grades g 
                    JOIN Enrollments e ON g.enrollment_id = e.enrollment_id 
                    WHERE e.student_id = s.student_id) as gpa
            FROM Students s 
            LEFT JOIN Departments d ON s.major_department_id = d.department_id 
            WHERE s.student_id = ?
        `, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } else {
        const [rows] = await conn.execute(`
            SELECT s.*, d.department_name as major_name,
                   (SELECT AVG(g.grade_value) 
                    FROM Grades g 
                    JOIN Enrollments e ON g.enrollment_id = e.enrollment_id 
                    WHERE e.student_id = s.student_id) as gpa
            FROM Students s 
            LEFT JOIN Departments d ON s.major_department_id = d.department_id 
            ORDER BY s.last_name, s.first_name
        `);
        res.json(rows);
    }
}

async function handleCreateStudent(conn, data, res) {
    try {
        const [result] = await conn.execute(
            `INSERT INTO Students (first_name, last_name, email, phone, date_of_birth, enrollment_year, major_department_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.phone || null,
                data.date_of_birth || null,
                data.enrollment_year || null,
                data.major_department_id || null
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Student created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateStudent(conn, id, data, res) {
    try {
        await conn.execute(
            `UPDATE Students 
             SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, enrollment_year = ?, major_department_id = ? 
             WHERE student_id = ?`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.phone || null,
                data.date_of_birth || null,
                data.enrollment_year || null,
                data.major_department_id || null,
                id
            ]
        );
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteStudent(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM Students WHERE student_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// COURSE HANDLERS
// ============================================================================

async function handleGetCourses(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute(`
            SELECT c.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as instructor_name
            FROM Courses c 
            LEFT JOIN Departments d ON c.department_id = d.department_id 
            LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
            WHERE c.course_id = ?
        `, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } else {
        const [rows] = await conn.execute(`
            SELECT c.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as instructor_name
            FROM Courses c 
            LEFT JOIN Departments d ON c.department_id = d.department_id 
            LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
            ORDER BY c.course_code
        `);
        res.json(rows);
    }
}

async function handleCreateCourse(conn, data, res) {
    try {
        const [result] = await conn.execute(
            `INSERT INTO Courses (course_code, course_name, department_id, instructor_id, credits, semester, year, room_number, schedule) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.course_code,
                data.course_name,
                data.department_id,
                data.instructor_id || null,
                data.credits || 3,
                data.semester || null,
                data.year || null,
                data.room_number || null,
                data.schedule || null
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Course created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateCourse(conn, id, data, res) {
    try {
        await conn.execute(
            `UPDATE Courses 
             SET course_code = ?, course_name = ?, department_id = ?, instructor_id = ?, credits = ?, semester = ?, year = ?, room_number = ?, schedule = ? 
             WHERE course_id = ?`,
            [
                data.course_code,
                data.course_name,
                data.department_id,
                data.instructor_id || null,
                data.credits || 3,
                data.semester || null,
                data.year || null,
                data.room_number || null,
                data.schedule || null,
                id
            ]
        );
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteCourse(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM Courses WHERE course_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// ENROLLMENT HANDLERS
// ============================================================================

async function handleGetEnrollments(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute(`
            SELECT e.*, 
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Enrollments e 
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            WHERE e.enrollment_id = ?
        `, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Enrollment not found' });
        }
    } else {
        const [rows] = await conn.execute(`
            SELECT e.*, 
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Enrollments e 
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            ORDER BY e.enrollment_date DESC
        `);
        res.json(rows);
    }
}

async function handleCreateEnrollment(conn, data, res) {
    try {
        const enrollmentDate = data.enrollment_date || new Date().toISOString().split('T')[0];
        const [result] = await conn.execute(
            `INSERT INTO Enrollments (student_id, course_id, enrollment_date, grade, status) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                data.student_id,
                data.course_id,
                enrollmentDate,
                data.grade || null,
                data.status || 'Active'
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Enrollment created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateEnrollment(conn, id, data, res) {
    try {
        await conn.execute(
            `UPDATE Enrollments 
             SET student_id = ?, course_id = ?, enrollment_date = ?, grade = ?, status = ? 
             WHERE enrollment_id = ?`,
            [
                data.student_id,
                data.course_id,
                data.enrollment_date,
                data.grade || null,
                data.status || 'Active',
                id
            ]
        );
        res.json({ message: 'Enrollment updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteEnrollment(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM Enrollments WHERE enrollment_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// DEPARTMENT HEAD HANDLERS
// ============================================================================

async function handleGetDepartmentHeads(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute(`
            SELECT dh.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as head_name
            FROM DepartmentHeads dh 
            LEFT JOIN Departments d ON dh.department_id = d.department_id 
            LEFT JOIN Instructors i ON dh.instructor_id = i.instructor_id
            WHERE dh.department_id = ?
        `, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Department head not found' });
        }
    } else {
        const [rows] = await conn.execute(`
            SELECT dh.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as head_name
            FROM DepartmentHeads dh 
            LEFT JOIN Departments d ON dh.department_id = d.department_id 
            LEFT JOIN Instructors i ON dh.instructor_id = i.instructor_id
            ORDER BY d.department_name
        `);
        res.json(rows);
    }
}

async function handleCreateDepartmentHead(conn, data, res) {
    try {
        const startDate = data.start_date || new Date().toISOString().split('T')[0];
        await conn.execute(
            `INSERT INTO DepartmentHeads (department_id, instructor_id, start_date) 
             VALUES (?, ?, ?)`,
            [data.department_id, data.instructor_id, startDate]
        );
        res.status(201).json({ message: 'Department head assigned successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateDepartmentHead(conn, id, data, res) {
    try {
        await conn.execute(
            `UPDATE DepartmentHeads 
             SET instructor_id = ?, start_date = ? 
             WHERE department_id = ?`,
            [data.instructor_id, data.start_date, id]
        );
        res.json({ message: 'Department head updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteDepartmentHead(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM DepartmentHeads WHERE department_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department head not found' });
        }
        res.json({ message: 'Department head removed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// GRADE HANDLERS
// ============================================================================

async function handleGetGrades(conn, id, res) {
    if (id) {
        const [rows] = await conn.execute(`
            SELECT g.*, 
                   e.student_id, e.course_id,
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Grades g 
            JOIN Enrollments e ON g.enrollment_id = e.enrollment_id
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            WHERE g.grade_id = ?
        `, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Grade not found' });
        }
    } else {
        const [rows] = await conn.execute(`
            SELECT g.*, 
                   e.student_id, e.course_id,
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Grades g 
            JOIN Enrollments e ON g.enrollment_id = e.enrollment_id
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            ORDER BY g.grade_date DESC
        `);
        res.json(rows);
    }
}

async function handleCreateGrade(conn, data, res) {
    try {
        const gradeDate = data.grade_date || new Date().toISOString().split('T')[0];
        const [result] = await conn.execute(
            `INSERT INTO Grades (enrollment_id, grade_value, grade_type, grade_date, description) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                data.enrollment_id,
                data.grade_value,
                data.grade_type || 'Exam',
                gradeDate,
                data.description || null
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Grade created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateGrade(conn, id, data, res) {
    try {
        await conn.execute(
            `UPDATE Grades 
             SET enrollment_id = ?, grade_value = ?, grade_type = ?, grade_date = ?, description = ? 
             WHERE grade_id = ?`,
            [
                data.enrollment_id,
                data.grade_value,
                data.grade_type || 'Exam',
                data.grade_date,
                data.description || null,
                id
            ]
        );
        res.json({ message: 'Grade updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteGrade(conn, id, res) {
    try {
        const [result] = await conn.execute('DELETE FROM Grades WHERE grade_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grade not found' });
        }
        res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/backend/api.php`);
});

module.exports = app;
