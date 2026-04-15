/**
 * API Handler for College Database
 * PostgreSQL + Express implementation
 * Compatible endpoint: /backend/api.php
 */

const express = require('express');
const cors = require('cors');
const db = require('./config.js'); // pg Pool

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// MySQL-style execute adapter (so queries with ? still work)
// ============================================================================

const conn = {
  async execute(sql, params = []) {
    let i = 0;
    let pgSql = sql.replace(/\?/g, () => `$${++i}`);

    // MySQL CONCAT(...) -> PostgreSQL ||
    pgSql = pgSql.replace(/CONCAT\s*\(([^)]+)\)/gi, (_, args) =>
      args.split(',').map((s) => s.trim()).join(' || ')
    );

    const result = await db.query(pgSql, params);

    if (/^\s*insert/i.test(pgSql)) {
      return [{ insertId: result.rows?.[0]?.id ?? null, affectedRows: result.rowCount }];
    }
    if (/^\s*(update|delete)/i.test(pgSql)) {
      return [{ affectedRows: result.rowCount }];
    }
    return [result.rows];
  }
};

// ============================================================================
// ROUTES
// ============================================================================

app.get('/backend/api.php', async (req, res) => {
  const request = req.query.request;
  if (!request) return res.status(404).json({ error: 'Invalid endpoint' });

  const parts = request.split('/');
  const entity = parts[0];
  const id = parts[1] || null;

  console.log('content-type:', req.headers['content-type']);
console.log('body:', req.body);

  try {
    switch (entity) {
      case 'departments': return handleGetDepartments(conn, id, res);
      case 'instructors': return handleGetInstructors(conn, id, res);
      case 'students': return handleGetStudents(conn, id, res);
      case 'courses': return handleGetCourses(conn, id, res);
      case 'enrollments': return handleGetEnrollments(conn, id, res);
      case 'department-heads': return handleGetDepartmentHeads(conn, id, res);
      case 'salary-payments': return handleCreateSalaryPayment(conn, req.body, res);
      default: return res.status(404).json({ error: 'Invalid endpoint' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

app.post('/backend/api.php', async (req, res) => {
  const request = req.query.request;
  if (!request) return res.status(404).json({ error: 'Invalid endpoint' });

  const entity = request.split('/')[0];

  try {
    switch (entity) {
      case 'departments': return handleCreateDepartment(conn, req.body, res);
      case 'instructors': return handleCreateInstructor(conn, req.body, res);
      case 'students': return handleCreateStudent(conn, req.body, res);
      case 'courses': return handleCreateCourse(conn, req.body, res);
      case 'enrollments': return handleCreateEnrollment(conn, req.body, res);
      case 'department-heads': return handleCreateDepartmentHead(conn, req.body, res);
      case 'salary-payments': return handleCreateSalaryPayment(conn, req.body, res); // NEW
      default: return res.status(404).json({ error: 'Invalid endpoint' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

app.put('/backend/api.php', async (req, res) => {
  const request = req.query.request;
  if (!request) return res.status(404).json({ error: 'Invalid endpoint' });

  const parts = request.split('/');
  const entity = parts[0];
  const id = parts[1];
  if (!id) return res.status(400).json({ error: 'ID is required for update' });

  try {
    switch (entity) {
      case 'departments': return handleUpdateDepartment(conn, id, req.body, res);
      case 'instructors': return handleUpdateInstructor(conn, id, req.body, res);
      case 'students': return handleUpdateStudent(conn, id, req.body, res);
      case 'courses': return handleUpdateCourse(conn, id, req.body, res);
      case 'enrollments': return handleUpdateEnrollment(conn, id, req.body, res);
      case 'department-heads': return handleUpdateDepartmentHead(conn, id, req.body, res);
      default: return res.status(404).json({ error: 'Invalid endpoint' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

app.delete('/backend/api.php', async (req, res) => {
  const request = req.query.request;
  if (!request) return res.status(404).json({ error: 'Invalid endpoint' });

  const parts = request.split('/');
  const entity = parts[0];
  const id = parts[1];
  if (!id) return res.status(400).json({ error: 'ID is required for delete' });

  try {
    switch (entity) {
      case 'departments': return handleDeleteDepartment(conn, id, res);
      case 'instructors': return handleDeleteInstructor(conn, id, res);
      case 'students': return handleDeleteStudent(conn, id, res);
      case 'courses': return handleDeleteCourse(conn, id, res);
      case 'enrollments': return handleDeleteEnrollment(conn, id, res);
      case 'department-heads': return handleDeleteDepartmentHead(conn, id, res);
      default: return res.status(404).json({ error: 'Invalid endpoint' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

app.options('/backend/api.php', (req, res) => res.status(200).end());

// ============================================================================
// Departments
// ============================================================================

async function handleGetDepartments(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute('SELECT * FROM departments WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Department not found' });
    return res.json(rows[0]);
  }
  const [rows] = await conn.execute('SELECT * FROM departments ORDER BY name');
  return res.json(rows);
}

async function handleCreateDepartment(conn, data, res) {
  const [result] = await conn.execute(
    `INSERT INTO departments (name, description)
     VALUES (?, ?)
     RETURNING id`,
    [data.name, data.description || null]
  );
  return res.status(201).json({ id: result.insertId, message: 'Department created successfully' });
}

async function handleUpdateDepartment(conn, id, data, res) {
  const [result] = await conn.execute(
    'UPDATE departments SET name = ?, description = ? WHERE id = ?',
    [data.name, data.description || null, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Department not found' });
  return res.json({ message: 'Department updated successfully' });
}

async function handleDeleteDepartment(conn, id, res) {
  const [result] = await conn.execute('DELETE FROM departments WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Department not found' });
  return res.json({ message: 'Department deleted successfully' });
}

// ============================================================================
// Instructors
// ============================================================================

async function handleGetInstructors(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute(`
      SELECT i.*, d.name AS department_name
      FROM instructors i
      LEFT JOIN departments d ON i.department_id = d.id
      WHERE i.id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Instructor not found' });
    return res.json(rows[0]);
  }

  const [rows] = await conn.execute(`
    SELECT i.*, d.name AS department_name
    FROM instructors i
    LEFT JOIN departments d ON i.department_id = d.id
    ORDER BY i.last_name, i.first_name
  `);
  return res.json(rows);
}

async function handleCreateInstructor(conn, data, res) {
  const [result] = await conn.execute(
    `INSERT INTO instructors (first_name, last_name, email, phone, salary, hire_date, department_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING id`,
    [
      data.first_name,
      data.last_name,
      data.email || null,
      data.phone || null,
      data.salary || null,
      data.hire_date || null,
      data.department_id || null
    ]
  );
  return res.status(201).json({ id: result.insertId, message: 'Instructor created successfully' });
}

async function handleUpdateInstructor(conn, id, data, res) {
  const [result] = await conn.execute(
    `UPDATE instructors
     SET first_name = ?, last_name = ?, email = ?, phone = ?, salary = ?, hire_date = ?, department_id = ?
     WHERE id = ?`,
    [
      data.first_name,
      data.last_name,
      data.email || null,
      data.phone || null,
      data.salary || null,
      data.hire_date || null,
      data.department_id || null,
      id
    ]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Instructor not found' });
  return res.json({ message: 'Instructor updated successfully' });
}

async function handleDeleteInstructor(conn, id, res) {
  const [result] = await conn.execute('DELETE FROM instructors WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Instructor not found' });
  return res.json({ message: 'Instructor deleted successfully' });
}

// ============================================================================
// Students
// ============================================================================

async function handleGetStudents(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute('SELECT * FROM students WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Student not found' });
    return res.json(rows[0]);
  }
  const [rows] = await conn.execute('SELECT * FROM students ORDER BY last_name, first_name');
  return res.json(rows);
}

async function handleCreateStudent(conn, data, res) {
  const [result] = await conn.execute(
    `INSERT INTO students (first_name, last_name, email, birth_date, group_name)
     VALUES (?, ?, ?, ?, ?)
     RETURNING id`,
    [
      data.first_name,
      data.last_name,
      data.email || null,
      data.birth_date || null,
      data.group_name || null
    ]
  );
  return res.status(201).json({ id: result.insertId, message: 'Student created successfully' });
}

async function handleUpdateStudent(conn, id, data, res) {
  const [result] = await conn.execute(
    `UPDATE students
     SET first_name = ?, last_name = ?, email = ?, birth_date = ?, group_name = ?
     WHERE id = ?`,
    [
      data.first_name,
      data.last_name,
      data.email || null,
      data.birth_date || null,
      data.group_name || null,
      id
    ]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
  return res.json({ message: 'Student updated successfully' });
}

async function handleDeleteStudent(conn, id, res) {
  const [result] = await conn.execute('DELETE FROM students WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
  return res.json({ message: 'Student deleted successfully' });
}

// ============================================================================
// Courses
// ============================================================================

async function handleGetCourses(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute(`
      SELECT c.*, d.name AS department_name, (i.first_name || ' ' || i.last_name) AS instructor_name
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN instructors i ON c.instructor_id = i.id
      WHERE c.id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Course not found' });
    return res.json(rows[0]);
  }

  const [rows] = await conn.execute(`
    SELECT c.*, d.name AS department_name, (i.first_name || ' ' || i.last_name) AS instructor_name
    FROM courses c
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN instructors i ON c.instructor_id = i.id
    ORDER BY c.code
  `);
  return res.json(rows);
}

async function handleCreateCourse(conn, data, res) {
  const [result] = await conn.execute(
    `INSERT INTO courses (name, code, credits, department_id, instructor_id, semester)
     VALUES (?, ?, ?, ?, ?, ?)
     RETURNING id`,
    [
      data.name,
      data.code || null,
      data.credits || 3,
      data.department_id || null,
      data.instructor_id || null,
      data.semester || null
    ]
  );
  return res.status(201).json({ id: result.insertId, message: 'Course created successfully' });
}

async function handleUpdateCourse(conn, id, data, res) {
  const [result] = await conn.execute(
    `UPDATE courses
     SET name = ?, code = ?, credits = ?, department_id = ?, instructor_id = ?, semester = ?
     WHERE id = ?`,
    [
      data.name,
      data.code || null,
      data.credits || 3,
      data.department_id || null,
      data.instructor_id || null,
      data.semester || null,
      id
    ]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Course not found' });
  return res.json({ message: 'Course updated successfully' });
}

async function handleDeleteCourse(conn, id, res) {
  const [result] = await conn.execute('DELETE FROM courses WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Course not found' });
  return res.json({ message: 'Course deleted successfully' });
}

// ============================================================================
// Enrollments
// ============================================================================

async function handleGetEnrollments(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute(`
      SELECT e.*, (s.first_name || ' ' || s.last_name) AS student_name, c.code AS course_code, c.name AS course_name
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Enrollment not found' });
    return res.json(rows[0]);
  }

  const [rows] = await conn.execute(`
    SELECT e.*, (s.first_name || ' ' || s.last_name) AS student_name, c.code AS course_code, c.name AS course_name
    FROM enrollments e
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    ORDER BY e.enrollment_date DESC
  `);
  return res.json(rows);
}

async function handleCreateEnrollment(conn, data, res) {
  const enrollmentDate = data.enrollment_date || new Date().toISOString().split('T')[0];
  const [result] = await conn.execute(
    `INSERT INTO enrollments (student_id, course_id, enrollment_date, grade, comment)
     VALUES (?, ?, ?, ?, ?)
     RETURNING id`,
    [
      data.student_id,
      data.course_id,
      enrollmentDate,
      data.grade ?? null,
      data.comment || null
    ]
  );
  return res.status(201).json({ id: result.insertId, message: 'Enrollment created successfully' });
}

async function handleUpdateEnrollment(conn, id, data, res) {
  const [result] = await conn.execute(
    `UPDATE enrollments
     SET student_id = ?, course_id = ?, enrollment_date = ?, grade = ?, comment = ?
     WHERE id = ?`,
    [
      data.student_id,
      data.course_id,
      data.enrollment_date,
      data.grade ?? null,
      data.comment || null,
      id
    ]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Enrollment not found' });
  return res.json({ message: 'Enrollment updated successfully' });
}

async function handleDeleteEnrollment(conn, id, res) {
  const [result] = await conn.execute('DELETE FROM enrollments WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Enrollment not found' });
  return res.json({ message: 'Enrollment deleted successfully' });
}

// ============================================================================
// Department Heads
// ============================================================================

async function handleGetDepartmentHeads(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute(`
      SELECT dh.*, d.name AS department_name, (i.first_name || ' ' || i.last_name) AS head_name
      FROM department_heads dh
      LEFT JOIN departments d ON dh.department_id = d.id
      LEFT JOIN instructors i ON dh.instructor_id = i.id
      WHERE dh.department_id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Department head not found' });
    return res.json(rows[0]);
  }

  const [rows] = await conn.execute(`
    SELECT dh.*, d.name AS department_name, (i.first_name || ' ' || i.last_name) AS head_name
    FROM department_heads dh
    LEFT JOIN departments d ON dh.department_id = d.id
    LEFT JOIN instructors i ON dh.instructor_id = i.id
    ORDER BY d.name
  `);
  return res.json(rows);
}

async function handleCreateDepartmentHead(conn, data, res) {
  await conn.execute(
    `INSERT INTO department_heads (department_id, instructor_id, assigned_at)
     VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP))`,
    [data.department_id, data.instructor_id, data.assigned_at || null]
  );
  return res.status(201).json({ message: 'Department head assigned successfully' });
}

async function handleUpdateDepartmentHead(conn, id, data, res) {
  const [result] = await conn.execute(
    `UPDATE department_heads
     SET instructor_id = ?, assigned_at = COALESCE(?, assigned_at)
     WHERE department_id = ?`,
    [data.instructor_id, data.assigned_at || null, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Department head not found' });
  return res.json({ message: 'Department head updated successfully' });
}

async function handleDeleteDepartmentHead(conn, id, res) {
  const [result] = await conn.execute('DELETE FROM department_heads WHERE department_id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Department head not found' });
  return res.json({ message: 'Department head removed successfully' });
}

// ============================================================================
// Payments (for assignment)
// Table: payments_outbox
// ============================================================================

async function handleGetPayments(conn, id, res) {
  if (id) {
    const [rows] = await conn.execute(`
      SELECT p.*, (i.first_name || ' ' || i.last_name) AS instructor_name
      FROM payments_outbox p
      LEFT JOIN instructors i ON i.id = p.instructor_id
      WHERE p.id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Payment not found' });
    return res.json(rows[0]);
  }

  const [rows] = await conn.execute(`
    SELECT p.*, (i.first_name || ' ' || i.last_name) AS instructor_name
    FROM payments_outbox p
    LEFT JOIN instructors i ON i.id = p.instructor_id
    ORDER BY p.created_at DESC
  `);
  return res.json(rows);
}

// POST ?request=salary-payments
// body: { instructor_id, amount, iban, description, currency }
async function handleCreateSalaryPayment(conn, data, res) {
  data = data || {};

  if (!data.instructor_id || !data.amount || !data.iban) {
    return res.status(400).json({
      error: 'instructor_id, amount and iban are required'
    });
  }

  const [result] = await conn.execute(
    `INSERT INTO payments_outbox (instructor_id, amount, currency, iban, description, status)
     VALUES (?, ?, ?, ?, ?, 'pending')
     RETURNING id`,
    [
      data.instructor_id,
      data.amount,
      data.currency || 'EUR',
      data.iban,
      data.description || 'Salary payment'
    ]
  );

  return res.status(201).json({
    id: result.insertId,
    message: 'Salary payment queued (pending)'
  });
}

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://127.0.0.1:${PORT}/backend/api.php`);
});
module.exports = app;