/**
 * API Handler for College Database
 * Handles all CRUD operations for different entities
 * Node.js/Express implementation
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dbConfig = require('./config.js');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
let pool;

async function initializePool() {
    pool = new Pool(dbConfig);
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
            case 'salary-payments':
                await handleGetSalaryPayments(conn, id, res);
                break;
            case 'bank-payments':
                await handleGetBankPayments(conn, id, res);
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
    
    const parts = request.split('/');
    const entity = parts[0];
    const action = parts[1] || null;
    
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
            case 'salary-payments':
                if (action === 'export') {
                    await handleExportSalaryPayments(conn, res);
                } else {
                    res.status(404).json({ error: 'Invalid endpoint' });
                }
                break;
            case 'bank-payments':
                await handleReceiveBankPayments(conn, req.body, res);
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
        const result = await conn.query('SELECT * FROM Departments WHERE department_id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } else {
        const result = await conn.query('SELECT * FROM Departments ORDER BY department_name');
        res.json(result.rows);
    }
}

async function handleCreateDepartment(conn, data, res) {
    try {
        const result = await conn.query(
            'INSERT INTO Departments (department_name, building, budget) VALUES ($1, $2, $3) RETURNING department_id',
            [data.department_name, data.building || null, data.budget || null]
        );
        res.status(201).json({ id: result.rows[0].department_id, message: 'Department created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateDepartment(conn, id, data, res) {
    try {
        await conn.query(
            'UPDATE Departments SET department_name = $1, building = $2, budget = $3 WHERE department_id = $4',
            [data.department_name, data.building || null, data.budget || null, id]
        );
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteDepartment(conn, id, res) {
    try {
        const result = await conn.query('DELETE FROM Departments WHERE department_id = $1', [id]);
        if (result.rowCount === 0) {
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
        const result = await conn.query(`
            SELECT i.*, d.department_name 
            FROM Instructors i 
            LEFT JOIN Departments d ON i.department_id = d.department_id 
            WHERE i.instructor_id = $1
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Instructor not found' });
        }
    } else {
        const result = await conn.query(`
            SELECT i.*, d.department_name 
            FROM Instructors i 
            LEFT JOIN Departments d ON i.department_id = d.department_id 
            ORDER BY i.last_name, i.first_name
        `);
        res.json(result.rows);
    }
}

async function handleCreateInstructor(conn, data, res) {
    try {
        const result = await conn.query(
            `INSERT INTO Instructors (first_name, last_name, email, phone, bank_account, department_id, salary, hire_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING instructor_id`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.phone || null,
                data.bank_account || null,
                data.department_id,
                data.salary || null,
                data.hire_date || null
            ]
        );
        res.status(201).json({ id: result.rows[0].instructor_id, message: 'Instructor created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateInstructor(conn, id, data, res) {
    try {
        await conn.query(
            `UPDATE Instructors 
             SET first_name = $1, last_name = $2, email = $3, phone = $4, bank_account = $5, department_id = $6, salary = $7, hire_date = $8 
             WHERE instructor_id = $9`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.phone || null,
                data.bank_account || null,
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
        const result = await conn.query('DELETE FROM Instructors WHERE instructor_id = $1', [id]);
        if (result.rowCount === 0) {
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
        const result = await conn.query(`
            SELECT s.*, d.department_name as major_name,
                   (SELECT AVG(g.grade_value) 
                    FROM Grades g 
                    JOIN Enrollments e ON g.enrollment_id = e.enrollment_id 
                    WHERE e.student_id = s.student_id) as gpa
            FROM Students s 
            LEFT JOIN Departments d ON s.major_department_id = d.department_id 
            WHERE s.student_id = $1
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } else {
        const result = await conn.query(`
            SELECT s.*, d.department_name as major_name,
                   (SELECT AVG(g.grade_value) 
                    FROM Grades g 
                    JOIN Enrollments e ON g.enrollment_id = e.enrollment_id 
                    WHERE e.student_id = s.student_id) as gpa
            FROM Students s 
            LEFT JOIN Departments d ON s.major_department_id = d.department_id 
            ORDER BY s.last_name, s.first_name
        `);
        res.json(result.rows);
    }
}

async function handleCreateStudent(conn, data, res) {
    try {
        const result = await conn.query(
            `INSERT INTO Students (first_name, last_name, email, phone, date_of_birth, enrollment_year, major_department_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING student_id`,
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
        res.status(201).json({ id: result.rows[0].student_id, message: 'Student created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateStudent(conn, id, data, res) {
    try {
        await conn.query(
            `UPDATE Students 
             SET first_name = $1, last_name = $2, email = $3, phone = $4, date_of_birth = $5, enrollment_year = $6, major_department_id = $7 
             WHERE student_id = $8`,
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
        const result = await conn.query('DELETE FROM Students WHERE student_id = $1', [id]);
        if (result.rowCount === 0) {
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
        const result = await conn.query(`
            SELECT c.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as instructor_name
            FROM Courses c 
            LEFT JOIN Departments d ON c.department_id = d.department_id 
            LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
            WHERE c.course_id = $1
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } else {
        const result = await conn.query(`
            SELECT c.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as instructor_name
            FROM Courses c 
            LEFT JOIN Departments d ON c.department_id = d.department_id 
            LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
            ORDER BY c.course_code
        `);
        res.json(result.rows);
    }
}

async function handleCreateCourse(conn, data, res) {
    try {
        const result = await conn.query(
            `INSERT INTO Courses (course_code, course_name, department_id, instructor_id, credits, semester, year, room_number, schedule) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING course_id`,
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
        res.status(201).json({ id: result.rows[0].course_id, message: 'Course created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateCourse(conn, id, data, res) {
    try {
        await conn.query(
            `UPDATE Courses 
             SET course_code = $1, course_name = $2, department_id = $3, instructor_id = $4, credits = $5, semester = $6, year = $7, room_number = $8, schedule = $9 
             WHERE course_id = $10`,
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
        const result = await conn.query('DELETE FROM Courses WHERE course_id = $1', [id]);
        if (result.rowCount === 0) {
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
        const result = await conn.query(`
            SELECT e.*, 
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Enrollments e 
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            WHERE e.enrollment_id = $1
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Enrollment not found' });
        }
    } else {
        const result = await conn.query(`
            SELECT e.*, 
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Enrollments e 
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            ORDER BY e.enrollment_date DESC
        `);
        res.json(result.rows);
    }
}

async function handleCreateEnrollment(conn, data, res) {
    try {
        const enrollmentDate = data.enrollment_date || new Date().toISOString().split('T')[0];
        const result = await conn.query(
            `INSERT INTO Enrollments (student_id, course_id, enrollment_date, grade, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING enrollment_id`,
            [
                data.student_id,
                data.course_id,
                enrollmentDate,
                data.grade || null,
                data.status || 'Active'
            ]
        );
        res.status(201).json({ id: result.rows[0].enrollment_id, message: 'Enrollment created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateEnrollment(conn, id, data, res) {
    try {
        await conn.query(
            `UPDATE Enrollments 
             SET student_id = $1, course_id = $2, enrollment_date = $3, grade = $4, status = $5 
             WHERE enrollment_id = $6`,
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
        const result = await conn.query('DELETE FROM Enrollments WHERE enrollment_id = $1', [id]);
        if (result.rowCount === 0) {
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
        const result = await conn.query(`
            SELECT dh.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as head_name
            FROM DepartmentHeads dh 
            LEFT JOIN Departments d ON dh.department_id = d.department_id 
            LEFT JOIN Instructors i ON dh.instructor_id = i.instructor_id
            WHERE dh.department_id = $1
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Department head not found' });
        }
    } else {
        const result = await conn.query(`
            SELECT dh.*, d.department_name, 
                   CONCAT(i.first_name, ' ', i.last_name) as head_name
            FROM DepartmentHeads dh 
            LEFT JOIN Departments d ON dh.department_id = d.department_id 
            LEFT JOIN Instructors i ON dh.instructor_id = i.instructor_id
            ORDER BY d.department_name
        `);
        res.json(result.rows);
    }
}

async function handleCreateDepartmentHead(conn, data, res) {
    try {
        const startDate = data.start_date || new Date().toISOString().split('T')[0];
        await conn.query(
            `INSERT INTO DepartmentHeads (department_id, instructor_id, start_date) 
             VALUES ($1, $2, $3)`,
            [data.department_id, data.instructor_id, startDate]
        );
        res.status(201).json({ message: 'Department head assigned successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateDepartmentHead(conn, id, data, res) {
    try {
        await conn.query(
            `UPDATE DepartmentHeads 
             SET instructor_id = $1, start_date = $2 
             WHERE department_id = $3`,
            [data.instructor_id, data.start_date, id]
        );
        res.json({ message: 'Department head updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleDeleteDepartmentHead(conn, id, res) {
    try {
        const result = await conn.query('DELETE FROM DepartmentHeads WHERE department_id = $1', [id]);
        if (result.rowCount === 0) {
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
        const result = await conn.query(`
            SELECT g.*, 
                   e.student_id, e.course_id,
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_code, c.course_name
            FROM Grades g 
            JOIN Enrollments e ON g.enrollment_id = e.enrollment_id
            LEFT JOIN Students s ON e.student_id = s.student_id 
            LEFT JOIN Courses c ON e.course_id = c.course_id
            WHERE g.grade_id = $1
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Grade not found' });
        }
    } else {
        const result = await conn.query(`
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
        res.json(result.rows);
    }
}

async function handleCreateGrade(conn, data, res) {
    try {
        const gradeDate = data.grade_date || new Date().toISOString().split('T')[0];
        const result = await conn.query(
            `INSERT INTO Grades (enrollment_id, grade_value, grade_type, grade_date, description) 
             VALUES ($1, $2, $3, $4, $5) RETURNING grade_id`,
            [
                data.enrollment_id,
                data.grade_value,
                data.grade_type || 'Exam',
                gradeDate,
                data.description || null
            ]
        );
        res.status(201).json({ id: result.rows[0].grade_id, message: 'Grade created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function handleUpdateGrade(conn, id, data, res) {
    try {
        await conn.query(
            `UPDATE Grades 
             SET enrollment_id = $1, grade_value = $2, grade_type = $3, grade_date = $4, description = $5 
             WHERE grade_id = $6`,
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
        const result = await conn.query('DELETE FROM Grades WHERE grade_id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Grade not found' });
        }
        res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ============================================================================
// SALARY PAYMENT & BANK HANDLERS
// ============================================================================

async function handleGetSalaryPayments(conn, id, res) {
    const baseQuery = `
        SELECT sp.*, 
               CONCAT(i.first_name, ' ', i.last_name) as instructor_name,
               bp.status as bank_status,
               bp.processed_at as bank_processed_at
        FROM SalaryPayments sp
        JOIN Instructors i ON sp.instructor_id = i.instructor_id
        LEFT JOIN BankPayments bp ON sp.bank_payment_id = bp.bank_payment_id
    `;

    if (id) {
        const result = await conn.query(`${baseQuery} WHERE sp.payment_id = $1`, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Salary payment not found' });
        }
    } else {
        const result = await conn.query(`${baseQuery} ORDER BY sp.created_at DESC`);
        res.json(result.rows);
    }
}

async function handleGetBankPayments(conn, id, res) {
    const baseQuery = `
        SELECT bp.*, sp.reference as salary_reference,
               CONCAT(i.first_name, ' ', i.last_name) as instructor_name
        FROM BankPayments bp
        LEFT JOIN SalaryPayments sp ON bp.salary_payment_id = sp.payment_id
        LEFT JOIN Instructors i ON sp.instructor_id = i.instructor_id
    `;

    if (id) {
        const result = await conn.query(`${baseQuery} WHERE bp.bank_payment_id = $1`, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Bank payment not found' });
        }
    } else {
        const result = await conn.query(`${baseQuery} ORDER BY bp.created_at DESC`);
        res.json(result.rows);
    }
}

async function handleExportSalaryPayments(conn, res) {
    const client = await conn.connect();
    try {
        await client.query('BEGIN');
        const inserted = await client.query(`
            INSERT INTO SalaryPayments (instructor_id, amount, recipient_account, reference, status)
            SELECT instructor_id,
                   salary,
                   bank_account,
                   CONCAT('SALARY-', instructor_id, '-', TO_CHAR(CURRENT_DATE, 'YYYYMMDD')),
                   'pending'
            FROM Instructors
            WHERE salary IS NOT NULL AND bank_account IS NOT NULL
            RETURNING payment_id, instructor_id, amount, recipient_account, reference, status
        `);

        if (inserted.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(200).json({ message: 'No instructors with salary and bank account found.', payments: [] });
        }

        const bankResults = await receiveBankPaymentsWithClient(client, inserted.rows);
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Salary payments exported to bank.',
            payments: bankResults
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
}

async function handleReceiveBankPayments(conn, body, res) {
    const payments = Array.isArray(body) ? body : body.payments;
    if (!payments || payments.length === 0) {
        return res.status(400).json({ error: 'No payments provided.' });
    }

    try {
        const results = await receiveBankPayments(conn, payments);
        res.status(201).json({ message: 'Bank processed payments.', payments: results });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function receiveBankPayments(conn, payments) {
    const client = await conn.connect();
    try {
        await client.query('BEGIN');
        const results = await receiveBankPaymentsWithClient(client, payments);
        await client.query('COMMIT');
        return results;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function receiveBankPaymentsWithClient(client, payments) {
    const results = [];
    for (const payment of payments) {
        const salaryPaymentId = payment.salary_payment_id || payment.payment_id || null;
        const bankResult = await client.query(
            `INSERT INTO BankPayments (salary_payment_id, recipient_account, amount, reference, status, processed_at)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
             RETURNING bank_payment_id, status, processed_at`,
            [
                salaryPaymentId,
                payment.recipient_account,
                payment.amount,
                payment.reference || null,
                'processed'
            ]
        );

        const bankRow = bankResult.rows[0];
        if (salaryPaymentId) {
            await client.query(
                'UPDATE SalaryPayments SET status = $1, bank_payment_id = $2 WHERE payment_id = $3',
                ['processed', bankRow.bank_payment_id, salaryPaymentId]
            );
        }

        results.push({
            ...payment,
            salary_payment_id: salaryPaymentId,
            bank_payment_id: bankRow.bank_payment_id,
            bank_status: bankRow.status,
            processed_at: bankRow.processed_at
        });
    }
    return results;
}

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/backend/api.php`);
});

module.exports = app;
